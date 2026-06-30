import { createClient } from 'npm:@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { fleet_id, mission_type, target_coords, cargo, hold_time = 0 } = await req.json();
    if (!fleet_id || !mission_type || !target_coords) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('VITE_PUBLIC_SUPABASE_URL') ?? '',
      Deno.env.get('VITE_PUBLIC_SUPABASE_ANON_KEY') ?? ''
    );

    // Get fleet data
    const { data: fleet, error: fleetErr } = await supabase
      .from('fleets')
      .select('*')
      .eq('id', fleet_id)
      .single();
    if (fleetErr || !fleet) {
      return new Response(JSON.stringify({ error: 'Fleet not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get origin planet
    const { data: originPlanet } = await supabase
      .from('planets')
      .select('*')
      .eq('id', fleet.origin_planet_id)
      .single();

    // Calculate travel time based on distance and slowest ship
    const ships = fleet.ships || {};
    let slowestSpeed = 999999;
    const shipSpeeds: Record<string, number> = {
      light_fighter: 12500, heavy_fighter: 10000, cruiser: 15000,
      battleship: 10000, battlecruiser: 10000, bomber: 4000,
      destroyer: 5000, deathstar: 100, small_cargo: 5000,
      large_cargo: 7500, colony_ship: 2500, recycler: 2000,
      espionage_probe: 100000, solar_satellite: 0,
    };
    let totalShips = 0;
    for (const [type, count] of Object.entries(ships)) {
      if (typeof count === 'number' && count > 0) {
        const speed = shipSpeeds[type] || 5000;
        if (speed > 0 && speed < slowestSpeed) slowestSpeed = speed;
        totalShips += count;
      }
    }

    // Get server settings for fleet speed
    const { data: speedSetting } = await supabase
      .from('server_settings')
      .select('value')
      .eq('key', 'fleet_speed')
      .single();
    const fleetSpeedMult = parseFloat(speedSetting?.value ?? '1') || 1;

    // Distance calculation
    const dx = Math.abs((target_coords.galaxy || 1) - (originPlanet?.position_galaxy || 1));
    const dy = Math.abs((target_coords.system || 1) - (originPlanet?.position_system || 1));
    const dz = Math.abs((target_coords.planet || 1) - (originPlanet?.position_planet || 1));
    let distance = 0;
    if (dx > 0) distance = dx * 20000;
    else if (dy > 0) distance = dy * 95 + 2700;
    else distance = dz * 5 + 1000;

    // Duration: distance / (slowestSpeed * fleetSpeedMult), minimum 2 minutes
    let durationSeconds = Math.round((distance * 3500) / (slowestSpeed * fleetSpeedMult));
    durationSeconds = Math.max(durationSeconds, 120);

    // Round-trip for some missions
    const roundTripMissions = ['attack', 'espionage', 'recycle', 'colonization', 'acs'];
    const isRoundTrip = roundTripMissions.includes(mission_type);
    const arrivalOffset = durationSeconds;
    const returnOffset = isRoundTrip ? durationSeconds * 2 + (hold_time * 60) : 0;

    const now = new Date();
    const arrivalTime = new Date(now.getTime() + arrivalOffset * 1000);
    const returnTime = returnOffset > 0 ? new Date(now.getTime() + returnOffset * 1000) : null;

    // Create fleet mission record
    const { data: mission, error: missionErr } = await supabase
      .from('fleet_missions')
      .insert({
        fleet_id,
        user_id: fleet.user_id,
        mission_type,
        status: 'departing',
        origin_galaxy: originPlanet?.position_galaxy || 1,
        origin_system: originPlanet?.position_system || 1,
        origin_planet: originPlanet?.position_planet || 1,
        target_galaxy: target_coords.galaxy || 1,
        target_system: target_coords.system || 1,
        target_planet: target_coords.planet || 1,
        ships,
        cargo_metal: cargo?.metal || 0,
        cargo_crystal: cargo?.crystal || 0,
        cargo_deuterium: cargo?.deuterium || 0,
        departure_time: now.toISOString(),
        arrival_time: arrivalTime.toISOString(),
        return_time: returnTime?.toISOString() || null,
        hold_time,
      })
      .select()
      .single();

    if (missionErr) {
      return new Response(JSON.stringify({ error: missionErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update fleet status
    await supabase.from('fleets').update({
      mission: mission_type,
      status: isRoundTrip ? 'departing' : 'one_way',
      dest_galaxy: target_coords.galaxy,
      dest_system: target_coords.system,
      dest_planet: target_coords.planet,
      dest_coords: `${target_coords.galaxy}:${target_coords.system}:${target_coords.planet}`,
      departure_time: now.toISOString(),
      arrival_time: arrivalTime.toISOString(),
      return_time: returnTime?.toISOString() || null,
      cargo_metal: cargo?.metal || 0,
      cargo_crystal: cargo?.crystal || 0,
      cargo_deuterium: cargo?.deuterium || 0,
    }).eq('id', fleet_id);

    // Deduct fuel (deuterium) from planet - 1 deuterium per ship per 10000 distance, min 10
    const fuelCost = Math.max(Math.round((distance / 10000) * totalShips), 10);
    if (fuelCost > 0 && originPlanet) {
      await supabase.rpc('deduct_resources', {
        p_user_id: fleet.user_id,
        p_metal: 0,
        p_crystal: 0,
        p_deuterium: fuelCost,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      mission,
      travel_time_seconds: durationSeconds,
      arrival_time: arrivalTime.toISOString(),
      return_time: returnTime?.toISOString() || null,
      fuel_cost: fuelCost,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

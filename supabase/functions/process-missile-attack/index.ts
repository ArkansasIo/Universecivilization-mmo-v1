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
    const { attacker_id, attacker_planet_id, target_coords, target_user_id, ipm_count, primary_target } = await req.json();
    if (!attacker_id || !ipm_count || !target_coords) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('VITE_PUBLIC_SUPABASE_URL') ?? '',
      Deno.env.get('VITE_PUBLIC_SUPABASE_ANON_KEY') ?? ''
    );

    // Verify attacker has enough missiles on the attacking planet
    const { data: attackerShips } = await supabase
      .from('ships')
      .select('*')
      .eq('planet_id', attacker_planet_id)
      .eq('ship_type', 'interplanetary_missile')
      .single();

    const availableMissiles = attackerShips?.quantity || 0;
    if (availableMissiles < ipm_count) {
      return new Response(JSON.stringify({ error: 'Not enough interplanetary missiles', available: availableMissiles }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deduct missiles
    await supabase.from('ships')
      .update({ quantity: availableMissiles - ipm_count })
      .eq('id', attackerShips.id);

    // Calculate travel time - 30 minutes base + distance factor
    const dx = Math.abs((target_coords.galaxy || 1) - 1);
    const dy = Math.abs((target_coords.system || 1) - 1);
    let travelSeconds = 1800;
    if (dx > 0) travelSeconds += dx * 3600;
    else if (dy > 0) travelSeconds += dy * 120;

    const arrivalTime = new Date(Date.now() + travelSeconds * 1000);

    // Create missile attack record
    const { data: attack, error: attackErr } = await supabase
      .from('missile_attacks')
      .insert({
        attacker_id,
        attacker_planet_id,
        target_id: target_user_id || null,
        galaxy: target_coords.galaxy,
        system: target_coords.system,
        planet: target_coords.planet,
        ipm_count,
        primary_target: primary_target || 'missile_launcher',
        status: 'in_flight',
        arrival_time: arrivalTime.toISOString(),
      })
      .select()
      .single();

    if (attackErr) {
      return new Response(JSON.stringify({ error: attackErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      attack,
      arrival_time: arrivalTime.toISOString(),
      travel_seconds: travelSeconds,
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

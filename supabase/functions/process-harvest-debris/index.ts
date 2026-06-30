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
    const { fleet_id, mission_id, target_galaxy, target_system, target_planet, recycler_cargo_capacity } = await req.json();

    if (!fleet_id || target_galaxy == null || target_system == null || target_planet == null) {
      return new Response(JSON.stringify({ error: 'Missing required fields: fleet_id, target_galaxy, target_system, target_planet' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('VITE_PUBLIC_SUPABASE_URL') ?? '',
      Deno.env.get('VITE_PUBLIC_SUPABASE_ANON_KEY') ?? ''
    );

    // Get the fleet data
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

    // Look up the debris field at these coordinates
    const { data: debrisField, error: debrisErr } = await supabase
      .from('debris_fields')
      .select('*')
      .eq('galaxy', target_galaxy)
      .eq('system', target_system)
      .eq('planet', target_planet)
      .maybeSingle();

    if (!debrisField) {
      return new Response(JSON.stringify({
        success: false,
        harvested: { metal: 0, crystal: 0, deuterium: 0 },
        message: 'No debris field found at these coordinates. The field may have already been harvested.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate total available debris
    const totalMetal = Number(debrisField.metal) || 0;
    const totalCrystal = Number(debrisField.crystal) || 0;
    const totalDeuterium = Number(debrisField.deuterium) || 0;

    // Use provided cargo capacity or calculate from fleet ships
    let cargoCapacity = recycler_cargo_capacity || 0;
    if (!cargoCapacity && fleet.ships) {
      const recyclerCount = (fleet.ships as Record<string, number>)['recycler'] || 0;
      const largeCargoCount = (fleet.ships as Record<string, number>)['large_cargo'] || 0;
      const smallCargoCount = (fleet.ships as Record<string, number>)['small_cargo'] || 0;
      cargoCapacity = (recyclerCount * 20000) + (largeCargoCount * 25000) + (smallCargoCount * 5000);
    }

    // Harvest: fill cargo, prioritizing metal, then crystal, then deuterium
    let remaining = cargoCapacity;
    let harvestedMetal = 0;
    let harvestedCrystal = 0;
    let harvestedDeuterium = 0;

    harvestedMetal = Math.min(totalMetal, remaining);
    remaining -= harvestedMetal;

    if (remaining > 0) {
      harvestedCrystal = Math.min(totalCrystal, remaining);
      remaining -= harvestedCrystal;
    }

    if (remaining > 0) {
      harvestedDeuterium = Math.min(totalDeuterium, remaining);
      remaining -= harvestedDeuterium;
    }

    // Calculate what's left in the debris field
    const remainingMetal = totalMetal - harvestedMetal;
    const remainingCrystal = totalCrystal - harvestedCrystal;
    const remainingDeuterium = totalDeuterium - harvestedDeuterium;
    const totalRemaining = remainingMetal + remainingCrystal + remainingDeuterium;

    // If field is completely harvested, delete it. Otherwise, update it.
    if (totalRemaining <= 0) {
      await supabase
        .from('debris_fields')
        .delete()
        .eq('id', debrisField.id);
    } else {
      await supabase
        .from('debris_fields')
        .update({
          metal: remainingMetal,
          crystal: remainingCrystal,
          deuterium: remainingDeuterium,
          updated_at: new Date().toISOString(),
        })
        .eq('id', debrisField.id);
    }

    // Update fleet cargo with what was harvested
    // NOTE: Resources are credited to the player by the fleet return handler (handleFleetReturn)
    // to avoid double-crediting. This function only manages debris fields and fleet cargo state.
    await supabase
      .from('fleets')
      .update({
        cargo_metal: harvestedMetal,
        cargo_crystal: harvestedCrystal,
        cargo_deuterium: harvestedDeuterium,
      })
      .eq('id', fleet_id);

    // Update fleet mission record if it exists
    if (mission_id) {
      await supabase
        .from('fleet_missions')
        .update({
          status: 'completed',
          cargo_metal: harvestedMetal,
          cargo_crystal: harvestedCrystal,
          cargo_deuterium: harvestedDeuterium,
        })
        .eq('id', mission_id);
    }

    return new Response(JSON.stringify({
      success: true,
      harvested: {
        metal: harvestedMetal,
        crystal: harvestedCrystal,
        deuterium: harvestedDeuterium,
      },
      remaining: {
        metal: remainingMetal,
        crystal: remainingCrystal,
        deuterium: remainingDeuterium,
      },
      field_cleared: totalRemaining <= 0,
      cargo_capacity: cargoCapacity,
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

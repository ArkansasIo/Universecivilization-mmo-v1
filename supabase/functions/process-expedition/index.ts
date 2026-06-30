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
    const { fleet_id, user_id } = await req.json();
    if (!fleet_id) {
      return new Response(JSON.stringify({ error: 'Missing fleet_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('VITE_PUBLIC_SUPABASE_URL') ?? '',
      Deno.env.get('VITE_PUBLIC_SUPABASE_ANON_KEY') ?? ''
    );

    // Get fleet data
    const { data: fleet } = await supabase.from('fleets').select('*').eq('id', fleet_id).single();
    if (!fleet) {
      return new Response(JSON.stringify({ error: 'Fleet not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Outcome weights (OGameX-style)
    const outcomes = [
      { type: 'nothing', weight: 20 },
      { type: 'resources_small', weight: 18 },
      { type: 'resources_medium', weight: 10 },
      { type: 'resources_large', weight: 5 },
      { type: 'fleet_small', weight: 12 },
      { type: 'fleet_medium', weight: 6 },
      { type: 'fleet_large', weight: 2 },
      { type: 'dark_matter', weight: 10 },
      { type: 'delay', weight: 8 },
      { type: 'early_return', weight: 4 },
      { type: 'pirates', weight: 5 },
    ];

    const totalWeight = outcomes.reduce((sum, o) => sum + o.weight, 0);
    let randomRoll = Math.random() * totalWeight;
    let selectedOutcome = outcomes[0];
    for (const o of outcomes) {
      randomRoll -= o.weight;
      if (randomRoll <= 0) {
        selectedOutcome = o;
        break;
      }
    }

    let result: Record<string, unknown> = { outcome_type: selectedOutcome.type };

    switch (selectedOutcome.type) {
      case 'resources_small': {
        const metal = Math.floor(Math.random() * 50000) + 10000;
        const crystal = Math.floor(Math.random() * 25000) + 5000;
        result = {
          outcome_type: 'resources_small',
          resources_found: { metal, crystal, deuterium: 0 },
          message: `Your expedition discovered a small asteroid field rich in resources. Found ${metal.toLocaleString()} metal and ${crystal.toLocaleString()} crystal.`,
        };
        if (user_id) {
          await supabase.rpc('add_resources', {
            p_user_id: user_id,
            p_metal: metal,
            p_crystal: crystal,
            p_deuterium: 0,
          });
        }
        break;
      }
      case 'resources_medium': {
        const metal = Math.floor(Math.random() * 200000) + 50000;
        const crystal = Math.floor(Math.random() * 100000) + 25000;
        const deuterium = Math.floor(Math.random() * 50000) + 10000;
        result = {
          outcome_type: 'resources_medium',
          resources_found: { metal, crystal, deuterium },
          message: `Your expedition located a derelict freighter convoy. Salvaged ${metal.toLocaleString()} metal, ${crystal.toLocaleString()} crystal, and ${deuterium.toLocaleString()} deuterium.`,
        };
        if (user_id) {
          await supabase.rpc('add_resources', {
            p_user_id: user_id,
            p_metal: metal,
            p_crystal: crystal,
            p_deuterium: deuterium,
          });
        }
        break;
      }
      case 'resources_large': {
        const metal = Math.floor(Math.random() * 1000000) + 200000;
        const crystal = Math.floor(Math.random() * 500000) + 100000;
        const deuterium = Math.floor(Math.random() * 200000) + 50000;
        result = {
          outcome_type: 'resources_large',
          resources_found: { metal, crystal, deuterium },
          message: `INCREDIBLE FIND! Your expedition discovered an ancient resource cache. Recovered ${metal.toLocaleString()} metal, ${crystal.toLocaleString()} crystal, and ${deuterium.toLocaleString()} deuterium!`,
        };
        if (user_id) {
          await supabase.rpc('add_resources', {
            p_user_id: user_id,
            p_metal: metal,
            p_crystal: crystal,
            p_deuterium: deuterium,
          });
        }
        break;
      }
      case 'fleet_small': {
        const ships: Record<string, number> = {};
        const count = Math.floor(Math.random() * 5) + 1;
        const types = ['light_fighter', 'espionage_probe', 'small_cargo'];
        const type = types[Math.floor(Math.random() * types.length)];
        ships[type] = count;
        result = {
          outcome_type: 'fleet_small',
          ships_found: ships,
          message: `Your expedition encountered a damaged fleet and managed to recover ${count} ${type.replace(/_/g, ' ')}(s).`,
        };
        break;
      }
      case 'fleet_medium': {
        const ships: Record<string, number> = {};
        const count = Math.floor(Math.random() * 10) + 3;
        const types = ['cruiser', 'heavy_fighter', 'large_cargo'];
        const type = types[Math.floor(Math.random() * types.length)];
        ships[type] = count;
        result = {
          outcome_type: 'fleet_medium',
          ships_found: ships,
          message: `Your expedition found an abandoned shipyard with ${count} functional ${type.replace(/_/g, ' ')}(s).`,
        };
        break;
      }
      case 'fleet_large': {
        const ships: Record<string, number> = {};
        const count = Math.floor(Math.random() * 3) + 1;
        const types = ['battleship', 'battlecruiser'];
        const type = types[Math.floor(Math.random() * types.length)];
        ships[type] = count;
        result = {
          outcome_type: 'fleet_large',
          ships_found: ships,
          message: `RARE DISCOVERY! Your expedition recovered ${count} ${type.replace(/_/g, ' ')}(s) from a hidden military outpost!`,
        };
        break;
      }
      case 'dark_matter': {
        const dm = Math.floor(Math.random() * 500) + 100;
        result = {
          outcome_type: 'dark_matter',
          dark_matter_found: dm,
          message: `Your expedition discovered a strange energy anomaly. Harvested ${dm} units of dark matter.`,
        };
        break;
      }
      case 'delay': {
        const delayHours = Math.floor(Math.random() * 4) + 1;
        result = {
          outcome_type: 'delay',
          delay_hours: delayHours,
          message: `A solar storm forced your expedition to take shelter. Return delayed by ${delayHours} hours.`,
        };
        break;
      }
      case 'early_return': {
        result = {
          outcome_type: 'early_return',
          message: 'Your expedition found nothing of interest and decided to return early.',
        };
        break;
      }
      case 'pirates': {
        const ships = fleet.ships || {};
        const lossPercent = Math.random() * 0.3 + 0.1; // 10-40% loss
        const shipsLost: Record<string, number> = {};
        for (const [type, count] of Object.entries(ships)) {
          if (typeof count === 'number') {
            const lost = Math.floor(count * lossPercent);
            if (lost > 0) shipsLost[type] = lost;
          }
        }
        result = {
          outcome_type: 'pirates',
          ships_lost: shipsLost,
          message: `Your expedition was ambushed by space pirates! You lost some ships in the skirmish.`,
        };
        break;
      }
      default: {
        result = {
          outcome_type: 'nothing',
          message: 'Your expedition explored the sector but found nothing of value.',
        };
      }
    }

    // Store expedition result
    await supabase.from('expedition_results').insert({
      fleet_id,
      user_id: user_id || fleet.user_id,
      outcome_type: result.outcome_type as string,
      outcome_data: result,
      resources_found: (result.resources_found as Record<string, number>) || null,
      ships_found: (result.ships_found as Record<string, number>) || null,
      ships_lost: (result.ships_lost as Record<string, number>) || null,
      dark_matter_found: (result.dark_matter_found as number) || 0,
    });

    return new Response(JSON.stringify({
      success: true,
      result,
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

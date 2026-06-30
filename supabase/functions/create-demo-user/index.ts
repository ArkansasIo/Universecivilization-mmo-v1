import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DEMO_EMAIL = 'demo@universe-civ.local';
const DEMO_PASSWORD = 'Demo123!';
const DEMO_USERNAME = 'DemoCommander';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ success: false, error: 'Server configuration error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data: existingUsers } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 10000 });
    const demoUser = existingUsers?.users?.find(
      (u: any) => u.email?.toLowerCase() === DEMO_EMAIL
    );

    let userId: string;

    if (demoUser) {
      userId = demoUser.id;
      await adminClient.auth.admin.updateUserById(userId, { 
        password: DEMO_PASSWORD, 
        email_confirm: true 
      });
    } else {
      const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { username: DEMO_USERNAME },
      });

      if (createError || !createData?.user) {
        return new Response(
          JSON.stringify({ success: false, error: createError?.message || 'Failed to create demo account.' }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      userId = createData.user.id;
    }

    await adminClient.from('profiles').upsert({
      id: userId,
      username: DEMO_USERNAME,
      email: DEMO_EMAIL,
      level: 5,
      experience: 2500,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(DEMO_USERNAME)}`,
      vacation_mode: false,
      is_admin: false,
      was_guest: false,
    }, { onConflict: 'id' });

    await adminClient.from('player_resources').upsert({
      user_id: userId,
      player_id: userId,
      metal: 2000,
      crystal: 1200,
      deuterium: 500,
      energy: 100,
      dark_matter: 50,
      imperial_credits: 50000,
      republic_credits: 25000,
      antimatter: 10,
      nanites: 25,
    }, { onConflict: 'user_id' });

    const { data: existingPlanet } = await adminClient
      .from('planets')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingPlanet) {
      const { data: planetData } = await adminClient
        .from('planets')
        .insert({
          user_id: userId,
          player_id: userId,
          name: 'Homeworld',
          planet_type: 'terran',
          status: 'active',
          coordinates: '1:1:1',
          position_galaxy: 1,
          position_system: 1,
          position_planet: 1,
          temperature: 20,
          diameter: 12800,
          fields_used: 0,
          fields_max: 163,
          population: 5000,
          development: 3,
          defense_level: 1,
          is_capital: true,
          is_homeworld: true,
          metal_storage: 20000,
          crystal_storage: 20000,
          deuterium_storage: 20000,
        })
        .select()
        .maybeSingle();

      const planetId = planetData?.id;

      if (planetId) {
        const { data: existingBuildings } = await adminClient
          .from('buildings')
          .select('id')
          .eq('planet_id', planetId)
          .limit(1);

        if (!existingBuildings || existingBuildings.length === 0) {
          await adminClient.from('buildings').insert([
            { user_id: userId, player_id: userId, planet_id: planetId, building_type: 'metal_mine', level: 3, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetId, building_type: 'crystal_mine', level: 3, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetId, building_type: 'deuterium_synthesizer', level: 2, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetId, building_type: 'solar_plant', level: 4, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetId, building_type: 'robotics_factory', level: 2, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetId, building_type: 'shipyard', level: 2, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetId, building_type: 'research_lab', level: 3, is_upgrading: false },
          ]);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, email: DEMO_EMAIL, message: 'Demo account ready!' }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    console.error('Demo account error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Unexpected server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
});

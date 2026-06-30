import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  let body: { email?: string; password?: string; username?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  }

  const { email, password, username } = body;
  if (!email || !password || !username) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: email, password, username' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }

  const emailLower = email.toLowerCase().trim();

  const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Check if email already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 10000,
    });

    const taken = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === emailLower
    );

    if (taken) {
      return new Response(
        JSON.stringify({ error: 'That email is already registered. Please sign in instead.' }),
        { status: 409, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // Create confirmed auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: emailLower,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

    if (authError || !authData.user) {
      console.error('Auth createUser error:', authError?.message);
      const rawMsg = (authError?.message || '').toLowerCase();
      let friendlyError = authError?.message || 'Failed to create account';
      let statusCode = 500;

      if (rawMsg.includes('unique') || rawMsg.includes('duplicate') || rawMsg.includes('already')) {
        friendlyError = 'That email is already registered. Please sign in instead.';
        statusCode = 409;
      } else if (rawMsg.includes('database error saving new user')) {
        friendlyError = 'That email is already registered. Please sign in instead.';
        statusCode = 409;
      } else if (rawMsg.includes('weak') || rawMsg.includes('password')) {
        friendlyError = 'Password is too weak. Please use at least 6 characters.';
        statusCode = 400;
      }

      return new Response(
        JSON.stringify({ error: friendlyError }),
        { status: statusCode, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    const userId = authData.user.id;

    // 1. Create profile
    await adminClient.from('profiles').upsert({
      id: userId,
      username,
      email: emailLower,
      level: 1,
      experience: 0,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
      vacation_mode: false,
    }, { onConflict: 'id' });

    // 2. Create player_resources (primary resource table)
    await adminClient.from('player_resources').upsert({
      user_id: userId,
      player_id: userId,
      metal: 500,
      crystal: 300,
      deuterium: 100,
      energy: 0,
      dark_matter: 0,
      antimatter: 0,
      nanites: 0,
      quantum_cores: 0,
      imperial_credits: 10000,
      republic_credits: 5000,
    }, { onConflict: 'user_id' });

    // 3. Also create resources table entry (secondary resource store)
    await adminClient.from('resources').upsert({
      player_id: userId,
      metal: 500,
      crystal: 300,
      deuterium: 100,
      energy: 0,
      dark_matter: 0,
      imperial_credits: 10000,
      republic_credits: 5000,
    }, { onConflict: 'player_id' });

    // 4. Create homeworld planet
    const { data: planetData } = await adminClient
      .from('planets')
      .insert({
        user_id: userId,
        player_id: userId,
        owner_id: userId,
        name: 'Homeworld',
        planet_type: 'terran',
        position_galaxy: 1,
        position_system: 1,
        position_planet: 6,
        size: 163,
        temperature_max: 45,
        temperature_min: -10,
        diameter: 12800,
        metal_bonus: 1.0,
        crystal_bonus: 1.0,
        deuterium_bonus: 1.0,
        build_slots: 163,
        used_slots: 10,
        is_homeworld: true,
        is_capital: true,
      })
      .select()
      .maybeSingle();

    if (planetData) {
      // 5. Create starter buildings on homeworld
      await adminClient.from('buildings').insert([
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'metal_mine',            category: 'Industrial', level: 1, max_level: 30, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'crystal_mine',          category: 'Industrial', level: 1, max_level: 30, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'solar_plant',           category: 'Energy',     level: 1, max_level: 30, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'deuterium_synthesizer', category: 'Industrial', level: 1, max_level: 30, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'research_lab',          category: 'Research',   level: 1, max_level: 30, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'shipyard',              category: 'Military',   level: 1, max_level: 30, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'robotic_factory',       category: 'Industrial', level: 1, max_level: 30, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'metal_storage',         category: 'Storage',    level: 1, max_level: 20, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'crystal_storage',       category: 'Storage',    level: 1, max_level: 20, is_building: false, is_active: true },
        { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'deuterium_tank',        category: 'Storage',    level: 1, max_level: 20, is_building: false, is_active: true },
      ]);

      // 6. Create population data for homeworld
      await adminClient.from('population_data').insert({
        planet_id: planetData.id,
        population: 1000,
        max_population: 10000,
        growth_rate: 1.02,
        happiness: 80,
        employment_rate: 1.0,
        education_level: 1,
      });

      // 7. Create starter ships
      await adminClient.from('ships').insert([
        { player_id: userId, planet_id: planetData.id, ship_type: 'Light Fighter',   ship_class: 'Fighter',  category: 'Light', role: 'Combat',     quantity: 3, level: 1, rarity: 'Common' },
        { player_id: userId, planet_id: planetData.id, ship_type: 'Small Cargo',     ship_class: 'Corvette', category: 'Light', role: 'Transport',  quantity: 2, level: 1, rarity: 'Common' },
        { player_id: userId, planet_id: planetData.id, ship_type: 'Espionage Probe', ship_class: 'Fighter',  category: 'Light', role: 'Stealth',    quantity: 5, level: 1, rarity: 'Common' },
      ]);
    }

    // 8. Seed starter research entries
    const starterTechs = [
      { technology_name: 'Energy Technology',    category: 'Energy',     level: 0 },
      { technology_name: 'Computer Technology',  category: 'Advanced',   level: 0 },
      { technology_name: 'Weapons Technology',   category: 'Combat',     level: 0 },
      { technology_name: 'Shielding Technology', category: 'Defense',    level: 0 },
      { technology_name: 'Armour Technology',    category: 'Defense',    level: 0 },
      { technology_name: 'Combustion Drive',     category: 'Propulsion', level: 0 },
      { technology_name: 'Espionage Technology', category: 'Espionage',  level: 0 },
    ];

    for (const tech of starterTechs) {
      await adminClient.from('research').upsert(
        { player_id: userId, ...tech },
        { onConflict: 'player_id,technology_name' }
      );
    }

    // 9. Create initial leaderboard entry
    await adminClient.from('leaderboard').insert({
      user_id: userId,
      username,
      level: 1,
      total_points: 0,
      fleet_points: 0,
      research_points: 0,
      building_points: 0,
      combat_wins: 0,
      total_planets: 1,
    });

    return new Response(
      JSON.stringify({ success: true, userId, email: emailLower, username }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  } catch (err: any) {
    console.error('Account creation error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Unexpected server error during account creation' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
    );
  }
});

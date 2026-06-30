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
    const { galaxy, system, planet } = await req.json();
    if (!galaxy || !system || !planet) {
      return new Response(JSON.stringify({ error: 'Missing coordinates' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('VITE_PUBLIC_SUPABASE_URL') ?? '',
      Deno.env.get('VITE_PUBLIC_SUPABASE_ANON_KEY') ?? ''
    );

    // Get debris field at coordinates
    const { data: debris } = await supabase
      .from('debris_fields')
      .select('*')
      .eq('galaxy', galaxy)
      .eq('system', system)
      .eq('planet', planet)
      .single();

    if (!debris) {
      return new Response(JSON.stringify({ error: 'No debris field at these coordinates' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const totalDebris = Number(debris.metal) + Number(debris.crystal);

    // Get server settings
    const { data: settings } = await supabase
      .from('server_settings')
      .select('key, value')
      .in('key', ['min_debris_for_moon', 'moon_creation_chance', 'max_moon_chance']);

    const settingsMap: Record<string, string> = {};
    settings?.forEach((s: { key: string; value: string | null }) => {
      if (s.value !== null) settingsMap[s.key] = s.value;
    });

    const minDebris = parseInt(settingsMap['min_debris_for_moon'] || '100000');
    const baseChance = parseFloat(settingsMap['moon_creation_chance'] || '1');
    const maxChance = parseFloat(settingsMap['max_moon_chance'] || '20');

    if (totalDebris < minDebris) {
      return new Response(JSON.stringify({
        error: 'Not enough debris for moon creation',
        total_debris: totalDebris,
        min_required: minDebris,
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate chance: 1% per 100k debris, capped at max
    const chancePercent = Math.min((totalDebris / 100000) * baseChance, maxChance);
    const roll = Math.random() * 100;
    const moonCreated = roll < chancePercent;

    if (!moonCreated) {
      // Reduce debris slightly on failed attempt (some material is lost)
      const lossFactor = 0.95;
      await supabase.from('debris_fields').update({
        metal: Math.floor(Number(debris.metal) * lossFactor),
        crystal: Math.floor(Number(debris.crystal) * lossFactor),
      }).eq('id', debris.id);

      return new Response(JSON.stringify({
        success: false,
        moon_created: false,
        chance: chancePercent,
        roll,
        message: 'Moon creation failed. Some debris was scattered.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the planet owner to associate moon
    const { data: existingPlanet } = await supabase
      .from('planets')
      .select('user_id, player_id')
      .eq('position_galaxy', galaxy)
      .eq('position_system', system)
      .eq('position_planet', planet)
      .eq('planet_type', 'planet')
      .single();

    // Check if moon already exists
    const { data: existingMoon } = await supabase
      .from('planets')
      .select('id')
      .eq('position_galaxy', galaxy)
      .eq('position_system', system)
      .eq('position_planet', planet)
      .eq('planet_type', 'moon')
      .single();

    if (existingMoon) {
      return new Response(JSON.stringify({ error: 'Moon already exists at these coordinates' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create moon
    const moonName = `Moon at ${galaxy}:${system}:${planet}`;
    const { data: moon, error: moonErr } = await supabase
      .from('planets')
      .insert({
        user_id: existingPlanet?.user_id || null,
        player_id: existingPlanet?.player_id || null,
        name: moonName,
        planet_type: 'moon',
        status: 'developing',
        coordinates: `${galaxy}:${system}:${planet}`,
        position_galaxy: galaxy,
        position_system: system,
        position_planet: planet,
        temperature: (existingPlanet ? -140 : -160) + Math.floor(Math.random() * 40),
        diameter: 8000 + Math.floor(Math.random() * 2000),
        fields_used: 0,
        fields_max: 1,
        population: 0,
        development: 0,
        defense_level: 0,
        is_capital: false,
        is_homeworld: false,
        image_url: 'https://readdy.ai/api/search-image?query=A detailed sci-fi digital illustration of a small barren grey moon surface with craters and rocky terrain floating in deep space with stars and nebula in background, dramatic lighting, game asset art style, high quality&width=400&height=400&seq=ogame-moon-1&orientation=squarish',
      })
      .select()
      .single();

    if (moonErr) {
      return new Response(JSON.stringify({ error: moonErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Clear debris field after moon creation (material used to form moon)
    await supabase.from('debris_fields').delete().eq('id', debris.id);

    return new Response(JSON.stringify({
      success: true,
      moon_created: true,
      moon,
      chance: chancePercent,
      roll,
      message: 'A new moon has formed from the debris field!',
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

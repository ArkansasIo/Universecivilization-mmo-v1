import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCTION_RATES: Record<string, number> = {
  metal_mine: 30,
  crystal_mine: 20,
  deuterium_synthesizer: 10,
  solar_plant: 20,
};

function calculateProduction(buildingType: string, level: number): number {
  const baseRate = PRODUCTION_RATES[buildingType] || 0;
  if (buildingType === "solar_plant") {
    return Math.floor(baseRate * level * Math.pow(1.05, level));
  }
  if (buildingType === "fusion_reactor") {
    return Math.floor(50 * level * Math.pow(1.05, level));
  }
  return Math.floor(baseRate * level * Math.pow(1.1, level));
}

function calculateStorageCapacity(_buildingType: string, level: number): number {
  return Math.floor(10000 * Math.pow(2, level));
}

function safeStringify(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    return obj.message as string || obj.error as string || JSON.stringify(err);
  }
  return 'Unknown error';
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error - missing env vars" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Empty authorization token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { data: { user: caller }, error: authError } = await authClient.auth.getUser(token);

    if (authError || !caller) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Fetch current resources
    const { data: currentResources, error: resError } = await adminClient
      .from("player_resources")
      .select("metal, crystal, deuterium, energy, dark_matter, imperial_credits, republic_credits, updated_at, created_at")
      .eq("player_id", caller.id)
      .maybeSingle();

    if (resError) {
      return new Response(
        JSON.stringify({ error: `Database error: ${safeStringify(resError)}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize if missing
    if (!currentResources) {
      const now = new Date().toISOString();
      await adminClient.from("player_resources").insert({
        player_id: caller.id,
        user_id: caller.id,
        metal: 500,
        crystal: 300,
        deuterium: 100,
        energy: 0,
        dark_matter: 0,
        imperial_credits: 10000,
        republic_credits: 5000,
        antimatter: 0,
        nanites: 0,
        updated_at: now,
        created_at: now,
      });
      return new Response(
        JSON.stringify({
          metal: 500,
          crystal: 300,
          deuterium: 100,
          energy: 0,
          dark_matter: 0,
          imperial_credits: 10000,
          republic_credits: 5000,
          antimatter: 0,
          nanites: 0,
          produced: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
          secondsElapsed: 0,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch planets
    const { data: planets, error: planetsError } = await adminClient
      .from("planets")
      .select("id")
      .eq("player_id", caller.id);

    if (planetsError) {
      return new Response(
        JSON.stringify({ error: `Planets query error: ${safeStringify(planetsError)}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!planets || planets.length === 0) {
      return new Response(
        JSON.stringify({
          metal: currentResources.metal || 0,
          crystal: currentResources.crystal || 0,
          deuterium: currentResources.deuterium || 0,
          energy: currentResources.energy || 0,
          dark_matter: currentResources.dark_matter || 0,
          imperial_credits: currentResources.imperial_credits || 0,
          republic_credits: currentResources.republic_credits || 0,
          produced: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
          secondsElapsed: 0,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch buildings
    const planetIds = planets.map((p: any) => p.id);
    const { data: buildings, error: bldError } = await adminClient
      .from("buildings")
      .select("building_type, level")
      .in("planet_id", planetIds);

    if (bldError) {
      return new Response(
        JSON.stringify({ error: `Buildings query error: ${safeStringify(bldError)}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sum building levels
    const buildingLevels: Record<string, number> = {};
    if (buildings) {
      for (const b of buildings) {
        buildingLevels[b.building_type] = (buildingLevels[b.building_type] || 0) + (b.level || 0);
      }
    }

    // Calculate time elapsed
    const lastUpdate = new Date(currentResources.updated_at || currentResources.created_at || Date.now());
    const now = new Date();
    const secondsElapsed = Math.max(0, Math.min(86400, (now.getTime() - lastUpdate.getTime()) / 1000));

    // Calculate production
    const metalProduction = calculateProduction("metal_mine", buildingLevels["metal_mine"] || 0);
    const crystalProduction = calculateProduction("crystal_mine", buildingLevels["crystal_mine"] || 0);
    const deuteriumProduction = calculateProduction("deuterium_synthesizer", buildingLevels["deuterium_synthesizer"] || 0);
    const solarEnergy = calculateProduction("solar_plant", buildingLevels["solar_plant"] || 0);
    const fusionEnergy = calculateProduction("fusion_reactor", buildingLevels["fusion_reactor"] || 0);

    const metalPerSecond = metalProduction / 3600;
    const crystalPerSecond = crystalProduction / 3600;
    const deuteriumPerSecond = deuteriumProduction / 3600;
    const totalEnergy = solarEnergy + fusionEnergy;

    const metalDelta = Math.floor(metalPerSecond * secondsElapsed);
    const crystalDelta = Math.floor(crystalPerSecond * secondsElapsed);
    const deuteriumDelta = Math.floor(deuteriumPerSecond * secondsElapsed);

    // Storage caps
    const metalStorageCap = calculateStorageCapacity("metal_storage", buildingLevels["metal_storage"] || 0);
    const crystalStorageCap = calculateStorageCapacity("crystal_storage", buildingLevels["crystal_storage"] || 0);
    const deuteriumStorageCap = calculateStorageCapacity("deuterium_tank", buildingLevels["deuterium_tank"] || 0);

    const metalNow = Number(currentResources.metal || 0);
    const crystalNow = Number(currentResources.crystal || 0);
    const deuteriumNow = Number(currentResources.deuterium || 0);
    const energyNow = Number(currentResources.energy || 0);

    const newMetal = Math.min(metalStorageCap, Math.floor(metalNow + metalDelta));
    const newCrystal = Math.min(crystalStorageCap, Math.floor(crystalNow + crystalDelta));
    const newDeuterium = Math.min(deuteriumStorageCap, Math.floor(deuteriumNow + deuteriumDelta));

    const hasChange =
      newMetal !== metalNow ||
      newCrystal !== crystalNow ||
      newDeuterium !== deuteriumNow ||
      totalEnergy !== energyNow ||
      secondsElapsed > 1;

    if (!hasChange) {
      return new Response(
        JSON.stringify({
          metal: metalNow,
          crystal: crystalNow,
          deuterium: deuteriumNow,
          energy: energyNow,
          dark_matter: Number(currentResources.dark_matter || 0),
          imperial_credits: Number(currentResources.imperial_credits || 0),
          republic_credits: Number(currentResources.republic_credits || 0),
          produced: { metal: 0, crystal: 0, deuterium: 0, energy: 0 },
          secondsElapsed: Math.floor(secondsElapsed),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update resources
    const { data: updated, error: updateError } = await adminClient
      .from("player_resources")
      .update({
        metal: newMetal,
        crystal: newCrystal,
        deuterium: newDeuterium,
        energy: totalEnergy,
        updated_at: now.toISOString(),
      })
      .eq("player_id", caller.id)
      .select("metal, crystal, deuterium, energy, dark_matter, imperial_credits, republic_credits, antimatter, nanites")
      .single();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Update error: ${safeStringify(updateError)}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        metal: Number(updated.metal || 0),
        crystal: Number(updated.crystal || 0),
        deuterium: Number(updated.deuterium || 0),
        energy: Number(updated.energy || 0),
        dark_matter: Number(updated.dark_matter || 0),
        imperial_credits: Number(updated.imperial_credits || 0),
        republic_credits: Number(updated.republic_credits || 0),
        antimatter: Number(updated.antimatter || 0),
        nanites: Number(updated.nanites || 0),
        produced: {
          metal: metalDelta,
          crystal: crystalDelta,
          deuterium: deuteriumDelta,
          energy: totalEnergy - energyNow,
        },
        secondsElapsed: Math.floor(secondsElapsed),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Resource tick unexpected error:", err);
    return new Response(
      JSON.stringify({ error: safeStringify(err) || "Failed to process resource tick" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Ship combat stats (must match src/utils/gameCalculations.ts exactly)
const SHIP_STATS: Record<string, { attack: number; shield: number; armor: number }> = {
  light_fighter: { attack: 50, shield: 10, armor: 400 },
  heavy_fighter: { attack: 150, shield: 25, armor: 1000 },
  cruiser: { attack: 400, shield: 50, armor: 2700 },
  battleship: { attack: 1000, shield: 200, armor: 6000 },
  battlecruiser: { attack: 700, shield: 400, armor: 7000 },
  bomber: { attack: 1000, shield: 500, armor: 7500 },
  destroyer: { attack: 2000, shield: 500, armor: 11000 },
  deathstar: { attack: 200000, shield: 50000, armor: 900000 },
  small_cargo: { attack: 5, shield: 5, armor: 200 },
  large_cargo: { attack: 5, shield: 10, armor: 400 },
  colony_ship: { attack: 50, shield: 100, armor: 3000 },
  recycler: { attack: 5, shield: 10, armor: 500 },
  espionage_probe: { attack: 0, shield: 0, armor: 100 },
  solar_satellite: { attack: 0, shield: 5, armor: 200 },
};

interface FleetShips {
  [shipType: string]: number;
}

interface CombatTech {
  weapons: number;
  shielding: number;
  armour: number;
}

function calculateFleetPower(ships: FleetShips, tech: CombatTech) {
  let totalAttack = 0;
  let totalShield = 0;
  let totalArmor = 0;

  for (const [shipType, count] of Object.entries(ships)) {
    const stats = SHIP_STATS[shipType];
    if (stats && count > 0) {
      totalAttack += stats.attack * count * (1 + tech.weapons * 0.1);
      totalShield += stats.shield * count * (1 + tech.shielding * 0.1);
      totalArmor += stats.armor * count * (1 + tech.armour * 0.1);
    }
  }

  return {
    attack: Math.floor(totalAttack),
    shield: Math.floor(totalShield),
    armor: Math.floor(totalArmor),
    totalPower: Math.floor(totalAttack + totalShield + totalArmor),
  };
}

function simulateCombatRounds(
  attackerShips: FleetShips,
  defenderShips: FleetShips,
  attackerTech: CombatTech,
  defenderTech: CombatTech
): {
  winner: "attacker" | "defender" | "draw";
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  rounds: number;
  attackerPower: number;
  defenderPower: number;
  finalAttackerShips: FleetShips;
  finalDefenderShips: FleetShips;
} {
  const attackerPower = calculateFleetPower(attackerShips, attackerTech);
  const defenderPower = calculateFleetPower(defenderShips, defenderTech);

  // Create working copies
  const workingAttacker: FleetShips = { ...attackerShips };
  const workingDefender: FleetShips = { ...defenderShips };

  const attackerLosses: Record<string, number> = {};
  const defenderLosses: Record<string, number> = {};

  // Run up to 6 rounds
  for (let round = 0; round < 6; round++) {
    const currentAttacker = calculateFleetPower(workingAttacker, attackerTech);
    const currentDefender = calculateFleetPower(workingDefender, defenderTech);

    if (currentAttacker.totalPower <= 0 || currentDefender.totalPower <= 0) break;

    // Calculate damage with random factor (0.8 - 1.2)
    const attackerRand = 0.8 + Math.random() * 0.4;
    const defenderRand = 0.8 + Math.random() * 0.4;

    const attackerDamage = currentAttacker.attack * attackerRand;
    const defenderDamage = currentDefender.attack * defenderRand;

    // Distribute damage proportionally to defender ships
    const defenderTotalShips = Object.values(workingDefender).reduce((s, c) => s + c, 0);
    if (defenderTotalShips > 0 && defenderDamage > 0) {
      for (const [shipType, count] of Object.entries(workingDefender)) {
        if (count <= 0) continue;
        const shipStat = SHIP_STATS[shipType];
        if (!shipStat) continue;

        const proportion = count / defenderTotalShips;
        const damageToThisType = defenderDamage * proportion;
        const shipEffectiveHealth = shipStat.shield * (1 + defenderTech.shielding * 0.1) + shipStat.armor * (1 + defenderTech.armour * 0.1);
        const shipsDestroyed = Math.min(count, Math.floor(damageToThisType / shipEffectiveHealth));

        workingDefender[shipType] = count - shipsDestroyed;
        defenderLosses[shipType] = (defenderLosses[shipType] || 0) + shipsDestroyed;

        if (workingDefender[shipType] <= 0) {
          workingDefender[shipType] = 0;
        }
      }
    }

    // Distribute damage proportionally to attacker ships
    const attackerTotalShips = Object.values(workingAttacker).reduce((s, c) => s + c, 0);
    if (attackerTotalShips > 0 && attackerDamage > 0) {
      for (const [shipType, count] of Object.entries(workingAttacker)) {
        if (count <= 0) continue;
        const shipStat = SHIP_STATS[shipType];
        if (!shipStat) continue;

        const proportion = count / attackerTotalShips;
        const damageToThisType = attackerDamage * proportion;
        const shipEffectiveHealth = shipStat.shield * (1 + attackerTech.shielding * 0.1) + shipStat.armor * (1 + attackerTech.armour * 0.1);
        const shipsDestroyed = Math.min(count, Math.floor(damageToThisType / shipEffectiveHealth));

        workingAttacker[shipType] = count - shipsDestroyed;
        attackerLosses[shipType] = (attackerLosses[shipType] || 0) + shipsDestroyed;

        if (workingAttacker[shipType] <= 0) {
          workingAttacker[shipType] = 0;
        }
      }
    }
  }

  const finalAttackerPower = calculateFleetPower(workingAttacker, attackerTech).totalPower;
  const finalDefenderPower = calculateFleetPower(workingDefender, defenderTech).totalPower;

  let winner: "attacker" | "defender" | "draw";
  if (finalAttackerPower > 0 && finalDefenderPower <= 0) winner = "attacker";
  else if (finalDefenderPower > 0 && finalAttackerPower <= 0) winner = "defender";
  else if (finalAttackerPower > finalDefenderPower) winner = "attacker";
  else if (finalDefenderPower > finalAttackerPower) winner = "defender";
  else winner = "draw";

  return {
    winner,
    attackerLosses,
    defenderLosses,
    rounds: 6,
    attackerPower: attackerPower.totalPower,
    defenderPower: defenderPower.totalPower,
    finalAttackerShips: workingAttacker,
    finalDefenderShips: workingDefender,
  };
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

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Authenticate caller
  const authHeader = req.headers.get("authorization");
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { data: { user: caller }, error: authError } = await authClient.auth.getUser(
    authHeader?.replace("Bearer ", "") || ""
  );

  if (authError || !caller) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { attacker_fleet_id, defender_fleet_id, attacker_tech, defender_tech, mission_type = "attack" } = body;

  if (!attacker_fleet_id) {
    return new Response(
      JSON.stringify({ error: "Missing attacker_fleet_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // 1. Fetch attacker fleet and verify ownership
    const { data: attackerFleet, error: attError } = await adminClient
      .from("fleets")
      .select("id, name, user_id, ships, total_ships, origin_planet_id, mission, status")
      .eq("id", attacker_fleet_id)
      .single();

    if (attError || !attackerFleet) {
      return new Response(
        JSON.stringify({ error: "Attacker fleet not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (attackerFleet.user_id !== caller.id) {
      return new Response(
        JSON.stringify({ error: "You do not own this fleet" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch defender fleet
    let defenderFleet: any = null;
    if (defender_fleet_id) {
      const { data: defData, error: defError } = await adminClient
        .from("fleets")
        .select("id, name, user_id, ships, total_ships, origin_planet_id, mission, status")
        .eq("id", defender_fleet_id)
        .single();

      if (!defError && defData) {
        defenderFleet = defData;
      }
    }

    // 3. Resolve technology levels (default to 0 if not provided)
    const attTech: CombatTech = {
      weapons: attacker_tech?.weapons || 0,
      shielding: attacker_tech?.shielding || 0,
      armour: attacker_tech?.armour || 0,
    };
    const defTech: CombatTech = {
      weapons: defender_tech?.weapons || 0,
      shielding: defender_tech?.shielding || 0,
      armour: defender_tech?.armour || 0,
    };

    // 4. If no defender fleet, create a minimal defense (planet defense or empty)
    const attackerShips: FleetShips = attackerFleet.ships || {};
    const defenderShips: FleetShips = defenderFleet?.ships || {};

    if (Object.keys(defenderShips).length === 0) {
      // No defending ships — attacker wins automatically
      const combatLog = {
        attacker_id: caller.id,
        defender_id: defenderFleet?.user_id || null,
        attacker_name: caller.user_metadata?.username || caller.email?.split("@")[0] || "Unknown",
        defender_name: defenderFleet ? "Defender" : "Unoccupied",
        result: "attacker_victory",
        attacker_losses: {},
        defender_losses: {},
        resources_plundered: {},
        combat_rounds: 0,
        coordinates: attackerFleet.origin_planet_id?.toString() || "",
        report_detail: {
          attackerShips,
          defenderShips,
          attackerTech: attTech,
          defenderTech: defTech,
          summary: "No defending forces encountered. Victory by default.",
          winner: "attacker",
        },
        is_read_attacker: true,
        is_read_defender: false,
        created_at: new Date().toISOString(),
      };

      await adminClient.from("combat_logs").insert(combatLog);

      // Mark attacker fleet as returning
      await adminClient
        .from("fleets")
        .update({
          status: "returning",
          mission: "returning",
          return_time: new Date(Date.now() + 3600000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", attacker_fleet_id);

      return new Response(
        JSON.stringify({
          combatId: null,
          winner: "attacker",
          attackerLosses: {},
          defenderLosses: {},
          rounds: 0,
          attackerPower: calculateFleetPower(attackerShips, attTech).totalPower,
          defenderPower: 0,
          summary: "No defending forces encountered. Victory by default.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Simulate combat
    const combatResult = simulateCombatRounds(attackerShips, defenderShips, attTech, defTech);

    // 6. Calculate loot if attacker wins
    let loot: Record<string, number> = {};
    if (combatResult.winner === "attacker") {
      // Defender loses resources proportional to damage
      loot = {
        metal: Math.floor(Math.random() * 5000 + 1000),
        crystal: Math.floor(Math.random() * 3000 + 500),
        deuterium: Math.floor(Math.random() * 1000 + 200),
      };
    }

    // 7. Update attacker fleet ships
    const updatedAttackerShips = combatResult.finalAttackerShips;
    const newAttackerTotal = Object.values(updatedAttackerShips).reduce((s, c) => s + c, 0);

    await adminClient
      .from("fleets")
      .update({
        ships: updatedAttackerShips,
        total_ships: newAttackerTotal,
        status: combatResult.winner === "attacker" ? "returning" : "destroyed",
        mission: combatResult.winner === "attacker" ? "returning" : "destroyed",
        return_time: combatResult.winner === "attacker" ? new Date(Date.now() + 3600000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", attacker_fleet_id);

    // 8. Update defender fleet ships if it exists
    if (defenderFleet) {
      const updatedDefenderShips = combatResult.finalDefenderShips;
      const newDefenderTotal = Object.values(updatedDefenderShips).reduce((s, c) => s + c, 0);

      if (newDefenderTotal <= 0) {
        // Fleet completely destroyed
        await adminClient
          .from("fleets")
          .update({
            ships: {},
            total_ships: 0,
            status: "destroyed",
            mission: "destroyed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", defender_fleet_id);
      } else {
        await adminClient
          .from("fleets")
          .update({
            ships: updatedDefenderShips,
            total_ships: newDefenderTotal,
            status: "stationed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", defender_fleet_id);
      }
    }

    // 9. Award loot to attacker if victorious
    if (combatResult.winner === "attacker" && Object.keys(loot).length > 0) {
      const { data: attResources } = await adminClient
        .from("player_resources")
        .select("metal, crystal, deuterium")
        .eq("player_id", caller.id)
        .maybeSingle();

      if (attResources) {
        await adminClient
          .from("player_resources")
          .update({
            metal: (attResources.metal || 0) + (loot.metal || 0),
            crystal: (attResources.crystal || 0) + (loot.crystal || 0),
            deuterium: (attResources.deuterium || 0) + (loot.deuterium || 0),
            updated_at: new Date().toISOString(),
          })
          .eq("player_id", caller.id);
      }
    }

    // 10. Create combat log
    const combatLog = {
      attacker_id: caller.id,
      defender_id: defenderFleet?.user_id || null,
      attacker_name: caller.user_metadata?.username || caller.email?.split("@")[0] || "Unknown",
      defender_name: defenderFleet
        ? "Defender Fleet"
        : "Unoccupied",
      result: combatResult.winner === "attacker" ? "attacker_victory" : combatResult.winner === "defender" ? "defender_victory" : "draw",
      attacker_losses: combatResult.attackerLosses,
      defender_losses: combatResult.defenderLosses,
      resources_plundered: loot,
      combat_rounds: combatResult.rounds,
      coordinates: attackerFleet.origin_planet_id?.toString() || "",
      report_detail: {
        attackerShips,
        defenderShips,
        attackerTech: attTech,
        defenderTech: defTech,
        attackerPower: combatResult.attackerPower,
        defenderPower: combatResult.defenderPower,
        finalAttackerShips: combatResult.finalAttackerShips,
        finalDefenderShips: combatResult.finalDefenderShips,
        summary: `Combat lasted ${combatResult.rounds} rounds. ${combatResult.winner === "attacker" ? "Attacker victorious!" : combatResult.winner === "defender" ? "Defender held the line!" : "Combat ended in a stalemate."}`,
        winner: combatResult.winner,
      },
      is_read_attacker: false,
      is_read_defender: false,
      created_at: new Date().toISOString(),
    };

    const { data: logData, error: logError } = await adminClient
      .from("combat_logs")
      .insert(combatLog)
      .select("id")
      .single();

    if (logError) {
      console.error("Failed to create combat log:", logError);
    }

    // 11. Create notifications
    const notifications = [];
    notifications.push({
      user_id: caller.id,
      type: "combat",
      title: combatResult.winner === "attacker" ? "Victory!" : "Defeat...",
      message: combatResult.winner === "attacker"
        ? `Your fleet defeated the enemy! Loot: ${loot.metal || 0} metal, ${loot.crystal || 0} crystal, ${loot.deuterium || 0} deuterium.`
        : `Your fleet was defeated in combat.`,
      icon: combatResult.winner === "attacker" ? "ri-sword-line" : "ri-heart-broken-line",
      data: { combat_log_id: logData?.id },
      created_at: new Date().toISOString(),
    });

    if (defenderFleet?.user_id && defenderFleet.user_id !== caller.id) {
      notifications.push({
        user_id: defenderFleet.user_id,
        type: "combat",
        title: combatResult.winner === "defender" ? "Defense Successful!" : "Under Attack!",
        message: combatResult.winner === "defender"
          ? "Your fleet successfully repelled an attack!"
          : "Your fleet was attacked and defeated!",
        icon: combatResult.winner === "defender" ? "ri-shield-line" : "ri-heart-broken-line",
        data: { combat_log_id: logData?.id },
        created_at: new Date().toISOString(),
      });
    }

    await adminClient.from("notifications").insert(notifications);

    return new Response(
      JSON.stringify({
        combatId: logData?.id || null,
        winner: combatResult.winner,
        attackerLosses: combatResult.attackerLosses,
        defenderLosses: combatResult.defenderLosses,
        rounds: combatResult.rounds,
        attackerPower: combatResult.attackerPower,
        defenderPower: combatResult.defenderPower,
        loot,
        summary: combatLog.report_detail.summary,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Combat resolution error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to resolve combat" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
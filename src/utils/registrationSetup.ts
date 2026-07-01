import { supabase } from '../lib/supabase';
import { RACES, type RaceDefinition } from '../data/playerRaces';

export interface WizardData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  empireName: string;
  commanderName: string;
  homeworld: string;
  race: string;
  startingBonus: 'resources' | 'military' | 'research' | 'economy';
}

export async function completeRegistration(userId: string, data: WizardData) {
  const selectedRace = RACES.find((r) => r.id === data.race) as RaceDefinition | undefined;
  if (!selectedRace) throw new Error('Invalid race selection');

  /* 1) Update profile with race info */
  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      username: data.username,
      email: data.email,
      race: data.race,
    },
    { onConflict: 'id' }
  );
  if (profileError) console.error('Profile update error:', profileError);

  /* 2) Calculate starting resources */
  let metal = 500 + selectedRace.metalBonus;
  let crystal = 300 + selectedRace.crystalBonus;
  let deuterium = 100 + selectedRace.deuteriumBonus;

  if (data.startingBonus === 'resources') {
    metal += 1000;
    crystal += 750;
    deuterium += 500;
  }

  metal = Math.max(0, metal);
  crystal = Math.max(0, crystal);
  deuterium = Math.max(0, deuterium);

  /* 3) Create resources */
  const { error: resError } = await supabase.from('player_resources').upsert(
    {
      user_id: userId,
      player_id: userId,
      metal,
      crystal,
      deuterium,
    },
    { onConflict: 'user_id' }
  );
  if (resError) console.error('Resources update error:', resError);

  /* 4) Handle planet */
  const { data: existingPlanet } = await supabase
    .from('planets')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  let planetId: string | null = existingPlanet?.id ?? null;

  if (existingPlanet) {
    const { error: planetUpdateError } = await supabase
      .from('planets')
      .update({ name: data.homeworld })
      .eq('id', existingPlanet.id);
    if (planetUpdateError) console.error('Planet update error:', planetUpdateError);
  } else {
    const planetTypeMap: Record<string, string> = {
      terran: 'terran',
      zenthari: 'crystalline',
      draken: 'volcanic',
      korvax: 'terran',
      golrath: 'terran',
      nexar: 'artificial',
      aquarian: 'ocean',
      velhari: 'void',
      skarran: 'jungle',
    };

    const { data: newPlanet, error: planetError } = await supabase
      .from('planets')
      .insert({
        user_id: userId,
        player_id: userId,
        name: data.homeworld,
        planet_type: planetTypeMap[data.race] || 'terran',
        status: 'active',
        coordinates: '1:1:1',
        position_galaxy: 1,
        position_system: 1,
        position_planet: 1,
        temperature: 20,
        diameter: 12800,
        fields_used: 0,
        fields_max: 163,
        population: 0,
        development: 1,
        defense_level: 0,
        is_capital: true,
        is_homeworld: true,
        metal_storage: 10000,
        crystal_storage: 10000,
        deuterium_storage: 10000,
      })
      .select()
      .maybeSingle();

    if (planetError) {
      console.error('Planet creation error:', planetError);
    } else if (newPlanet) {
      planetId = newPlanet.id;
    }
  }

  /* 5) Create buildings ONLY if none exist yet */
  if (planetId) {
    const { data: existingBuildings } = await supabase
      .from('buildings')
      .select('id')
      .eq('planet_id', planetId)
      .limit(1);

    if (!existingBuildings || existingBuildings.length === 0) {
      const baseBuildings = [
        { building_type: 'metal_mine', level: 1 },
        { building_type: 'crystal_mine', level: 1 },
        { building_type: 'solar_plant', level: 1 },
      ];

      if (data.startingBonus === 'economy') {
        baseBuildings[0].level = 3;
        baseBuildings[1].level = 2;
        baseBuildings[2].level = 3;
      }

      if (data.race === 'nexar') {
        baseBuildings[2].level = Math.max(baseBuildings[2].level, 2);
      }
      if (data.race === 'skarran') {
        baseBuildings[0].level = Math.max(baseBuildings[0].level, 2);
      }

      const { error: bldError } = await supabase.from('buildings').insert(
        baseBuildings.map((b) => ({
          user_id: userId,
          player_id: userId,
          planet_id: planetId,
          building_type: b.building_type,
          level: b.level,
          is_upgrading: false,
        }))
      );
      if (bldError) console.error('Buildings error:', bldError);
    }
  }

  /* 6) Race-specific research: Korvax */
  if (data.race === 'korvax') {
    const { error: reschError } = await supabase.from('research').insert([
      { user_id: userId, player_id: userId, technology_id: 'energy', technology_name: 'Energy Technology', level: 2 },
      { user_id: userId, player_id: userId, technology_id: 'computer', technology_name: 'Computer Technology', level: 1 },
    ]);
    if (reschError) console.error('Korvax research error:', reschError);
  }

  /* 7) Research bonus */
  if (data.startingBonus === 'research') {
    const techs = [
      { user_id: userId, player_id: userId, technology_id: 'energy', technology_name: 'Energy Technology', level: 2 },
      { user_id: userId, player_id: userId, technology_id: 'computer', technology_name: 'Computer Technology', level: 2 },
      { user_id: userId, player_id: userId, technology_id: 'weapons', technology_name: 'Weapons Technology', level: 1 },
    ];

    for (const tech of techs) {
      const { error: rErr } = await supabase.from('research').upsert(tech, {
        onConflict: 'user_id,technology_id',
      });
      if (rErr) console.error('Research upsert error:', rErr);
    }
  }

  /* 8) Military bonus */
  if (data.startingBonus === 'military' && planetId) {
    const ships = [
      { type: 'light_fighter', quantity: 5 },
      { type: 'heavy_fighter', quantity: 2 },
      { type: 'cruiser', quantity: 1 },
    ];
    const totalShips = ships.reduce((sum, s) => sum + s.quantity, 0);

    const { data: fleetData, error: fleetError } = await supabase
      .from('fleets')
      .insert({
        user_id: userId,
        player_id: userId,
        name: 'Defense Fleet',
        mission: 'defense',
        status: 'stationed',
        origin_planet_id: planetId,
        ships: JSON.stringify(ships),
        cargo_metal: 0,
        cargo_crystal: 0,
        cargo_deuterium: 0,
        total_ships: totalShips,
      })
      .select()
      .maybeSingle();

    if (fleetError) console.error('Fleet error:', fleetError);

    if (fleetData) {
      await supabase.from('ships').insert([
        { user_id: userId, planet_id: planetId, ship_type: 'light_fighter', ship_name: 'Light Fighter', quantity: 5, level: 1, health: 100, attack_power: 50, defense_power: 10, speed: 100, cargo_capacity: 50, status: 'active' },
        { user_id: userId, planet_id: planetId, ship_type: 'heavy_fighter', ship_name: 'Heavy Fighter', quantity: 2, level: 1, health: 200, attack_power: 100, defense_power: 30, speed: 80, cargo_capacity: 75, status: 'active' },
        { user_id: userId, planet_id: planetId, ship_type: 'cruiser', ship_name: 'Cruiser', quantity: 1, level: 1, health: 500, attack_power: 200, defense_power: 80, speed: 60, cargo_capacity: 200, status: 'active' },
      ]);
    }
  }

  /* 9) Race-specific: Draken bonus fighters */
  if (data.race === 'draken' && planetId) {
    await supabase.from('ships').insert({
      user_id: userId,
      planet_id: planetId,
      ship_type: 'light_fighter',
      ship_name: 'Clan Fighter',
      quantity: 2,
      level: 1,
      health: 100,
      attack_power: 60,
      defense_power: 15,
      speed: 110,
      cargo_capacity: 40,
      status: 'active',
    });
  }

  /* 10) Race-specific: Velhari scout */
  if (data.race === 'velhari' && planetId) {
    await supabase.from('ships').insert({
      user_id: userId,
      planet_id: planetId,
      ship_type: 'scout',
      ship_name: 'Pathfinder Scout',
      quantity: 1,
      level: 1,
      health: 50,
      attack_power: 10,
      defense_power: 5,
      speed: 200,
      cargo_capacity: 30,
      status: 'active',
    });
  }

  /* 11) Race-specific: Golrath extra credits */
  if (data.race === 'golrath') {
    const { data: resources } = await supabase
      .from('player_resources')
      .select('imperial_credits')
      .eq('user_id', userId)
      .maybeSingle();

    if (resources) {
      await supabase
        .from('player_resources')
        .update({ imperial_credits: (resources.imperial_credits || 0) + 10000 })
        .eq('user_id', userId);
    }
  }
}

export function storePendingRegistration(data: WizardData) {
  const payload = {
    ...data,
    timestamp: Date.now(),
  };
  localStorage.setItem('pendingRegistration', JSON.stringify(payload));
}

export function getPendingRegistration(): (WizardData & { timestamp: number }) | null {
  const raw = localStorage.getItem('pendingRegistration');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // Expire after 24 hours
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('pendingRegistration');
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem('pendingRegistration');
    return null;
  }
}

export function clearPendingRegistration() {
  localStorage.removeItem('pendingRegistration');
}

interface BuildingCost {
  metal: number;
  crystal: number;
  deuterium: number;
}

interface BuildingCosts {
  [key: string]: BuildingCost;
}

const BASE_COSTS: BuildingCosts = {
  metal_mine: { metal: 60, crystal: 15, deuterium: 0 },
  crystal_mine: { metal: 48, crystal: 24, deuterium: 0 },
  deuterium_synthesizer: { metal: 225, crystal: 75, deuterium: 0 },
  solar_plant: { metal: 75, crystal: 30, deuterium: 0 },
  fusion_reactor: { metal: 900, crystal: 360, deuterium: 180 },
  robotics_factory: { metal: 400, crystal: 120, deuterium: 200 },
  shipyard: { metal: 400, crystal: 200, deuterium: 100 },
  metal_storage: { metal: 1000, crystal: 0, deuterium: 0 },
  crystal_storage: { metal: 1000, crystal: 500, deuterium: 0 },
  deuterium_tank: { metal: 1000, crystal: 1000, deuterium: 0 },
  research_lab: { metal: 200, crystal: 400, deuterium: 200 },
  alliance_depot: { metal: 20000, crystal: 40000, deuterium: 0 },
  missile_silo: { metal: 20000, crystal: 20000, deuterium: 1000 },
  nanite_factory: { metal: 1000000, crystal: 500000, deuterium: 100000 },
  terraformer: { metal: 0, crystal: 50000, deuterium: 100000 },
  space_dock: { metal: 200, crystal: 0, deuterium: 50 }
};

export function calculateBuildingCost(buildingType: string, level: number): BuildingCost {
  const baseCost = BASE_COSTS[buildingType] || { metal: 0, crystal: 0, deuterium: 0 };
  const multiplier = Math.pow(2, level - 1);

  return {
    metal: Math.floor(baseCost.metal * multiplier),
    crystal: Math.floor(baseCost.crystal * multiplier),
    deuterium: Math.floor(baseCost.deuterium * multiplier)
  };
}

export function calculateBuildTime(buildingType: string, level: number, roboticsLevel: number = 0, naniteLevel: number = 0): number {
  const cost = calculateBuildingCost(buildingType, level);
  const totalCost = cost.metal + cost.crystal;
  
  let baseTime = (totalCost / 2500) * 3600; // Base time in seconds
  
  // Robotics factory reduces build time
  if (roboticsLevel > 0) {
    baseTime = baseTime / (1 + roboticsLevel);
  }
  
  // Nanite factory drastically reduces build time
  if (naniteLevel > 0) {
    baseTime = baseTime / Math.pow(2, naniteLevel);
  }
  
  return Math.max(1, Math.floor(baseTime));
}

export function calculateResearchCost(techType: string, level: number): BuildingCost {
  const baseCosts: BuildingCosts = {
    energy_technology: { metal: 0, crystal: 800, deuterium: 400 },
    laser_technology: { metal: 200, crystal: 100, deuterium: 0 },
    ion_technology: { metal: 1000, crystal: 300, deuterium: 100 },
    hyperspace_technology: { metal: 0, crystal: 4000, deuterium: 2000 },
    plasma_technology: { metal: 2000, crystal: 4000, deuterium: 1000 },
    combustion_drive: { metal: 400, crystal: 0, deuterium: 600 },
    impulse_drive: { metal: 2000, crystal: 4000, deuterium: 600 },
    hyperspace_drive: { metal: 10000, crystal: 20000, deuterium: 6000 },
    espionage_technology: { metal: 200, crystal: 1000, deuterium: 200 },
    computer_technology: { metal: 0, crystal: 400, deuterium: 600 },
    astrophysics: { metal: 4000, crystal: 8000, deuterium: 4000 },
    intergalactic_research_network: { metal: 240000, crystal: 400000, deuterium: 160000 },
    graviton_technology: { metal: 0, crystal: 0, deuterium: 0 },
    weapons_technology: { metal: 800, crystal: 200, deuterium: 0 },
    shielding_technology: { metal: 200, crystal: 600, deuterium: 0 },
    armour_technology: { metal: 1000, crystal: 0, deuterium: 0 }
  };

  const baseCost = baseCosts[techType] || { metal: 0, crystal: 0, deuterium: 0 };
  const multiplier = Math.pow(2, level - 1);

  return {
    metal: Math.floor(baseCost.metal * multiplier),
    crystal: Math.floor(baseCost.crystal * multiplier),
    deuterium: Math.floor(baseCost.deuterium * multiplier)
  };
}

export function calculateResearchTime(techType: string, level: number, labLevel: number = 1): number {
  const cost = calculateResearchCost(techType, level);
  const totalCost = cost.metal + cost.crystal;
  
  let baseTime = (totalCost / 1000) * 3600; // Base time in seconds
  
  // Research lab reduces research time
  if (labLevel > 0) {
    baseTime = baseTime / labLevel;
  }
  
  return Math.max(1, Math.floor(baseTime));
}

export function calculateShipCost(shipType: string): BuildingCost {
  const shipCosts: BuildingCosts = {
    light_fighter: { metal: 3000, crystal: 1000, deuterium: 0 },
    heavy_fighter: { metal: 6000, crystal: 4000, deuterium: 0 },
    cruiser: { metal: 20000, crystal: 7000, deuterium: 2000 },
    battleship: { metal: 45000, crystal: 15000, deuterium: 0 },
    battlecruiser: { metal: 30000, crystal: 40000, deuterium: 15000 },
    bomber: { metal: 50000, crystal: 25000, deuterium: 15000 },
    destroyer: { metal: 60000, crystal: 50000, deuterium: 15000 },
    deathstar: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
    small_cargo: { metal: 2000, crystal: 2000, deuterium: 0 },
    large_cargo: { metal: 6000, crystal: 6000, deuterium: 0 },
    colony_ship: { metal: 10000, crystal: 20000, deuterium: 10000 },
    recycler: { metal: 10000, crystal: 6000, deuterium: 2000 },
    espionage_probe: { metal: 0, crystal: 1000, deuterium: 0 },
    solar_satellite: { metal: 0, crystal: 2000, deuterium: 500 }
  };

  return shipCosts[shipType] || { metal: 0, crystal: 0, deuterium: 0 };
}

export function calculateCombatPower(ships: { [key: string]: number }, weaponsTech: number = 0, shieldingTech: number = 0, armourTech: number = 0) {
  const shipStats: { [key: string]: { attack: number; shield: number; armor: number } } = {
    light_fighter: { attack: 50, shield: 10, armor: 400 },
    heavy_fighter: { attack: 150, shield: 25, armor: 1000 },
    cruiser: { attack: 400, shield: 50, armor: 2700 },
    battleship: { attack: 1000, shield: 200, armor: 6000 },
    battlecruiser: { attack: 700, shield: 400, armor: 7000 },
    bomber: { attack: 1000, shield: 500, armor: 7500 },
    destroyer: { attack: 2000, shield: 500, armor: 11000 },
    deathstar: { attack: 200000, shield: 50000, armor: 900000 }
  };

  let totalAttack = 0;
  let totalShield = 0;
  let totalArmor = 0;

  Object.entries(ships).forEach(([shipType, count]) => {
    const stats = shipStats[shipType];
    if (stats) {
      totalAttack += stats.attack * count * (1 + weaponsTech * 0.1);
      totalShield += stats.shield * count * (1 + shieldingTech * 0.1);
      totalArmor += stats.armor * count * (1 + armourTech * 0.1);
    }
  });

  return {
    attack: Math.floor(totalAttack),
    shield: Math.floor(totalShield),
    armor: Math.floor(totalArmor),
    totalPower: Math.floor(totalAttack + totalShield + totalArmor)
  };
}

export function simulateCombat(
  attackerShips: { [key: string]: number },
  defenderShips: { [key: string]: number },
  attackerTech: { weapons: number; shielding: number; armour: number },
  defenderTech: { weapons: number; shielding: number; armour: number }
) {
  const attackerPower = calculateCombatPower(attackerShips, attackerTech.weapons, attackerTech.shielding, attackerTech.armour);
  const defenderPower = calculateCombatPower(defenderShips, defenderTech.weapons, defenderTech.shielding, defenderTech.armour);

  const attackerWinChance = attackerPower.totalPower / (attackerPower.totalPower + defenderPower.totalPower);
  const defenderWinChance = 1 - attackerWinChance;

  // Simulate 6 rounds of combat
  let attackerLosses = 0;
  let defenderLosses = 0;

  for (let round = 0; round < 6; round++) {
    const attackerDamage = attackerPower.attack * (0.8 + Math.random() * 0.4);
    const defenderDamage = defenderPower.attack * (0.8 + Math.random() * 0.4);

    defenderLosses += (attackerDamage / defenderPower.totalPower) * 100;
    attackerLosses += (defenderDamage / attackerPower.totalPower) * 100;
  }

  return {
    attackerWinChance: Math.round(attackerWinChance * 100),
    defenderWinChance: Math.round(defenderWinChance * 100),
    attackerLosses: Math.min(100, Math.round(attackerLosses)),
    defenderLosses: Math.min(100, Math.round(defenderLosses)),
    winner: attackerWinChance > 0.5 ? 'attacker' : 'defender'
  };
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toString();
}

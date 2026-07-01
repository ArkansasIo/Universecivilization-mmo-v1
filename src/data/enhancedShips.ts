// Enhanced Ship System with Comprehensive Stats and Game Logic

export interface EnhancedShip {
  id: string;
  name: string;
  class: string;
  tier: number;
  rarity: string;
  level: number;
  maxLevel: number;
  
  // Hull & Structure
  hull: {
    current: number;
    maximum: number;
    armor: number;
    structuralIntegrity: number;
    hullRegeneration: number;
    damageReduction: number;
    armorType: 'Light' | 'Medium' | 'Heavy' | 'Composite' | 'Reactive' | 'Ablative';
  };
  
  // Shield Systems
  shields: {
    current: number;
    maximum: number;
    rechargeRate: number;
    rechargeDelay: number;
    efficiency: number;
    shieldType: 'Standard' | 'Deflector' | 'Adaptive' | 'Phase' | 'Quantum';
    resistance: {
      kinetic: number;
      energy: number;
      explosive: number;
      plasma: number;
      exotic: number;
    };
  };
  
  // Power Core
  power: {
    reactor: string;
    output: number;
    capacity: number;
    efficiency: number;
    backup: number;
    distribution: {
      weapons: number;
      shields: number;
      engines: number;
      systems: number;
    };
  };
  
  // Crew & Personnel
  crew: {
    current: number;
    maximum: number;
    officers: number;
    engineers: number;
    gunners: number;
    pilots: number;
    marines: number;
    scientists: number;
    morale: number;
    efficiency: number;
    experience: number;
  };
  
  // Weapon Systems
  weapons: {
    primary: Array<{
      name: string;
      type: 'Kinetic' | 'Energy' | 'Missile' | 'Plasma' | 'Exotic';
      damage: number;
      dps: number;
      range: number;
      fireRate: number;
      accuracy: number;
      penetration: number;
      tracking: number;
      slots: number;
      ammunition?: number;
      maxAmmunition?: number;
    }>;
    secondary: Array<{
      name: string;
      type: 'Kinetic' | 'Energy' | 'Missile' | 'Plasma' | 'Exotic';
      damage: number;
      dps: number;
      range: number;
      fireRate: number;
      accuracy: number;
      penetration: number;
      tracking: number;
      slots: number;
      ammunition?: number;
      maxAmmunition?: number;
    }>;
    special: Array<{
      name: string;
      type: string;
      effect: string;
      damage?: number;
      cooldown: number;
      powerCost: number;
      range?: number;
    }>;
    totalFirepower: number;
    totalDPS: number;
    weaponSlots: {
      used: number;
      maximum: number;
    };
  };
  
  // Defensive Systems
  defense: {
    pointDefense: {
      rating: number;
      range: number;
      accuracy: number;
      trackingSpeed: number;
    };
    counterMeasures: {
      chaff: number;
      flares: number;
      ecm: number;
      decoys: number;
    };
    armorPlating: {
      thickness: number;
      coverage: number;
      type: string;
    };
    reinforcedBulkheads: boolean;
    emergencyShields: boolean;
    damageControl: {
      repairBots: number;
      nanites: boolean;
      efficiency: number;
    };
  };
  
  // Mobility & Propulsion
  mobility: {
    speed: number;
    maxSpeed: number;
    acceleration: number;
    deceleration: number;
    turnRate: number;
    agility: number;
    evasion: number;
    ftlSpeed: number;
    ftlRange: number;
    ftlCooldown: number;
    engines: {
      type: string;
      thrust: number;
      efficiency: number;
      redundancy: number;
    };
  };
  
  // Capacity & Storage
  capacity: {
    cargo: {
      current: number;
      maximum: number;
    };
    fuel: {
      current: number;
      maximum: number;
      consumption: number;
    };
    hangar: {
      fighters: number;
      maxFighters: number;
      bombers: number;
      maxBombers: number;
      shuttles: number;
      maxShuttles: number;
    };
    troops: {
      current: number;
      maximum: number;
    };
    vehicles: {
      current: number;
      maximum: number;
    };
    ammunition: {
      missiles: number;
      torpedoes: number;
      mines: number;
      drones: number;
    };
  };
  
  // Advanced Systems
  systems: {
    sensors: {
      range: number;
      resolution: number;
      stealth: number;
      jamming: number;
      targeting: number;
      earlyWarning: boolean;
    };
    engineering: {
      repairRate: number;
      efficiency: number;
      redundancy: number;
      emergencyPower: boolean;
      damageControl: number;
    };
    tactical: {
      targeting: number;
      fireControl: number;
      battleComputer: string;
      aiLevel: number;
      coordination: number;
    };
    communications: {
      range: number;
      encryption: number;
      bandwidth: number;
      fleetCommand: boolean;
    };
    lifesupport: {
      capacity: number;
      efficiency: number;
      backup: boolean;
    };
  };
  
  // Special Abilities
  abilities: Array<{
    name: string;
    description: string;
    type: 'Active' | 'Passive' | 'Toggle';
    cooldown?: number;
    duration?: number;
    powerCost?: number;
    effect: string;
    unlockLevel?: number;
  }>;
  
  // Unique Traits
  traits: {
    passive: string[];
    combat: string[];
    utility: string[];
    legendary?: string[];
  };
  
  // Upgrade Paths
  upgrades: {
    hull: number;
    shields: number;
    weapons: number;
    engines: number;
    systems: number;
  };
  
  // Combat Statistics
  combatStats: {
    kills: number;
    deaths: number;
    damageDealt: number;
    damageTaken: number;
    missionsCompleted: number;
    experience: number;
    rank: string;
  };
  
  // Maintenance & Logistics
  maintenance: {
    repairCost: {
      metal: number;
      crystal: number;
      deuterium: number;
    };
    upkeepCost: {
      metal: number;
      crystal: number;
      deuterium: number;
    };
    repairTime: number;
    lastMaintenance: Date;
    condition: number;
  };
  
  // Build Requirements
  requirements: {
    metal: number;
    crystal: number;
    deuterium: number;
    darkMatter: number;
    antimatter: number;
    buildTime: number;
    shipyard: number;
    technologies: string[];
  };
  
  description: string;
  lore: string;
  image: string;
}

// Game Logic Functions
export class ShipGameLogic {
  // Calculate total combat power
  static calculateCombatPower(ship: EnhancedShip): number {
    const hullPower = ship.hull.maximum * 0.3;
    const shieldPower = ship.shields.maximum * 0.25;
    const weaponPower = ship.weapons.totalFirepower * 0.35;
    const defensePower = ship.defense.pointDefense.rating * 0.1;
    
    return Math.floor(hullPower + shieldPower + weaponPower + defensePower);
  }
  
  // Calculate damage dealt to target
  static calculateDamage(attacker: EnhancedShip, defender: EnhancedShip, weaponType: 'primary' | 'secondary'): number {
    const weapons = weaponType === 'primary' ? attacker.weapons.primary : attacker.weapons.secondary;
    let totalDamage = 0;
    
    weapons.forEach(weapon => {
      let damage = weapon.damage;
      
      // Apply accuracy
      if (Math.random() * 100 > weapon.accuracy - defender.mobility.evasion) {
        return; // Miss
      }
      
      // Apply penetration vs armor
      const armorReduction = Math.max(0, defender.hull.armor - weapon.penetration);
      damage = damage * (1 - armorReduction / 100);
      
      // Apply shield resistance
      const resistance = defender.shields.resistance[weapon.type.toLowerCase() as keyof typeof defender.shields.resistance] || 0;
      damage = damage * (1 - resistance / 100);
      
      // Critical hit chance
      if (Math.random() * 100 < 5) {
        damage *= 2;
      }
      
      totalDamage += damage;
    });
    
    return Math.floor(totalDamage);
  }
  
  // Apply damage to ship
  static applyDamage(ship: EnhancedShip, damage: number): void {
    // Shields absorb first
    if (ship.shields.current > 0) {
      const shieldDamage = Math.min(damage, ship.shields.current);
      ship.shields.current -= shieldDamage;
      damage -= shieldDamage;
    }
    
    // Remaining damage to hull
    if (damage > 0) {
      const hullDamage = damage * (1 - ship.hull.damageReduction / 100);
      ship.hull.current = Math.max(0, ship.hull.current - hullDamage);
    }
  }
  
  // Regenerate shields
  static regenerateShields(ship: EnhancedShip, deltaTime: number): void {
    if (ship.shields.current < ship.shields.maximum) {
      const regenAmount = ship.shields.rechargeRate * deltaTime * ship.shields.efficiency / 100;
      ship.shields.current = Math.min(ship.shields.maximum, ship.shields.current + regenAmount);
    }
  }
  
  // Repair hull
  static repairHull(ship: EnhancedShip, deltaTime: number): void {
    if (ship.hull.current < ship.hull.maximum) {
      const repairAmount = ship.hull.hullRegeneration * deltaTime * ship.systems.engineering.efficiency / 100;
      ship.hull.current = Math.min(ship.hull.maximum, ship.hull.current + repairAmount);
    }
  }
  
  // Calculate fuel consumption
  static calculateFuelConsumption(ship: EnhancedShip, distance: number): number {
    const baseFuel = distance * ship.capacity.fuel.consumption;
    const efficiencyMod = ship.mobility.engines.efficiency / 100;
    return Math.floor(baseFuel * (2 - efficiencyMod));
  }
  
  // Check if ship can perform FTL jump
  static canJump(ship: EnhancedShip, distance: number): boolean {
    if (distance > ship.mobility.ftlRange) return false;
    
    const fuelRequired = this.calculateFuelConsumption(ship, distance);
    if (ship.capacity.fuel.current < fuelRequired) return false;
    
    return true;
  }
  
  // Calculate crew efficiency
  static calculateCrewEfficiency(ship: EnhancedShip): number {
    const crewRatio = ship.crew.current / ship.crew.maximum;
    const moraleBonus = ship.crew.morale / 100;
    const experienceBonus = ship.crew.experience / 100;
    
    return Math.min(150, (crewRatio * 100) * moraleBonus * experienceBonus);
  }
  
  // Calculate maintenance cost
  static calculateMaintenanceCost(ship: EnhancedShip): { metal: number; crystal: number; deuterium: number } {
    const condition = ship.maintenance.condition / 100;
    const multiplier = 2 - condition; // Higher cost when damaged
    
    return {
      metal: Math.floor(ship.maintenance.upkeepCost.metal * multiplier),
      crystal: Math.floor(ship.maintenance.upkeepCost.crystal * multiplier),
      deuterium: Math.floor(ship.maintenance.upkeepCost.deuterium * multiplier)
    };
  }
  
  // Level up ship
  static levelUp(ship: EnhancedShip): void {
    if (ship.level >= ship.maxLevel) return;
    
    ship.level++;
    
    // Increase stats
    ship.hull.maximum = Math.floor(ship.hull.maximum * 1.05);
    ship.hull.current = ship.hull.maximum;
    ship.shields.maximum = Math.floor(ship.shields.maximum * 1.05);
    ship.shields.current = ship.shields.maximum;
    ship.weapons.totalFirepower = Math.floor(ship.weapons.totalFirepower * 1.03);
    ship.power.output = Math.floor(ship.power.output * 1.02);
    
    // Increase crew experience
    ship.crew.experience = Math.min(100, ship.crew.experience + 1);
  }
  
  // Check if ship is destroyed
  static isDestroyed(ship: EnhancedShip): boolean {
    return ship.hull.current <= 0;
  }
  
  // Calculate retreat chance
  static calculateRetreatChance(ship: EnhancedShip): number {
    const hullPercent = (ship.hull.current / ship.hull.maximum) * 100;
    const speedBonus = ship.mobility.speed / 100;
    const moraleBonus = ship.crew.morale / 100;
    
    let chance = 50;
    if (hullPercent < 25) chance += 30;
    else if (hullPercent < 50) chance += 15;
    
    chance += speedBonus * 10;
    chance += moraleBonus * 10;
    
    return Math.min(95, Math.max(5, chance));
  }
}

// Example Enhanced Ships
export const enhancedShips: EnhancedShip[] = [
  {
    id: 'titan_battleship_001',
    name: 'Eternal Titan Battleship',
    class: 'Titan',
    tier: 95,
    rarity: 'Transcendent',
    level: 1,
    maxLevel: 100,
    
    hull: {
      current: 50000000,
      maximum: 50000000,
      armor: 25000,
      structuralIntegrity: 98,
      hullRegeneration: 5000,
      damageReduction: 45,
      armorType: 'Reactive'
    },
    
    shields: {
      current: 30000000,
      maximum: 30000000,
      rechargeRate: 50000,
      rechargeDelay: 5,
      efficiency: 95,
      shieldType: 'Quantum',
      resistance: {
        kinetic: 40,
        energy: 50,
        explosive: 35,
        plasma: 45,
        exotic: 30
      }
    },
    
    power: {
      reactor: 'Zero-Point Energy Reactor',
      output: 1000000,
      capacity: 5000000,
      efficiency: 98,
      backup: 500000,
      distribution: {
        weapons: 40,
        shields: 30,
        engines: 15,
        systems: 15
      }
    },
    
    crew: {
      current: 50000,
      maximum: 50000,
      officers: 500,
      engineers: 10000,
      gunners: 15000,
      pilots: 5000,
      marines: 15000,
      scientists: 4500,
      morale: 95,
      efficiency: 98,
      experience: 85
    },
    
    weapons: {
      primary: [
        {
          name: 'Titan Plasma Lance Array',
          type: 'Plasma',
          damage: 500000,
          dps: 100000,
          range: 500000,
          fireRate: 0.2,
          accuracy: 92,
          penetration: 80,
          tracking: 45,
          slots: 10
        },
        {
          name: 'Quantum Disruptor Cannons',
          type: 'Exotic',
          damage: 750000,
          dps: 150000,
          range: 400000,
          fireRate: 0.2,
          accuracy: 88,
          penetration: 95,
          tracking: 40,
          slots: 8
        }
      ],
      secondary: [
        {
          name: 'Heavy Missile Batteries',
          type: 'Missile',
          damage: 300000,
          dps: 60000,
          range: 800000,
          fireRate: 0.2,
          accuracy: 85,
          penetration: 70,
          tracking: 60,
          slots: 12,
          ammunition: 5000,
          maxAmmunition: 5000
        }
      ],
      special: [
        {
          name: 'Titan\'s Wrath',
          type: 'Ultimate',
          effect: 'Deals 5,000,000 damage to all enemies in 100km radius',
          damage: 5000000,
          cooldown: 300,
          powerCost: 500000,
          range: 100000
        },
        {
          name: 'Reality Distortion Field',
          type: 'Defensive',
          effect: 'Reduces all incoming damage by 90% for 30 seconds',
          cooldown: 600,
          powerCost: 300000
        }
      ],
      totalFirepower: 2500000,
      totalDPS: 500000,
      weaponSlots: {
        used: 30,
        maximum: 50
      }
    },
    
    defense: {
      pointDefense: {
        rating: 95,
        range: 50000,
        accuracy: 92,
        trackingSpeed: 85
      },
      counterMeasures: {
        chaff: 10000,
        flares: 10000,
        ecm: 95,
        decoys: 500
      },
      armorPlating: {
        thickness: 5000,
        coverage: 98,
        type: 'Composite Reactive Armor'
      },
      reinforcedBulkheads: true,
      emergencyShields: true,
      damageControl: {
        repairBots: 50000,
        nanites: true,
        efficiency: 95
      }
    },
    
    mobility: {
      speed: 250,
      maxSpeed: 350,
      acceleration: 50,
      deceleration: 60,
      turnRate: 15,
      agility: 25,
      evasion: 10,
      ftlSpeed: 10000,
      ftlRange: 1000000,
      ftlCooldown: 60,
      engines: {
        type: 'Quantum Warp Drive',
        thrust: 500000,
        efficiency: 95,
        redundancy: 3
      }
    },
    
    capacity: {
      cargo: {
        current: 50000,
        maximum: 500000
      },
      fuel: {
        current: 1000000,
        maximum: 1000000,
        consumption: 100
      },
      hangar: {
        fighters: 500,
        maxFighters: 1000,
        bombers: 300,
        maxBombers: 500,
        shuttles: 100,
        maxShuttles: 200
      },
      troops: {
        current: 50000,
        maximum: 100000
      },
      vehicles: {
        current: 500,
        maximum: 1000
      },
      ammunition: {
        missiles: 50000,
        torpedoes: 10000,
        mines: 5000,
        drones: 2000
      }
    },
    
    systems: {
      sensors: {
        range: 1000000,
        resolution: 98,
        stealth: 15,
        jamming: 85,
        targeting: 95,
        earlyWarning: true
      },
      engineering: {
        repairRate: 10000,
        efficiency: 98,
        redundancy: 95,
        emergencyPower: true,
        damageControl: 95
      },
      tactical: {
        targeting: 95,
        fireControl: 98,
        battleComputer: 'Quantum AI Mk.X',
        aiLevel: 10,
        coordination: 95
      },
      communications: {
        range: 5000000,
        encryption: 99,
        bandwidth: 10000,
        fleetCommand: true
      },
      lifesupport: {
        capacity: 100000,
        efficiency: 98,
        backup: true
      }
    },
    
    abilities: [
      {
        name: 'Titan Mode',
        description: 'Increases all combat stats by 50% for 60 seconds',
        type: 'Active',
        cooldown: 300,
        duration: 60,
        powerCost: 200000,
        effect: '+50% All Combat Stats',
        unlockLevel: 50
      },
      {
        name: 'Fleet Commander',
        description: 'Increases all allied ships stats by 25%',
        type: 'Passive',
        effect: '+25% Fleet Stats',
        unlockLevel: 1
      },
      {
        name: 'Unstoppable Force',
        description: 'Immune to crowd control effects',
        type: 'Passive',
        effect: 'CC Immunity',
        unlockLevel: 75
      },
      {
        name: 'Emergency Warp',
        description: 'Instantly teleport to any location within 500,000 km',
        type: 'Active',
        cooldown: 600,
        powerCost: 500000,
        effect: 'Instant Teleport',
        unlockLevel: 90
      }
    ],
    
    traits: {
      passive: [
        '+100% Hull Regeneration',
        '+50% Shield Recharge Rate',
        '+25% Weapon Damage',
        '+20% Movement Speed'
      ],
      combat: [
        'Armor Piercing Rounds',
        'Shield Penetration',
        'Critical Strike Master',
        'Area Damage'
      ],
      utility: [
        'Fleet Coordination',
        'Resource Efficiency',
        'Repair Aura',
        'Sensor Boost'
      ],
      legendary: [
        'Titan\'s Presence - Enemies within 100km have -30% all stats',
        'Immortal - Cannot be destroyed, minimum 1 HP',
        'Reality Bender - Can manipulate space-time'
      ]
    },
    
    upgrades: {
      hull: 95,
      shields: 95,
      weapons: 95,
      engines: 95,
      systems: 95
    },
    
    combatStats: {
      kills: 15000,
      deaths: 0,
      damageDealt: 500000000000,
      damageTaken: 50000000000,
      missionsCompleted: 5000,
      experience: 999999,
      rank: 'Grand Admiral'
    },
    
    maintenance: {
      repairCost: {
        metal: 5000000,
        crystal: 3000000,
        deuterium: 2000000
      },
      upkeepCost: {
        metal: 100000,
        crystal: 50000,
        deuterium: 25000
      },
      repairTime: 86400,
      lastMaintenance: new Date(),
      condition: 100
    },
    
    requirements: {
      metal: 50000000,
      crystal: 30000000,
      deuterium: 15000000,
      darkMatter: 100000,
      antimatter: 50000,
      buildTime: 2592000,
      shipyard: 30,
      technologies: [
        'Advanced Shipbuilding 20',
        'Plasma Technology 20',
        'Quantum Physics 18',
        'Hyperspace Technology 20'
      ]
    },
    
    description: 'The ultimate expression of naval engineering. A Titan-class battleship capable of destroying entire fleets single-handedly.',
    lore: 'Forged in the heart of a dying star, the Eternal Titan represents the pinnacle of military technology. Its mere presence on the battlefield can turn the tide of war. Legends speak of a single Titan holding off an entire armada for three days, emerging victorious without a scratch.',
    image: 'https://readdy.ai/api/search-image?query=massive%20titan%20class%20battleship%20with%20overwhelming%20firepower%20and%20imposing%20presence%20dominating%20space%20battlefield%20epic%20scale%20futuristic%20military%20vessel%20dark%20metallic%20hull%20with%20glowing%20energy%20cores&width=800&height=600&seq=titan001&orientation=landscape'
  }
];

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface CombatUnit {
  type: string;
  count: number;
  attack: number;
  defense: number;
  shield: number;
  hull: number;
  speed: number;
}

interface CombatParticipant {
  id: string;
  name: string;
  units: CombatUnit[];
  technology: {
    weapons: number;
    shields: number;
    armor: number;
  };
  resources?: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
}

interface BattleResult {
  winner: 'attacker' | 'defender' | 'draw';
  rounds: number;
  attackerLosses: Record<string, number>;
  defenderLosses: Record<string, number>;
  loot: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  debrisField: {
    metal: number;
    crystal: number;
  };
  experienceGained: number;
  combatReport: string[];
}

export function useAdvancedCombat() {
  const [isSimulating, setIsSimulating] = useState(false);

  const calculateDamage = useCallback((
    attacker: CombatUnit,
    defender: CombatUnit,
    attackerTech: { weapons: number; shields: number; armor: number },
    defenderTech: { weapons: number; shields: number; armor: number }
  ) => {
    // Base damage with technology bonus
    const baseDamage = attacker.attack * (1 + attackerTech.weapons * 0.1);
    
    // Shield absorption
    const shieldStrength = defender.shield * (1 + defenderTech.shields * 0.1);
    const damageAfterShield = Math.max(0, baseDamage - shieldStrength);
    
    // Armor reduction
    const armorStrength = defender.defense * (1 + defenderTech.armor * 0.1);
    const finalDamage = Math.max(0, damageAfterShield * (1 - armorStrength / 100));
    
    // Calculate units destroyed
    const unitsDestroyed = Math.floor(finalDamage / defender.hull);
    
    return {
      damage: finalDamage,
      unitsDestroyed: Math.min(unitsDestroyed, defender.count),
      shieldAbsorbed: Math.min(baseDamage, shieldStrength),
      armorReduced: damageAfterShield - finalDamage
    };
  }, []);

  const simulateBattle = useCallback(async (
    attacker: CombatParticipant,
    defender: CombatParticipant
  ): Promise<BattleResult> => {
    setIsSimulating(true);

    const combatReport: string[] = [];
    const attackerUnits = JSON.parse(JSON.stringify(attacker.units));
    const defenderUnits = JSON.parse(JSON.stringify(defender.units));
    
    const attackerLosses: Record<string, number> = {};
    const defenderLosses: Record<string, number> = {};

    combatReport.push('╔════════════════════════════════════════╗');
    combatReport.push('║        BATTLE REPORT INITIATED         ║');
    combatReport.push('╚════════════════════════════════════════╝');
    combatReport.push('');
    combatReport.push(`Attacker: ${attacker.name}`);
    combatReport.push(`Defender: ${defender.name}`);
    combatReport.push('');

    let round = 0;
    const maxRounds = 6;

    while (round < maxRounds) {
      round++;
      combatReport.push(`\n┌─── Round ${round} ───┐`);

      // Check if battle should continue
      const attackerAlive = attackerUnits.some(u => u.count > 0);
      const defenderAlive = defenderUnits.some(u => u.count > 0);

      if (!attackerAlive || !defenderAlive) {
        break;
      }

      // Attacker's turn
      combatReport.push('│ Attacker fires:');
      attackerUnits.forEach(attackerUnit => {
        if (attackerUnit.count <= 0) return;

        // Find target (prioritize weakest units)
        const targets = defenderUnits.filter(u => u.count > 0);
        if (targets.length === 0) return;

        const target = targets.reduce((weakest, current) => 
          current.hull < weakest.hull ? current : weakest
        );

        const damageResult = calculateDamage(
          attackerUnit,
          target,
          attacker.technology,
          defender.technology
        );

        if (damageResult.unitsDestroyed > 0) {
          target.count -= damageResult.unitsDestroyed;
          defenderLosses[target.type] = (defenderLosses[target.type] || 0) + damageResult.unitsDestroyed;
          
          combatReport.push(
            `│   ${attackerUnit.type} (${attackerUnit.count}x) → ${target.type}: ` +
            `${damageResult.unitsDestroyed} destroyed (${Math.floor(damageResult.damage)} dmg)`
          );
        }
      });

      // Defender's turn
      combatReport.push('│ Defender fires:');
      defenderUnits.forEach(defenderUnit => {
        if (defenderUnit.count <= 0) return;

        const targets = attackerUnits.filter(u => u.count > 0);
        if (targets.length === 0) return;

        const target = targets.reduce((weakest, current) => 
          current.hull < weakest.hull ? current : weakest
        );

        const damageResult = calculateDamage(
          defenderUnit,
          target,
          defender.technology,
          attacker.technology
        );

        if (damageResult.unitsDestroyed > 0) {
          target.count -= damageResult.unitsDestroyed;
          attackerLosses[target.type] = (attackerLosses[target.type] || 0) + damageResult.unitsDestroyed;
          
          combatReport.push(
            `│   ${defenderUnit.type} (${defenderUnit.count}x) → ${target.type}: ` +
            `${damageResult.unitsDestroyed} destroyed (${Math.floor(damageResult.damage)} dmg)`
          );
        }
      });

      combatReport.push('└──────────────┘');
    }

    // Determine winner
    const attackerSurvived = attackerUnits.some(u => u.count > 0);
    const defenderSurvived = defenderUnits.some(u => u.count > 0);

    let winner: 'attacker' | 'defender' | 'draw';
    if (attackerSurvived && !defenderSurvived) {
      winner = 'attacker';
      combatReport.push('\n╔════════════════════════════════════════╗');
      combatReport.push('║          ATTACKER VICTORIOUS!          ║');
      combatReport.push('╚════════════════════════════════════════╝');
    } else if (!attackerSurvived && defenderSurvived) {
      winner = 'defender';
      combatReport.push('\n╔════════════════════════════════════════╗');
      combatReport.push('║          DEFENDER VICTORIOUS!          ║');
      combatReport.push('╚════════════════════════════════════════╝');
    } else {
      winner = 'draw';
      combatReport.push('\n╔════════════════════════════════════════╗');
      combatReport.push('║              BATTLE DRAW               ║');
      combatReport.push('╚════════════════════════════════════════╝');
    }

    // Calculate loot (50% of resources if attacker wins)
    const loot = winner === 'attacker' && defender.resources ? {
      metal: Math.floor(defender.resources.metal * 0.5),
      crystal: Math.floor(defender.resources.crystal * 0.5),
      deuterium: Math.floor(defender.resources.deuterium * 0.5)
    } : { metal: 0, crystal: 0, deuterium: 0 };

    // Calculate debris field (30% of destroyed units)
    let debrisMetal = 0;
    let debrisCrystal = 0;

    Object.entries(attackerLosses).forEach(([type, count]) => {
      const unit = attacker.units.find(u => u.type === type);
      if (unit) {
        debrisMetal += count * unit.hull * 0.3;
        debrisCrystal += count * unit.hull * 0.15;
      }
    });

    Object.entries(defenderLosses).forEach(([type, count]) => {
      const unit = defender.units.find(u => u.type === type);
      if (unit) {
        debrisMetal += count * unit.hull * 0.3;
        debrisCrystal += count * unit.hull * 0.15;
      }
    });

    const debrisField = {
      metal: Math.floor(debrisMetal),
      crystal: Math.floor(debrisCrystal)
    };

    // Calculate experience gained
    const totalLosses = Object.values(attackerLosses).reduce((a, b) => a + b, 0) +
                       Object.values(defenderLosses).reduce((a, b) => a + b, 0);
    const experienceGained = totalLosses * 100;

    combatReport.push('\n┌─── Battle Summary ───┐');
    combatReport.push(`│ Rounds: ${round}`);
    combatReport.push(`│ Attacker Losses: ${Object.values(attackerLosses).reduce((a, b) => a + b, 0)} units`);
    combatReport.push(`│ Defender Losses: ${Object.values(defenderLosses).reduce((a, b) => a + b, 0)} units`);
    if (winner === 'attacker') {
      combatReport.push(`│ Loot: ${loot.metal.toLocaleString()} M, ${loot.crystal.toLocaleString()} C, ${loot.deuterium.toLocaleString()} D`);
    }
    combatReport.push(`│ Debris: ${debrisField.metal.toLocaleString()} M, ${debrisField.crystal.toLocaleString()} C`);
    combatReport.push(`│ Experience: +${experienceGained.toLocaleString()}`);
    combatReport.push('└──────────────────────┘');

    setIsSimulating(false);

    return {
      winner,
      rounds: round,
      attackerLosses,
      defenderLosses,
      loot,
      debrisField,
      experienceGained,
      combatReport
    };
  }, [calculateDamage]);

  const saveBattleReport = useCallback(async (
    attackerId: string,
    defenderId: string,
    result: BattleResult
  ) => {
    try {
      await supabase.from('battle_reports').insert({
        attacker_id: attackerId,
        defender_id: defenderId,
        winner: result.winner,
        rounds: result.rounds,
        attacker_losses: result.attackerLosses,
        defender_losses: result.defenderLosses,
        loot: result.loot,
        debris_field: result.debrisField,
        experience_gained: result.experienceGained,
        combat_report: result.combatReport,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving battle report:', error);
    }
  }, []);

  return {
    simulateBattle,
    saveBattleReport,
    isSimulating
  };
}

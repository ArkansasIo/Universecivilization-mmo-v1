import SkillTreeLayout from '../components/SkillTreeLayout';
import { SkillNode } from '../components/SkillTreeNode';

const COLOR = '#4ade80';

const TIER1: SkillNode[] = [
  {
    id: 'eng_blueprint_reading',
    name: 'Blueprint Reading',
    icon: 'ri-file-list-3-line',
    description: 'Rapidly interpret complex schematics and engineering diagrams.',
    passiveBonus: 'Reduces failure chance when crafting modules and devices',
    bonusPerLevel: '-4% crafting failure rate',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 500 },
  },
  {
    id: 'eng_circuit_assembly',
    name: 'Circuit Assembly',
    icon: 'ri-cpu-line',
    description: 'Efficiently assemble complex electronic circuits with minimal waste.',
    passiveBonus: 'Reduces electronic component costs in module crafting',
    bonusPerLevel: '-3% component cost',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 450 },
  },
  {
    id: 'eng_power_routing',
    name: 'Power Routing',
    icon: 'ri-flashlight-line',
    description: 'Optimize power distribution networks inside crafted modules.',
    passiveBonus: 'Crafted power modules produce more output',
    bonusPerLevel: '+3% power module output',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 450 },
  },
  {
    id: 'eng_structural_eng',
    name: 'Structural Eng.',
    icon: 'ri-building-2-line',
    description: 'Design load-bearing structures with optimal stress distribution.',
    passiveBonus: 'Crafted ship modules gain bonus hull integrity',
    bonusPerLevel: '+4% module hull integrity',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 400 },
  },
];

const TIER2: SkillNode[] = [
  {
    id: 'eng_propulsion_tuning',
    name: 'Propulsion Tuning',
    icon: 'ri-rocket-line',
    description: 'Fine-tune thruster output ratios and fuel injection timing.',
    passiveBonus: 'Crafted propulsion modules grant speed and fuel efficiency bonuses',
    bonusPerLevel: '+3% ship speed, -2% fuel consumption',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['eng_blueprint_reading'],
    tier: 2,
    color: '#34d399',
    cost: { skillPoints: 2, credits: 1300 },
    unlocks: 'Advanced propulsion module blueprints',
  },
  {
    id: 'eng_shield_capacitors',
    name: 'Shield Capacitors',
    icon: 'ri-shield-flash-line',
    description: 'Engineer high-density capacitor arrays to power shields more efficiently.',
    passiveBonus: 'Crafted shield modules have higher recharge rate',
    bonusPerLevel: '+5% shield recharge rate',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['eng_circuit_assembly', 'eng_power_routing'],
    tier: 2,
    color: '#34d399',
    cost: { skillPoints: 2, credits: 1300 },
  },
  {
    id: 'eng_hull_reinforcement',
    name: 'Hull Reinforcement',
    icon: 'ri-shield-cross-line',
    description: 'Apply micro-lattice reinforcement techniques to ship hull sections.',
    passiveBonus: 'Crafted hull plating modules gain extra HP',
    bonusPerLevel: '+5% hull HP',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['eng_structural_eng'],
    tier: 2,
    color: '#34d399',
    cost: { skillPoints: 2, credits: 1200 },
  },
  {
    id: 'eng_weapon_mounts',
    name: 'Weapon Mounts',
    icon: 'ri-sword-line',
    description: 'Engineer precision weapon hardpoints with optimal recoil absorption.',
    passiveBonus: 'Crafted weapon mount modules increase turret accuracy',
    bonusPerLevel: '+3% turret accuracy',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['eng_structural_eng'],
    tier: 2,
    color: '#34d399',
    cost: { skillPoints: 2, credits: 1200 },
  },
];

const TIER3: SkillNode[] = [
  {
    id: 'eng_quantum_drives',
    name: 'Quantum Drives',
    icon: 'ri-focus-3-line',
    description: 'Design quantum-fold propulsion systems for near-instantaneous acceleration.',
    passiveBonus: 'Crafted quantum drives give massive warp speed bonuses',
    bonusPerLevel: '+8% warp speed',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['eng_propulsion_tuning', 'eng_shield_capacitors'],
    tier: 3,
    color: '#60a5fa',
    cost: { skillPoints: 3, credits: 3000 },
    unlocks: 'Quantum Drive module tier',
  },
  {
    id: 'eng_reactor_core',
    name: 'Reactor Core',
    icon: 'ri-sparkling-line',
    description: 'Build compact fusion reactor cores with extreme energy density.',
    passiveBonus: 'Crafted reactors generate more energy per tick',
    bonusPerLevel: '+6% energy generation',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['eng_hull_reinforcement', 'eng_weapon_mounts'],
    tier: 3,
    color: '#60a5fa',
    cost: { skillPoints: 3, credits: 2800 },
  },
  {
    id: 'eng_sensor_arrays',
    name: 'Sensor Arrays',
    icon: 'ri-radar-line',
    description: 'Integrate multi-spectrum sensor arrays with AI-assisted processing.',
    passiveBonus: 'Crafted sensor modules extend scan range and accuracy',
    bonusPerLevel: '+5% scan range, +3% scan accuracy',
    maxLevel: 4,
    currentLevel: 0,
    requires: ['eng_circuit_assembly'],
    tier: 3,
    color: '#60a5fa',
    cost: { skillPoints: 3, credits: 2500 },
  },
];

const TIER4: SkillNode[] = [
  {
    id: 'eng_singularity_core',
    name: 'Singularity Core',
    icon: 'ri-restart-fill',
    description: 'Harness controlled micro-singularities as power sources.',
    passiveBonus: 'Crafted singularity reactors provide near-unlimited power for abilities',
    bonusPerLevel: '+10% ability power cost reduction',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['eng_quantum_drives', 'eng_reactor_core'],
    tier: 4,
    color: '#c084fc',
    cost: { skillPoints: 4, credits: 6500 },
    unlocks: 'Singularity-class reactor blueprint',
  },
  {
    id: 'eng_adaptive_hull',
    name: 'Adaptive Hull',
    icon: 'ri-magic-line',
    description: 'Engineer hulls that dynamically reconfigure in response to damage patterns.',
    passiveBonus: 'Crafted adaptive hulls gain bonus resistance as they take damage',
    bonusPerLevel: '+3% damage resistance stacking when under attack',
    maxLevel: 4,
    currentLevel: 0,
    requires: ['eng_sensor_arrays', 'eng_reactor_core'],
    tier: 4,
    color: '#c084fc',
    cost: { skillPoints: 4, credits: 6000 },
  },
];

const TIER5: SkillNode[] = [
  {
    id: 'eng_omega_engineering',
    name: 'Omega Engineering',
    icon: 'ri-vip-crown-line',
    description: 'Achieve pinnacle engineering mastery across all module disciplines.',
    passiveBonus: 'All engineering crafting bonuses amplified, unlock blueprint efficiency',
    bonusPerLevel: '+10% multiplier to all engineering passive bonuses',
    maxLevel: 3,
    currentLevel: 0,
    requires: ['eng_singularity_core', 'eng_adaptive_hull'],
    tier: 5,
    color: '#fbbf24',
    cost: { skillPoints: 5, credits: 15000 },
    unlocks: 'Omega-class ship module designs — exclusive to Grandmaster Engineers',
  },
];

const TIERS = [TIER1, TIER2, TIER3, TIER4, TIER5];

export default function EngineeringPage() {
  return (
    <SkillTreeLayout
      treeId="engineering"
      treeName="Engineering"
      treeIcon="ri-tools-line"
      treeColor={COLOR}
      treeDescription="Master the science of module construction and system design — from basic circuits to singularity-powered cores. Engineering passives boost all crafted ship modules, power systems, and drives."
      tiers={TIERS}
      tierLabels={['Apprentice', 'Journeyman', 'Expert', 'Master', 'Grandmaster']}
      loreText="The universe does not yield to force alone — it yields to understanding."
    />
  );
}
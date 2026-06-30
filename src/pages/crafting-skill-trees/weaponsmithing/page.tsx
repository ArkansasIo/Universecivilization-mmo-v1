import SkillTreeLayout from '../components/SkillTreeLayout';
import { SkillNode } from '../components/SkillTreeNode';

const COLOR = '#f87171';

const TIER1: SkillNode[] = [
  {
    id: 'ws_raw_forging',
    name: 'Raw Forging',
    icon: 'ri-hammer-line',
    description: 'Master the basics of heating and shaping raw metals into weapon blanks.',
    passiveBonus: 'Increases base weapon damage for all crafted weapons',
    bonusPerLevel: '+2% weapon damage',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 500 },
  },
  {
    id: 'ws_edge_grinding',
    name: 'Edge Grinding',
    icon: 'ri-scissors-cut-line',
    description: 'Perfect the art of sharpening blades to razor precision.',
    passiveBonus: 'Increases critical hit chance on crafted melee weapons',
    bonusPerLevel: '+1% critical hit chance',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 500 },
  },
  {
    id: 'ws_material_sense',
    name: 'Material Sense',
    icon: 'ri-user-search-line',
    description: 'Develop intuition for material quality and defects before forging.',
    passiveBonus: 'Reduces material waste during weapon crafting',
    bonusPerLevel: '-3% material waste',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 400 },
  },
  {
    id: 'ws_rapid_craft',
    name: 'Rapid Craft',
    icon: 'ri-time-line',
    description: 'Optimize workflow to reduce time spent on standard weapon recipes.',
    passiveBonus: 'Reduces weapon crafting time',
    bonusPerLevel: '-4% crafting time',
    maxLevel: 5,
    currentLevel: 0,
    tier: 1,
    color: COLOR,
    cost: { skillPoints: 1, credits: 400 },
  },
];

const TIER2: SkillNode[] = [
  {
    id: 'ws_alloy_mastery',
    name: 'Alloy Mastery',
    icon: 'ri-database-2-line',
    description: 'Blend multiple metals into superior alloys with enhanced properties.',
    passiveBonus: 'Crafted weapons gain bonus elemental resistance stats',
    bonusPerLevel: '+3% elemental resistance on weapons',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['ws_raw_forging'],
    tier: 2,
    color: '#fb923c',
    cost: { skillPoints: 2, credits: 1200 },
    unlocks: 'Exotic Alloy recipes in the Forge',
  },
  {
    id: 'ws_blade_geometry',
    name: 'Blade Geometry',
    icon: 'ri-ruler-line',
    description: 'Study optimal blade angles and curvature for maximum cutting efficiency.',
    passiveBonus: 'Crafted blades deal bonus armor-piercing damage',
    bonusPerLevel: '+2.5% armor penetration',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['ws_edge_grinding'],
    tier: 2,
    color: '#fb923c',
    cost: { skillPoints: 2, credits: 1200 },
  },
  {
    id: 'ws_heat_treatment',
    name: 'Heat Treatment',
    icon: 'ri-fire-line',
    description: 'Apply precise tempering cycles to maximize durability without brittleness.',
    passiveBonus: 'Crafted weapons gain bonus durability',
    bonusPerLevel: '+5% weapon durability',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['ws_material_sense'],
    tier: 2,
    color: '#fb923c',
    cost: { skillPoints: 2, credits: 1100 },
  },
  {
    id: 'ws_projectile_opt',
    name: 'Projectile Opt.',
    icon: 'ri-arrow-right-up-line',
    description: 'Optimize barrel rifling and ammunition chambers for higher velocity.',
    passiveBonus: 'Ranged weapons gain bonus attack range',
    bonusPerLevel: '+3% projectile range',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['ws_rapid_craft'],
    tier: 2,
    color: '#fb923c',
    cost: { skillPoints: 2, credits: 1100 },
  },
];

const TIER3: SkillNode[] = [
  {
    id: 'ws_runic_engraving',
    name: 'Runic Engraving',
    icon: 'ri-magic-line',
    description: 'Inscribe energy runes directly into weapon surfaces to channel power.',
    passiveBonus: 'All crafted weapons gain an energy infusion bonus',
    bonusPerLevel: '+4% energy damage bonus',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['ws_alloy_mastery', 'ws_blade_geometry'],
    tier: 3,
    color: '#60a5fa',
    cost: { skillPoints: 3, credits: 2500 },
    unlocks: 'Energy-infused weapon tier in the Forge',
  },
  {
    id: 'ws_explosive_core',
    name: 'Explosive Core',
    icon: 'ri-fire-fill',
    description: 'Design internal trigger mechanisms that detonate on impact.',
    passiveBonus: 'Explosive weapons deal bonus splash damage',
    bonusPerLevel: '+5% splash damage radius & damage',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['ws_heat_treatment', 'ws_projectile_opt'],
    tier: 3,
    color: '#60a5fa',
    cost: { skillPoints: 3, credits: 2500 },
  },
  {
    id: 'ws_dual_forging',
    name: 'Dual Forging',
    icon: 'ri-flashlight-line',
    description: 'Forge two complementary weapons simultaneously, sharing material phases.',
    passiveBonus: 'Crafting weapon sets gives bonus stat synergies',
    bonusPerLevel: '+3% stat bonus when using matched weapon pairs',
    maxLevel: 4,
    currentLevel: 0,
    requires: ['ws_alloy_mastery'],
    tier: 3,
    color: '#60a5fa',
    cost: { skillPoints: 3, credits: 2200 },
  },
];

const TIER4: SkillNode[] = [
  {
    id: 'ws_legendary_forge',
    name: 'Legendary Forge',
    icon: 'ri-award-line',
    description: 'Channel ancient forging techniques to create weapons of extraordinary power.',
    passiveBonus: 'Chance to produce a Legendary-tier result when crafting weapons',
    bonusPerLevel: '+4% legendary craft chance',
    maxLevel: 5,
    currentLevel: 0,
    requires: ['ws_runic_engraving', 'ws_explosive_core'],
    tier: 4,
    color: '#c084fc',
    cost: { skillPoints: 4, credits: 5000 },
    unlocks: 'Legendary Weapon tier — accessible in Master Crafting',
  },
  {
    id: 'ws_void_tempering',
    name: 'Void Tempering',
    icon: 'ri-focus-2-line',
    description: 'Temper weapons in void-energy fields, imparting reality-warping properties.',
    passiveBonus: 'Void-tempered weapons bypass energy shields partially',
    bonusPerLevel: '+6% shield penetration on all weapons',
    maxLevel: 4,
    currentLevel: 0,
    requires: ['ws_dual_forging', 'ws_runic_engraving'],
    tier: 4,
    color: '#c084fc',
    cost: { skillPoints: 4, credits: 5500 },
  },
];

const TIER5: SkillNode[] = [
  {
    id: 'ws_grand_armament',
    name: 'Grand Armament',
    icon: 'ri-vip-crown-line',
    description: 'Achieve transcendent mastery over all weapon-crafting disciplines.',
    passiveBonus: 'All weapon crafting bonuses from other skills are amplified',
    bonusPerLevel: '+10% multiplier to all weaponsmithing passive bonuses',
    maxLevel: 3,
    currentLevel: 0,
    requires: ['ws_legendary_forge', 'ws_void_tempering'],
    tier: 5,
    color: '#fbbf24',
    cost: { skillPoints: 5, credits: 12000 },
    unlocks: 'Grand Weapon blueprints — exclusive to Grandmaster Weaponsmiths',
  },
];

const TIERS = [TIER1, TIER2, TIER3, TIER4, TIER5];

export default function WeaponsmithingPage() {
  return (
    <SkillTreeLayout
      treeId="weaponsmithing"
      treeName="Weaponsmithing"
      treeIcon="ri-sword-line"
      treeColor={COLOR}
      treeDescription="Master the ancient and modern arts of weapon forging — from raw alloys to void-tempered legendary arms. Each upgrade permanently enhances your crafted weapons' damage, penetration, and special effects."
      tiers={TIERS}
      tierLabels={['Apprentice', 'Journeyman', 'Expert', 'Master', 'Grandmaster']}
      loreText="The finest blade is not made — it is revealed, layer by layer, in the crucible of experience."
    />
  );
}
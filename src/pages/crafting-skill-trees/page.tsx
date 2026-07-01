import { useNavigate } from 'react-router-dom';
import CraftingRankBanner from './components/CraftingRankBanner';
import CraftingRankUpToast from './components/CraftingRankUpToast';
import { useCraftingRank } from '@/hooks/useCraftingRank';

const TREES = [
  {
    id: 'weaponsmithing',
    path: '/crafting-skill-trees/weaponsmithing',
    name: 'Weaponsmithing',
    icon: 'ri-sword-line',
    color: '#f87171',
    description: 'Forge devastating weapons with enhanced damage, penetration, and legendary properties.',
    skills: 14,
    mastery: 0,
    highlights: ['+Weapon Damage', '+Critical Hit', 'Legendary Craft', 'Void Tempering'],
  },
  {
    id: 'armorsmithing',
    path: '/crafting-skill-trees/armorsmithing',
    name: 'Armorsmithing',
    icon: 'ri-shield-star-line',
    color: '#38bdf8',
    description: 'Craft impenetrable armor with unique defensive mechanics, stealth weave, and self-repair.',
    skills: 13,
    mastery: 0,
    highlights: ['+Defense Rating', 'Reactive Plates', 'Self-Repair', 'Celestial Plate'],
  },
  {
    id: 'engineering',
    path: '/crafting-skill-trees/engineering',
    name: 'Engineering',
    icon: 'ri-tools-line',
    color: '#4ade80',
    description: 'Build advanced ship modules, quantum drives, and singularity reactors.',
    skills: 15,
    mastery: 0,
    highlights: ['+Shield Recharge', 'Quantum Drives', 'Singularity Core', 'Omega Modules'],
  },
  {
    id: 'alchemy',
    path: '/crafting-skill-trees/alchemy',
    name: 'Alchemy',
    icon: 'ri-flask-line',
    color: '#a78bfa',
    description: 'Brew powerful consumables, transmute materials, and craft void elixirs.',
    skills: 15,
    mastery: 0,
    highlights: ['+Potion Potency', 'Transmutation', 'Void Elixirs', 'Philosopher\'s Brew'],
  },
  {
    id: 'nanotechnology',
    path: '/crafting-skill-trees/nanotechnology',
    name: 'Nanotechnology',
    icon: 'ri-microscope-line',
    color: '#34d399',
    description: 'Command nanites to repair, replicate, and construct at the molecular level.',
    skills: 16,
    mastery: 0,
    highlights: ['Nano Repair', 'Replicator', 'Assembler Grid', 'Omega Nanotech'],
  },
];

const TIER_INFO = [
  { tier: 1, label: 'Apprentice', color: '#9ca3af', desc: 'Basic techniques and material handling' },
  { tier: 2, label: 'Journeyman', color: '#4ade80', desc: 'Specialized materials and advanced methods' },
  { tier: 3, label: 'Expert', color: '#60a5fa', desc: 'Exotic processes and cross-discipline fusion' },
  { tier: 4, label: 'Master', color: '#c084fc', desc: 'Legendary recipes and unique unlock abilities' },
  { tier: 5, label: 'Grandmaster', color: '#fbbf24', desc: 'Pinnacle mastery — amplifies all bonuses' },
];

export default function CraftingSkillTreesPage() {
  const navigate = useNavigate();
  const { recentUnlock } = useCraftingRank();

  return (
    <div className="min-h-screen px-6 py-6">
      <CraftingRankUpToast title={recentUnlock} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)' }}
          >
            <i className="ri-git-branch-line text-xl" style={{ color: '#fbbf24' }}></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Crafting Skill Trees</h1>
            <p className="text-xs" style={{ color: '#6b7a95' }}>Upgrade passive bonuses across 5 disciplines · Global rank tracks your total SP spent</p>
          </div>
        </div>
      </div>

      {/* Global Crafting Rank Banner */}
      <CraftingRankBanner />

      {/* Tier explanation */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <h2 className="text-sm font-bold text-white mb-4">Skill Tree Structure</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TIER_INFO.map((t) => (
            <div
              key={t.tier}
              className="rounded-lg p-3"
              style={{
                background: `${t.color}08`,
                border: `1px solid ${t.color}25`,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: t.color }}></div>
                <span className="text-xs font-bold" style={{ color: t.color }}>Tier {t.tier}</span>
              </div>
              <p className="text-xs font-semibold text-white mb-0.5">{t.label}</p>
              <p className="text-xs" style={{ color: '#6b7a95' }}>{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4 leading-relaxed" style={{ color: '#4a5568' }}>
          Each tree has 5 tiers with prerequisite chains. Higher tiers require at least 1 level in prerequisite skills.
          Skill Points (SP) are earned through crafting milestones, quests, and leveling up. Each discipline is independent — invest freely.
        </p>
      </div>

      {/* Tree cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {TREES.map((tree) => (
          <div
            key={tree.id}
            onClick={() => navigate(tree.path)}
            className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group"
            style={{
              background: 'rgba(13,21,38,0.9)',
              border: `1px solid ${tree.color}30`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = `1px solid ${tree.color}70`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${tree.color}15`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.border = `1px solid ${tree.color}30`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            {/* Card header */}
            <div
              className="px-5 py-4 flex items-center gap-4"
              style={{ borderBottom: `1px solid ${tree.color}15`, background: `${tree.color}08` }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${tree.color}18`,
                  border: `2px solid ${tree.color}40`,
                  boxShadow: `0 0 12px ${tree.color}15`,
                }}
              >
                <i className={`${tree.icon} text-2xl`} style={{ color: tree.color }}></i>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-white">{tree.name}</h3>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${tree.color}15`, color: tree.color }}
                  >
                    {tree.skills} skills
                  </span>
                  <span className="text-xs" style={{ color: '#4a5568' }}>5 tiers · Apprentice → Grandmaster</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#8892aa' }}>{tree.description}</p>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tree.highlights.map((h) => (
                  <span
                    key={h}
                    className="text-xs px-2 py-0.5 rounded-md font-medium"
                    style={{
                      background: `${tree.color}10`,
                      color: `${tree.color}cc`,
                      border: `1px solid ${tree.color}25`,
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Mastery bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs" style={{ color: '#4a5568' }}>Mastery</span>
                  <span className="text-xs font-bold" style={{ color: tree.color }}>{tree.mastery}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${tree.mastery}%`,
                      background: `linear-gradient(90deg, ${tree.color}60, ${tree.color})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop: `1px solid ${tree.color}15` }}
            >
              <span className="text-xs" style={{ color: '#4a5568' }}>Click to open skill tree</span>
              <div
                className="flex items-center gap-1.5 text-xs font-bold transition-all group-hover:gap-2.5"
                style={{ color: tree.color }}
              >
                Open Tree
                <i className="ri-arrow-right-line text-sm"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div
        className="mt-8 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4"
        style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}
      >
        <i className="ri-information-line text-xl flex-shrink-0" style={{ color: '#fbbf24' }}></i>
        <div>
          <p className="text-sm font-semibold text-white mb-1">How to earn Skill Points</p>
          <p className="text-xs leading-relaxed" style={{ color: '#8892aa' }}>
            Skill Points are earned by completing crafting milestones (craft 10/50/100 items), finishing quests that
            reward SP, reaching crafting rank thresholds, and through special events. Each discipline uses the same
            SP pool — spend wisely across all 5 trees.
          </p>
        </div>
      </div>
    </div>
  );
}
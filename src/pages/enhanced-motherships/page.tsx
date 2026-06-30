import { useState } from 'react';
import { MOTHERSHIP_DATA } from '@/data/motherships';
import { Mothership } from '@/types/gameTypes';

const CLASS_GRADIENTS: Record<string, string> = {
  Carrier: 'from-cyan-500 to-blue-500',
  Command: 'from-purple-500 to-pink-500',
  Titan: 'from-orange-500 to-red-500',
  Leviathan: 'from-green-500 to-emerald-500',
  Eternal: 'from-yellow-400 to-amber-500',
};

const CLASS_COLORS: Record<string, string> = {
  Carrier: '#06b6d4',
  Command: '#a855f7',
  Titan: '#f97316',
  Leviathan: '#10b981',
  Eternal: '#f59e0b',
};

const RARITY_COLORS: Record<string, string> = {
  Legendary: '#f59e0b',
  Mythic: '#a855f7',
  Cosmic: '#ec4899',
  Universal: '#ef4444',
};

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString();
}

function formatTime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────
function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
        <span className="font-semibold text-white">{formatNum(value)}</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ─── Ship Card ────────────────────────────────────────────────────────────────
function ShipCard({
  ship,
  selected,
  onClick,
}: {
  ship: Mothership;
  selected: boolean;
  onClick: () => void;
}) {
  const color = CLASS_COLORS[ship.class] || '#00d4ff';
  const rarityColor = RARITY_COLORS[ship.rarity] || '#fff';
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-all cursor-pointer"
      style={{
        background: selected ? `${color}15` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? color : 'rgba(255,255,255,0.07)'}`,
        boxShadow: selected ? `0 0 20px ${color}25` : 'none',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-bold text-white text-sm">{ship.name}</div>
          <div className="text-xs mt-0.5" style={{ color }}>
            {ship.class} Class
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded text-xs font-bold"
          style={{ background: `${rarityColor}20`, color: rarityColor }}
        >
          {ship.rarity}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
        <span><i className="ri-sword-line mr-1" style={{ color: '#f87171' }}></i>{formatNum(ship.stats.attack)}</span>
        <span><i className="ri-shield-line mr-1" style={{ color: '#60a5fa' }}></i>{formatNum(ship.stats.defense)}</span>
        <span><i className="ri-heart-line mr-1" style={{ color: '#4ade80' }}></i>{formatNum(ship.stats.health)}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
        >
          Rank {ship.rank}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-xs"
          style={{ background: `${color}15`, color }}
        >
          Lv.{ship.level} / {ship.maxLevel}
        </span>
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EnhancedMothershipPage() {
  const [selectedId, setSelectedId] = useState<string>(MOTHERSHIP_DATA[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'weapons' | 'abilities' | 'build'>('overview');
  const [buildNotice, setBuildNotice] = useState('');

  const ship = MOTHERSHIP_DATA.find((m) => m.id === selectedId) ?? MOTHERSHIP_DATA[0];
  const color = CLASS_COLORS[ship.class] || '#00d4ff';
  const gradient = CLASS_GRADIENTS[ship.class] || 'from-cyan-500 to-blue-500';
  const rarityColor = RARITY_COLORS[ship.rarity] || '#fff';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'weapons', label: 'Combat', icon: 'ri-sword-line' },
    { id: 'abilities', label: 'Abilities', icon: 'ri-flashlight-line' },
    { id: 'build', label: 'Build Info', icon: 'ri-tools-line' },
  ] as const;

  const handleBuild = () => {
    setBuildNotice(`${ship.name} queued for construction! Build time: ${formatTime(ship.buildTime)}`);
    setTimeout(() => setBuildNotice(''), 4000);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #070c1a 0%, #0b0e1f 50%, #090d1b 100%)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,13,26,0.8)' }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
          >
            <i className="ri-ship-2-line text-xl" style={{ color: '#a855f7' }}></i>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wider">MOTHERSHIP COMMAND</h1>
            <p className="text-sm" style={{ color: 'rgba(168,85,247,0.7)' }}>
              Command the most powerful vessels in the universe
            </p>
          </div>
        </div>
      </div>

      {buildNotice && (
        <div
          className="mx-6 mt-4 px-4 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}
        >
          <i className="ri-checkbox-circle-line mr-2"></i>
          {buildNotice}
        </div>
      )}

      <div className="flex gap-0" style={{ height: 'calc(100vh - 160px)', minHeight: 600 }}>
        {/* ── Left: Ship List ─────────────────────────────────────────────────── */}
        <div
          className="w-72 flex-shrink-0 flex flex-col"
          style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,13,26,0.5)' }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Available Motherships ({MOTHERSHIP_DATA.length})
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168,85,247,0.2) transparent' }}>
            {MOTHERSHIP_DATA.map((m) => (
              <ShipCard
                key={m.id}
                ship={m}
                selected={selectedId === m.id}
                onClick={() => setSelectedId(m.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Right: Detail ───────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Ship hero */}
          <div
            className="px-6 py-5 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: `${color}08` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className={`text-3xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                    {ship.name}
                  </h2>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ background: `${rarityColor}20`, color: rarityColor, border: `1px solid ${rarityColor}40` }}
                  >
                    {ship.rarity}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ color }}>{ship.class} Class</span>
                  <span>•</span>
                  <span>Rank {ship.rank}</span>
                  <span>•</span>
                  <span>Max Level {ship.maxLevel}</span>
                  <span>•</span>
                  <span>{ship.crew.toLocaleString()} Crew</span>
                </div>
              </div>
              <button
                onClick={handleBuild}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all bg-gradient-to-r ${gradient} text-white hover:opacity-90 whitespace-nowrap`}
              >
                <i className="ri-hammer-line mr-2"></i>
                Build Mothership
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-6 gap-3 mt-4">
              {[
                { label: 'Attack', value: ship.stats.attack, icon: 'ri-sword-line', color: '#f87171' },
                { label: 'Defense', value: ship.stats.defense, icon: 'ri-shield-line', color: '#60a5fa' },
                { label: 'Health', value: ship.stats.health, icon: 'ri-heart-line', color: '#4ade80' },
                { label: 'Shield', value: ship.stats.shield, icon: 'ri-shield-flash-line', color: '#a78bfa' },
                { label: 'Hangar', value: ship.hangarCapacity, icon: 'ri-plane-line', color: '#fbbf24' },
                { label: 'Cmd Bonus', value: `+${ship.commandBonus}%`, icon: 'ri-command-line', color: '#f97316', isStr: true },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}
                >
                  <i className={`${s.icon} text-lg mb-1`} style={{ color: s.color }}></i>
                  <div className="text-sm font-black text-white">
                    {(s as { isStr?: boolean }).isStr ? s.value : formatNum(s.value as number)}
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 px-4 py-2 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
                style={{
                  background: activeTab === tab.id ? `${color}20` : 'transparent',
                  color: activeTab === tab.id ? color : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${activeTab === tab.id ? `${color}40` : 'transparent'}`,
                }}
              >
                <i className={`${tab.icon} mr-1.5`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168,85,247,0.2) transparent' }}>
            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-5">
                {/* Description */}
                <div
                  className="col-span-2 rounded-xl p-5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Description</div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{ship.description}</p>
                  <p className="text-xs leading-relaxed mt-3 italic" style={{ color: 'rgba(255,255,255,0.4)' }}>{ship.lore}</p>
                </div>

                {/* Hull & Shields */}
                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Hull &amp; Shields</div>
                  <div className="space-y-3">
                    <StatBar label="Health" value={ship.stats.health} max={ship.stats.maxHealth} color="#4ade80" />
                    <StatBar label="Shield" value={ship.stats.shield} max={ship.stats.maxShield} color="#60a5fa" />
                    <StatBar label="Energy" value={ship.stats.energy} max={ship.stats.maxEnergy} color="#fbbf24" />
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        { label: 'Armor', value: formatNum(ship.stats.armor) },
                        { label: 'Evasion', value: `${ship.stats.evasion}%` },
                        { label: 'Accuracy', value: `${ship.stats.accuracy}%` },
                        { label: 'Crit Chance', value: `${ship.stats.criticalChance}%` },
                        { label: 'HP Regen', value: `${formatNum(ship.stats.healthRegeneration)}/s` },
                        { label: 'Shield Regen', value: `${formatNum(ship.stats.shieldRegeneration)}/s` },
                      ].map((s) => (
                        <div key={s.label} className="flex justify-between text-xs">
                          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
                          <span className="font-semibold text-white">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fleet Bonuses */}
                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Fleet Bonuses</div>
                  <div className="space-y-3">
                    {[
                      { label: 'Command Bonus', value: `+${ship.commandBonus}%`, color: '#f97316' },
                      { label: 'Fleet Capacity', value: `+${ship.fleetCapacityBonus}`, color: '#4ade80' },
                      { label: 'Hangar Capacity', value: ship.hangarCapacity.toLocaleString(), color: '#fbbf24' },
                      { label: 'Crew', value: ship.crew.toLocaleString(), color: '#a78bfa' },
                      { label: 'Crit Damage', value: `${ship.stats.criticalDamage}%`, color: '#f87171' },
                      { label: 'Speed', value: formatNum(ship.stats.speed), color: '#60a5fa' },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                        <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Module Slots</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ship.modules).map(([key, val]) => (
                        <div
                          key={key}
                          className="rounded-lg px-3 py-2 flex justify-between items-center"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          <span className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.5)' }}>{key}</span>
                          <span className="text-sm font-bold" style={{ color }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Special Features */}
                <div
                  className="col-span-2 rounded-xl p-5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Special Features</div>
                  <div className="flex flex-wrap gap-2">
                    {ship.specialFeatures.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                      >
                        <i className="ri-star-line mr-1"></i>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── COMBAT ── */}
            {activeTab === 'weapons' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Attack Power', value: formatNum(ship.stats.attack), icon: 'ri-sword-line', color: '#f87171' },
                    { label: 'Defense Rating', value: formatNum(ship.stats.defense), icon: 'ri-shield-line', color: '#60a5fa' },
                    { label: 'Crit Chance', value: `${ship.stats.criticalChance}%`, icon: 'ri-focus-3-line', color: '#fbbf24' },
                    { label: 'Crit Damage', value: `${ship.stats.criticalDamage}%`, icon: 'ri-fire-line', color: '#f97316' },
                    { label: 'Accuracy', value: `${ship.stats.accuracy}%`, icon: 'ri-crosshair-line', color: '#4ade80' },
                    { label: 'Evasion', value: `${ship.stats.evasion}%`, icon: 'ri-run-line', color: '#a78bfa' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl p-4 text-center"
                      style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}
                    >
                      <i className={`${s.icon} text-2xl mb-2`} style={{ color: s.color }}></i>
                      <div className="text-xl font-black text-white">{s.value}</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Weapon Slots</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { slot: 'Primary Weapons', count: ship.modules.weapons, icon: 'ri-sword-fill', color: '#f87171' },
                      { slot: 'Shield Systems', count: ship.modules.shields, icon: 'ri-shield-flash-line', color: '#60a5fa' },
                      { slot: 'Engine Systems', count: ship.modules.engines, icon: 'ri-rocket-2-line', color: '#4ade80' },
                      { slot: 'Special Systems', count: ship.modules.special, icon: 'ri-flashlight-line', color: '#fbbf24' },
                    ].map((s) => (
                      <div
                        key={s.slot}
                        className="rounded-xl p-4 flex items-center gap-3"
                        style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${s.color}20` }}
                        >
                          <i className={`${s.icon} text-lg`} style={{ color: s.color }}></i>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{s.slot}</div>
                          <div className="text-xs" style={{ color: s.color }}>{s.count} slots</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Hangar Operations</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl p-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                      <div className="text-2xl font-black text-yellow-400">{ship.hangarCapacity.toLocaleString()}</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Fighter Capacity</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}>
                      <div className="text-2xl font-black text-blue-400">+{ship.commandBonus}%</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Command Bonus</div>
                    </div>
                    <div className="rounded-xl p-4" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                      <div className="text-2xl font-black text-green-400">+{ship.fleetCapacityBonus}</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Fleet Capacity</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ABILITIES ── */}
            {activeTab === 'abilities' && (
              <div className="space-y-3">
                {ship.abilities.map((ability, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl p-5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}25` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${color}20` }}
                        >
                          <i className="ri-flashlight-line text-lg" style={{ color }}></i>
                        </div>
                        <div>
                          <div className="font-bold text-white">{ability.name}</div>
                          {ability.cooldown && (
                            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                              <i className="ri-time-line mr-1"></i>
                              Cooldown: {ability.cooldown}s
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                      >
                        Active
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {ability.description}
                    </p>
                    <div
                      className="rounded-lg px-3 py-2 text-xs font-semibold"
                      style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}
                    >
                      <i className="ri-star-line mr-1.5"></i>
                      Effect: {ability.effect}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── BUILD INFO ── */}
            {activeTab === 'build' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Build Cost */}
                  <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Build Cost</div>
                    <div className="space-y-3">
                      {[
                        { label: 'Metal', value: ship.buildCost.metal, color: '#fcd34d', icon: 'ri-copper-coin-line' },
                        { label: 'Crystal', value: ship.buildCost.crystal, color: '#60a5fa', icon: 'ri-drop-line' },
                        { label: 'Deuterium', value: ship.buildCost.deuterium, color: '#4ade80', icon: 'ri-drop-line' },
                        { label: 'Dark Matter', value: ship.buildCost.darkMatter || 0, color: '#c084fc', icon: 'ri-focus-2-line' },
                      ].map((r) => (
                        <div key={r.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: r.color }}>{formatNum(r.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Maintenance Cost */}
                  <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Maintenance / Hour</div>
                    <div className="space-y-3">
                      {[
                        { label: 'Metal', value: ship.maintenanceCost.metal, color: '#fcd34d', icon: 'ri-copper-coin-line' },
                        { label: 'Crystal', value: ship.maintenanceCost.crystal, color: '#60a5fa', icon: 'ri-drop-line' },
                        { label: 'Deuterium', value: ship.maintenanceCost.deuterium, color: '#4ade80', icon: 'ri-drop-line' },
                        { label: 'Dark Matter', value: ship.maintenanceCost.darkMatter || 0, color: '#c084fc', icon: 'ri-focus-2-line' },
                      ].map((r) => (
                        <div key={r.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: r.color }}>{formatNum(r.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Build Time */}
                <div
                  className="rounded-xl p-5 text-center"
                  style={{ background: `${color}08`, border: `1px solid ${color}25` }}
                >
                  <i className="ri-time-line text-3xl mb-2" style={{ color }}></i>
                  <div className="text-3xl font-black text-white mb-1">{formatTime(ship.buildTime)}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Construction Time</div>
                </div>

                {/* Build button */}
                <button
                  onClick={handleBuild}
                  className={`w-full py-4 rounded-xl font-black text-lg cursor-pointer transition-all bg-gradient-to-r ${gradient} text-white hover:opacity-90`}
                >
                  <i className="ri-hammer-line mr-2"></i>
                  Construct {ship.name}
                </button>

                <div className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Connect to Supabase to save construction progress and manage your fleet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

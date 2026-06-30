import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NPC_RACES } from '@/data/npcRaces';
import { ENEMY_RACES } from '@/data/enemyRaces';
import { FRIENDLY_RACES } from '@/data/friendlyRaces';
import { RACES, getRaceById, type RaceDefinition, type RaceId } from '@/data/playerRaces';
import { useAuth } from '@/contexts/AuthContext';
import CompareTraitsModal from '@/components/feature/CompareTraitsModal';
import type { NPCRace, EnemyRace, FriendlyRace } from '@/types/gameTypes';
import {
  RACE_CLASS_LETTER_NAMES, RACE_CLASS_COLORS, RACE_CLASS_DESCRIPTIONS,
  RACE_CATEGORIES, RACE_SUB_CATEGORIES,
} from '@/types/gameTypes';

type RaceTab = 'playable' | 'npc' | 'enemy' | 'friendly';

type SelectedRace = (NPCRace & { raceType: 'npc' }) | (EnemyRace & { raceType: 'enemy' }) | (FriendlyRace & { raceType: 'friendly' }) | null;

const getRaceName = (race: NPCRace | EnemyRace | FriendlyRace): string => race.name;
const getRaceClassLetter = (race: NPCRace | EnemyRace | FriendlyRace): string => 'raceClass' in race ? String(race.raceClass) : 'T';
const getRaceCategory = (race: NPCRace | EnemyRace | FriendlyRace): string => race.category;

export default function RacesExplorerPage() {
  const { profile } = useAuth();
  const playerRaceId = (profile?.race as RaceId) || 'terran';
  const [activeTab, setActiveTab] = useState<RaceTab>('playable');
  const [selectedRace, setSelectedRace] = useState<SelectedRace>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterClass, setFilterClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [viewTraitsRaceId, setViewTraitsRaceId] = useState<RaceId | null>(null);
  const [expandedRaceId, setExpandedRaceId] = useState<RaceId | null>(null);

  const currentRaces = useMemo(() => {
    let races: (NPCRace | EnemyRace | FriendlyRace)[] = [];
    if (activeTab === 'npc') races = NPC_RACES;
    else if (activeTab === 'enemy') races = ENEMY_RACES;
    else races = FRIENDLY_RACES;

    if (filterCategory !== 'All') {
      races = races.filter(r => getRaceCategory(r) === filterCategory);
    }
    if (filterClass !== 'All') {
      races = races.filter(r => getRaceClassLetter(r) === filterClass);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      races = races.filter(r =>
        getRaceName(r).toLowerCase().includes(q) ||
        getRaceCategory(r).toLowerCase().includes(q) ||
        ('description' in r && r.description.toLowerCase().includes(q))
      );
    }
    return races;
  }, [activeTab, filterCategory, filterClass, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const base = activeTab === 'npc' ? NPC_RACES : activeTab === 'enemy' ? ENEMY_RACES : FRIENDLY_RACES;
    base.forEach(r => {
      const cat = getRaceCategory(r);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [activeTab]);

  const tabConfig = {
    playable: { label: 'Playable Races', icon: 'ri-user-star-line', color: '#A78BFA', count: RACES.length },
    npc: { label: 'NPC Races', icon: 'ri-user-voice-line', color: '#FFD700', count: NPC_RACES.length },
    enemy: { label: 'Enemy Races', icon: 'ri-sword-line', color: '#EF4444', count: ENEMY_RACES.length },
    friendly: { label: 'Friendly Races', icon: 'ri-hand-heart-line', color: '#4ADE80', count: FRIENDLY_RACES.length },
  };

  const statBar = (value: number, max: number, color: string) => (
    <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }}></div>
    </div>
  );

  const openDetail = (race: NPCRace | EnemyRace | FriendlyRace, type: RaceTab) => {
    setSelectedRace({ ...race, raceType: type } as SelectedRace);
  };

  return (
    <div className="min-h-screen bg-[#08080F]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0D0D1A] to-[#08080F] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-[#D4A017]/60 hover:text-[#D4A017] transition-colors">
              <i className="ri-arrow-left-line text-lg"></i>
            </Link>
            <h1 className="text-3xl md:text-4xl font-heading text-[#E8E0D5]">Galactic Race Registry</h1>
          </div>
          <p className="text-[#E8E0D5]/50 text-sm md:text-base max-w-2xl">
            Comprehensive catalog of all known sentient species — {NPC_RACES.length} NPC Races, {ENEMY_RACES.length} Enemy Races, and {FRIENDLY_RACES.length} Friendly Races across {RACE_CATEGORIES.length} biological categories and A-Z classification.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Races', value: NPC_RACES.length + ENEMY_RACES.length + FRIENDLY_RACES.length, icon: 'ri-group-line' },
            { label: 'NPC Races', value: NPC_RACES.length, icon: 'ri-user-voice-line', color: '#FFD700' },
            { label: 'Enemy Races', value: ENEMY_RACES.length, icon: 'ri-sword-line', color: '#EF4444' },
            { label: 'Friendly Races', value: FRIENDLY_RACES.length, icon: 'ri-hand-heart-line', color: '#4ADE80' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-center">
              <div className="text-xl font-heading" style={{ color: stat.color || '#D4A017' }}>{stat.value}</div>
              <div className="text-[#E8E0D5]/40 text-xs mt-0.5 flex items-center justify-center gap-1">
                <i className={stat.icon}></i>{stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex bg-white/[0.02] border border-white/[0.06] rounded-full p-1 mb-6">
          {(Object.entries(tabConfig) as [RaceTab, typeof tabConfig['npc']][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setFilterCategory('All'); setFilterClass('All'); setSearchQuery(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm transition-all whitespace-nowrap ${
                activeTab === key ? 'bg-[#D4A017]/10 text-[#D4A017]' : 'text-[#E8E0D5]/40 hover:text-[#E8E0D5]/70'
              }`}
            >
              <i className={config.icon}></i>
              {config.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.05]">{config.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#E8E0D5]/30 text-sm"></i>
            <input
              type="text"
              placeholder="Search races..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-[#E8E0D5] placeholder-[#E8E0D5]/30 focus:outline-none focus:border-[#D4A017]/30 transition-colors"
            />
          </div>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCategory('All')}
              className={`text-[10px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${filterCategory === 'All' ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'bg-white/[0.03] text-[#E8E0D5]/40 hover:text-[#E8E0D5]/70'}`}
            >
              All Categories
            </button>
            {Object.entries(categoryCounts).sort(([, a], [, b]) => b - a).slice(0, 12).map(([cat, count]) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-[10px] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${filterCategory === cat ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'bg-white/[0.03] text-[#E8E0D5]/40 hover:text-[#E8E0D5]/70'}`}
              >
                {cat} ({count})
              </button>
            ))}
          </div>
        </div>
        {/* Class Filter */}
        <div className="flex flex-wrap gap-1 mt-3">
          <button
            onClick={() => setFilterClass('All')}
            className={`text-[10px] px-2 py-1 rounded transition-colors ${filterClass === 'All' ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'bg-white/[0.02] text-[#E8E0D5]/30 hover:text-[#E8E0D5]/60'}`}
          >
            All Classes
          </button>
          {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter) => {
            const clsLetter = letter as import('@/types/gameTypes').RaceClassLetter;
            const hasRaces = currentRaces.some(r => getRaceClassLetter(r) === letter);
            if (!hasRaces && filterClass !== letter) return null;
            return (
              <button
                key={letter}
                onClick={() => setFilterClass(letter)}
                className={`text-[10px] w-7 h-7 rounded flex items-center justify-center font-bold transition-colors ${
                  filterClass === letter ? 'bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/30' : hasRaces ? 'bg-white/[0.02] text-[#E8E0D5]/40 hover:text-[#E8E0D5]/70' : 'bg-white/[0.01] text-[#E8E0D5]/10'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/*  PLAYABLE RACES TAB                        */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'playable' && (
        <>
          {/* Action Bar */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-[#E8E0D5]/40 text-xs">
                9 playable species — each with unique bonuses, traits, and starting advantages
              </p>
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-4 py-2 bg-purple-500/10 border border-purple-400/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all whitespace-nowrap cursor-pointer text-sm font-semibold"
              >
                <i className="ri-scales-line mr-1.5" />
                Compare Races
              </button>
            </div>
          </div>

          {/* Comparison Grid Header */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 mb-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="grid grid-cols-[180px_repeat(9,1fr)] text-[10px]">
                {/* Header row */}
                <div className="bg-white/[0.04] p-3 font-bold text-[#E8E0D5]/60 uppercase tracking-wider text-[9px]">
                  Attribute
                </div>
                {RACES.map((r) => {
                  const isPlayer = r.id === playerRaceId;
                  return (
                    <div key={r.id} className={`bg-white/[0.04] p-3 text-center ${isPlayer ? 'border-b-2 border-purple-400' : ''}`}>
                      <div className={`w-6 h-6 mx-auto mb-1 bg-gradient-to-br ${r.color} rounded-md flex items-center justify-center`}>
                        <i className={`${r.icon} text-[10px] text-white`} />
                      </div>
                      <p className="text-[#E8E0D5] font-heading text-[10px] leading-tight truncate">{r.name}</p>
                      {isPlayer && <p className="text-[8px] text-purple-400 mt-0.5">YOU</p>}
                    </div>
                  );
                })}
              </div>

              {/* Comparison rows */}
              {[
                { label: 'Category', key: 'category' as const, render: (r: RaceDefinition) => r.category, className: 'text-[#E8E0D5]/40' },
                {
                  label: 'Lifespan',
                  key: 'lifespan' as const,
                  render: (r: RaceDefinition) => `${r.lifespan >= 500 ? '∞' : ''}${r.lifespan}y`,
                  className: 'text-[#E8E0D5]/50',
                },
                {
                  label: 'Reproduction',
                  key: 'reproductionRate' as const,
                  render: (r: RaceDefinition) => `${r.reproductionRate.toFixed(1)}x`,
                  className: 'text-[#E8E0D5]/50',
                },
                {
                  label: 'Adaptability',
                  key: 'adaptability' as const,
                  render: (r: RaceDefinition) => (
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-slate-700/60 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" style={{ width: `${r.adaptability}%` }} />
                      </div>
                      <span className="text-[#E8E0D5]/50 w-8 text-right">{r.adaptability}%</span>
                    </div>
                  ),
                  className: '',
                },
              ].map((row) => (
                <div key={row.label} className="grid grid-cols-[180px_repeat(9,1fr)] border-t border-white/[0.04] text-[10px]">
                  <div className="bg-white/[0.02] p-2.5 text-[#E8E0D5]/30 font-semibold">{row.label}</div>
                  {RACES.map((r) => (
                    <div key={r.id} className="p-2.5 text-center flex items-center justify-center">
                      <span className={row.className}>{row.render(r)}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* RPG Traits */}
              {(Object.keys({
                strength: 'STR', intelligence: 'INT', agility: 'AGI',
                endurance: 'END', charisma: 'CHA', perception: 'PER',
              }) as string[]).map((traitKey) => (
                <div key={traitKey} className="grid grid-cols-[180px_repeat(9,1fr)] border-t border-white/[0.04] text-[10px]">
                  <div className="bg-white/[0.02] p-2.5 text-[#E8E0D5]/30 font-semibold">
                    {traitKey.charAt(0).toUpperCase() + traitKey.slice(1)}
                  </div>
                  {RACES.map((r) => {
                    const val = r.traits[traitKey as keyof typeof r.traits];
                    const high = val >= 75;
                    const low = val <= 35;
                    return (
                      <div key={r.id} className="p-2.5 text-center">
                        <span className={`text-[10px] font-mono font-bold ${
                          high ? 'text-emerald-400' : low ? 'text-red-400/70' : 'text-[#E8E0D5]/50'
                        }`}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Race Cards with Lore Deep-Dives */}
          <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
            <h3 className="text-xs uppercase tracking-widest text-[#E8E0D5]/30 font-bold mb-4">
              Species Lore &amp; Deep-Dive
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RACES.map((race) => {
                const isPlayer = race.id === playerRaceId;
                const isExpanded = expandedRaceId === race.id;
                return (
                  <div
                    key={race.id}
                    className={`bg-white/[0.02] border rounded-xl overflow-hidden transition-all ${
                      isPlayer ? 'border-purple-400/40' : 'border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => setExpandedRaceId(isExpanded ? null : race.id)}
                      className="w-full text-left p-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${race.color} rounded-xl flex items-center justify-center shrink-0`}>
                          <i className={`${race.icon} text-lg text-white`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-heading text-[#E8E0D5] truncate">{race.name}</h4>
                            {isPlayer && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-400/15 text-purple-400 shrink-0">YOU</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#E8E0D5]/30">{race.category}</span>
                            <span className="text-[#E8E0D5]/10">•</span>
                            <span className="text-[10px] text-[#E8E0D5]/30">{race.homeworldType}</span>
                          </div>
                        </div>
                        <i className={isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
                      </div>
                      {/* Preview: bonus */}
                      <div className={`mt-3 bg-gradient-to-r ${race.bgAccent} border ${race.borderAccent} rounded-lg px-3 py-2`}>
                        <p className={`text-[10px] font-semibold text-${race.accent}-400`}>{race.bonus}</p>
                        <p className={`text-[9px] text-${race.accent}-300/70 mt-0.5 line-clamp-1`}>{race.bonusDetails}</p>
                      </div>
                    </button>

                    {/* Expanded Lore Deep-Dive */}
                    {isExpanded && (
                      <div className="border-t border-white/[0.06] p-4 space-y-4">
                        {/* Lore */}
                        <div className="bg-white/[0.03] rounded-lg p-3">
                          <p className="text-[11px] text-[#E8E0D5]/40 italic leading-relaxed">
                            &ldquo;{race.lore}&rdquo;
                          </p>
                        </div>

                        {/* RPG Traits mini-bars */}
                        <div className="space-y-1.5">
                          {[
                            { key: 'strength', label: 'STR', colors: 'from-red-600 to-red-400' },
                            { key: 'intelligence', label: 'INT', colors: 'from-cyan-500 to-cyan-300' },
                            { key: 'agility', label: 'AGI', colors: 'from-emerald-500 to-emerald-300' },
                            { key: 'endurance', label: 'END', colors: 'from-orange-500 to-orange-300' },
                            { key: 'charisma', label: 'CHA', colors: 'from-pink-500 to-pink-300' },
                            { key: 'perception', label: 'PER', colors: 'from-yellow-500 to-yellow-300' },
                          ].map((t) => {
                            const val = race.traits[t.key as keyof typeof race.traits];
                            return (
                              <div key={t.key} className="flex items-center gap-2">
                                <span className="text-[9px] text-[#E8E0D5]/20 w-7 text-right">{t.label}</span>
                                <div className="flex-1 h-1 bg-slate-700/60 rounded-full overflow-hidden">
                                  <div className={`h-full bg-gradient-to-r ${t.colors} rounded-full`} style={{ width: `${val}%` }} />
                                </div>
                                <span className="text-[10px] text-[#E8E0D5]/50 font-mono w-6 text-right">{val}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Starting trait */}
                        <div className="bg-amber-400/5 border border-amber-400/15 rounded-lg p-3">
                          <p className="text-[9px] text-amber-400/60 uppercase tracking-wider font-semibold mb-0.5">Starting Trait</p>
                          <p className="text-[11px] text-amber-200/70 leading-relaxed">{race.specialStartingTrait}</p>
                        </div>

                        {/* Resource modifiers */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center bg-white/[0.03] rounded-lg py-1.5">
                            <p className="text-[8px] text-[#E8E0D5]/20">Metal</p>
                            <p className={`text-[11px] font-bold ${race.metalBonus >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {race.metalBonus > 0 ? '+' : ''}{race.metalBonus}
                            </p>
                          </div>
                          <div className="text-center bg-white/[0.03] rounded-lg py-1.5">
                            <p className="text-[8px] text-[#E8E0D5]/20">Crystal</p>
                            <p className={`text-[11px] font-bold ${race.crystalBonus >= 0 ? 'text-teal-400' : 'text-red-400'}`}>
                              {race.crystalBonus > 0 ? '+' : ''}{race.crystalBonus}
                            </p>
                          </div>
                          <div className="text-center bg-white/[0.03] rounded-lg py-1.5">
                            <p className="text-[8px] text-[#E8E0D5]/20">Deuterium</p>
                            <p className={`text-[11px] font-bold ${race.deuteriumBonus >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                              {race.deuteriumBonus > 0 ? '+' : ''}{race.deuteriumBonus}
                            </p>
                          </div>
                        </div>

                        {/* View Traits button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewTraitsRaceId(race.id);
                            setShowCompareModal(true);
                          }}
                          className="w-full px-4 py-2.5 bg-purple-500/10 border border-purple-400/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-all whitespace-nowrap cursor-pointer text-xs font-semibold"
                        >
                          <i className="ri-eye-line mr-1.5" />
                          View Full Traits &amp; Compare
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/*  NPC / ENEMY / FRIENDLY RACE CARDS        */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab !== 'playable' && (
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[#E8E0D5]/30 text-xs">{currentRaces.length} race{currentRaces.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {currentRaces.map((race) => {
            const classLetter = getRaceClassLetter(race);
            const classColor = RACE_CLASS_COLORS[classLetter as keyof typeof RACE_CLASS_COLORS] || '#888';
            const name = getRaceName(race);
            const cat = getRaceCategory(race);
            const isEnemy = activeTab === 'enemy';
            const isFriendly = activeTab === 'friendly';
            const borderColor = isEnemy ? 'hover:border-red-500/20' : isFriendly ? 'hover:border-green-500/20' : 'hover:border-[#D4A017]/20';

            return (
              <button
                key={race.id}
                onClick={() => openDetail(race, activeTab)}
                className={`text-left bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.05] transition-all group cursor-pointer w-full ${borderColor}`}
              >
                {/* Header: Class badge + name */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: `${classColor}20`, color: classColor }}
                  >
                    {classLetter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-heading text-[#E8E0D5] group-hover:text-[#D4A017] transition-colors truncate">{name}</h3>
                    <span className="text-[10px] text-[#E8E0D5]/40">{RACE_CLASS_LETTER_NAMES[classLetter as keyof typeof RACE_CLASS_LETTER_NAMES]}</span>
                  </div>
                </div>
                {/* Category + SubClass tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/40">{cat}</span>
                  {('subClass' in race && race.subClass) && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-[#E8E0D5]/30 truncate max-w-[120px]">{race.subClass}</span>
                  )}
                  {isEnemy && 'threatRating' in race && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${(race as EnemyRace).threatRating === 'Apocalyptic' ? 'bg-red-500/10 text-red-400' : 'bg-white/[0.04] text-[#E8E0D5]/40'}`}>
                      {(race as EnemyRace).threatRating}
                    </span>
                  )}
                  {isFriendly && 'allianceType' in race && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400/60">{(race as FriendlyRace).allianceType}</span>
                  )}
                </div>
                {/* Stat Bars */}
                <div className="space-y-1.5">
                  {isEnemy ? (
                    <>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#E8E0D5]/30">Aggression</span>
                        <span className="text-red-400/60">{(race as EnemyRace).aggressionLevel}/10</span>
                      </div>
                      {statBar((race as EnemyRace).aggressionLevel, 10, '#EF4444')}
                      <div className="flex items-center justify-between text-[10px] mt-1">
                        <span className="text-[#E8E0D5]/30">Military</span>
                        <span className="text-red-400/60">{(race as EnemyRace).militaryPower}/10</span>
                      </div>
                      {statBar((race as EnemyRace).militaryPower, 10, '#F97316')}
                    </>
                  ) : isFriendly ? (
                    <>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#E8E0D5]/30">Diplomacy</span>
                        <span className="text-green-400/60">{(race as FriendlyRace).diplomacyLevel}/10</span>
                      </div>
                      {statBar((race as FriendlyRace).diplomacyLevel, 10, '#4ADE80')}
                      <div className="flex items-center justify-between text-[10px] mt-1">
                        <span className="text-[#E8E0D5]/30">Technology</span>
                        <span className="text-cyan-400/60">{(race as FriendlyRace).technologyLevel}/10</span>
                      </div>
                      {statBar((race as FriendlyRace).technologyLevel, 10, '#06B6D4')}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#E8E0D5]/30">Diplomacy</span>
                        <span className="text-[#D4A017]/60">{(race as NPCRace).diplomacyLevel}/10</span>
                      </div>
                      {statBar((race as NPCRace).diplomacyLevel, 10, '#D4A017')}
                      <div className="flex items-center justify-between text-[10px] mt-1">
                        <span className="text-[#E8E0D5]/30">Economy</span>
                        <span className="text-amber-400/60">{(race as NPCRace).economyStrength}/10</span>
                      </div>
                      {statBar((race as NPCRace).economyStrength, 10, '#F59E0B')}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {currentRaces.length === 0 && (
          <div className="text-center py-20">
            <i className="ri-search-line text-4xl text-[#E8E0D5]/10 mb-3 block"></i>
            <p className="text-[#E8E0D5]/30 text-sm">No races match your filters</p>
            <button
              onClick={() => { setFilterCategory('All'); setFilterClass('All'); setSearchQuery(''); }}
              className="mt-3 text-xs text-[#D4A017]/60 hover:text-[#D4A017] transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      )}

      {/* Compare Traits Modal */}
      {showCompareModal && (
        <CompareTraitsModal
          onClose={() => { setShowCompareModal(false); setViewTraitsRaceId(null); }}
          initialRaceId={viewTraitsRaceId || undefined}
        />
      )}

      {/* Detail Modal */}
      {selectedRace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRace(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedRace(null)}></div>
          <div
            className="relative bg-[#0D0D1A] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedRace(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#E8E0D5]/40 hover:text-[#E8E0D5] hover:bg-white/[0.1] transition-colors"
            >
              <i className="ri-close-line"></i>
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0"
                style={{ background: `${RACE_CLASS_COLORS[selectedRace.raceClass as keyof typeof RACE_CLASS_COLORS] || '#888'}15`, color: RACE_CLASS_COLORS[selectedRace.raceClass as keyof typeof RACE_CLASS_COLORS] || '#888' }}
              >
                {selectedRace.raceClass}
              </div>
              <div>
                <h2 className="text-2xl font-heading text-[#E8E0D5]">{selectedRace.name}</h2>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-[#E8E0D5]/50">
                    {RACE_CLASS_LETTER_NAMES[selectedRace.raceClass as keyof typeof RACE_CLASS_LETTER_NAMES]}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-[#E8E0D5]/50">{selectedRace.category}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-[#E8E0D5]/50">{selectedRace.subCategory}</span>
                  {selectedRace.subClass && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-[#E8E0D5]/40">{selectedRace.subClass}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description + Lore */}
            <div className="mb-5">
              <p className="text-[#E8E0D5]/60 text-sm mb-3">{selectedRace.description}</p>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4">
                <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-1">Lore</h4>
                <p className="text-[#E8E0D5]/40 text-xs leading-relaxed">{selectedRace.lore}</p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {('aggressionLevel' in selectedRace) && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                  <div className="text-[10px] text-[#E8E0D5]/30 mb-1">Aggression</div>
                  <div className="text-sm font-bold text-[#E8E0D5]">{selectedRace.aggressionLevel}/10</div>
                  {statBar(selectedRace.aggressionLevel, 10, '#EF4444')}
                </div>
              )}
              {('diplomacyLevel' in selectedRace) && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                  <div className="text-[10px] text-[#E8E0D5]/30 mb-1">Diplomacy</div>
                  <div className="text-sm font-bold text-[#E8E0D5]">{selectedRace.diplomacyLevel}/10</div>
                  {statBar(selectedRace.diplomacyLevel, 10, '#4ADE80')}
                </div>
              )}
              {('technologyLevel' in selectedRace) && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                  <div className="text-[10px] text-[#E8E0D5]/30 mb-1">Technology</div>
                  <div className="text-sm font-bold text-[#E8E0D5]">{selectedRace.technologyLevel}/10</div>
                  {statBar(selectedRace.technologyLevel, 10, '#06B6D4')}
                </div>
              )}
              {('militaryPower' in selectedRace) && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                  <div className="text-[10px] text-[#E8E0D5]/30 mb-1">Military</div>
                  <div className="text-sm font-bold text-[#E8E0D5]">{selectedRace.militaryPower}/10</div>
                  {statBar(selectedRace.militaryPower, 10, '#F97316')}
                </div>
              )}
              {('economyStrength' in selectedRace) && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                  <div className="text-[10px] text-[#E8E0D5]/30 mb-1">Economy</div>
                  <div className="text-sm font-bold text-[#E8E0D5]">{selectedRace.economyStrength}/10</div>
                  {statBar(selectedRace.economyStrength, 10, '#F59E0B')}
                </div>
              )}
              {('populationGrowth' in selectedRace) && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                  <div className="text-[10px] text-[#E8E0D5]/30 mb-1">Pop. Growth</div>
                  <div className="text-sm font-bold text-[#E8E0D5]">{selectedRace.populationGrowth}/10</div>
                  {statBar(selectedRace.populationGrowth, 10, '#EC4899')}
                </div>
              )}
              {('intelligenceLevel' in selectedRace) && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
                  <div className="text-[10px] text-[#E8E0D5]/30 mb-1">Intelligence</div>
                  <div className="text-sm font-bold text-[#E8E0D5]">{selectedRace.intelligenceLevel}/10</div>
                  {statBar(selectedRace.intelligenceLevel, 10, '#A78BFA')}
                </div>
              )}
            </div>

            {/* Extra info fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Vital Statistics</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Homeworld</span><span className="text-[#E8E0D5]/50">{selectedRace.homeworldName}</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Homeworld Class</span><span className="text-[#E8E0D5]/50">{selectedRace.homeworldClass}</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Habitat</span><span className="text-[#E8E0D5]/50">{selectedRace.habitatPreference}</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Lifespan</span><span className="text-[#E8E0D5]/50">{selectedRace.lifespanYears.toLocaleString()} years</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Avg. Height</span><span className="text-[#E8E0D5]/50">{selectedRace.averageHeightCm} cm</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Controlled Systems</span><span className="text-[#E8E0D5]/50">{selectedRace.controlledSystems.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Population</span><span className="text-[#E8E0D5]/50">{selectedRace.totalPopulation.toLocaleString()}</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Classification</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Threat Rating</span><span className={selectedRace.threatRating === 'Apocalyptic' ? 'text-red-400' : 'text-[#E8E0D5]/50'}>{selectedRace.threatRating}</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Diplomatic Stance</span><span className="text-[#E8E0D5]/50">{selectedRace.diplomaticStance}</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Rank</span><span className="text-[#E8E0D5]/50">{selectedRace.rank}</span></div>
                  <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Rarity</span><span className="text-[#E8E0D5]/50">{selectedRace.rarity}</span></div>
                  {'governmentType' in selectedRace && (
                    <>
                      <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Government</span><span className="text-[#E8E0D5]/50">{selectedRace.governmentType}</span></div>
                      <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Economy</span><span className="text-[#E8E0D5]/50">{selectedRace.economyType}</span></div>
                    </>
                  )}
                  {'factionType' in selectedRace && (
                    <>
                      <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Faction Type</span><span className="text-[#E8E0D5]/50">{selectedRace.factionType}</span></div>
                      <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Diplomacy Possible</span><span className={selectedRace.isDiplomacyPossible ? 'text-green-400/60' : 'text-red-400/60'}>{selectedRace.isDiplomacyPossible ? 'Yes' : 'No'}</span></div>
                    </>
                  )}
                  {'allianceType' in selectedRace && (
                    <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Alliance Type</span><span className="text-[#E8E0D5]/50">{selectedRace.allianceType}</span></div>
                  )}
                  {'tradeWillingness' in selectedRace && (
                    <div className="flex justify-between"><span className="text-[#E8E0D5]/30">Trade Willingness</span><span className="text-[#E8E0D5]/50">{selectedRace.tradeWillingness}/10</span></div>
                  )}
                </div>
              </div>
            </div>

            {/* Traits & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Traits</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRace.traits.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A017]/10 text-[#D4A017]/70">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Weaknesses</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRace.weaknesses.map((w) => (
                    <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400/60">{w}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Special Abilities */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Special Abilities</h4>
              <div className="flex flex-wrap gap-1">
                {selectedRace.specialAbilities.map((a) => (
                  <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400/60">{a}</span>
                ))}
              </div>
            </div>

            {/* Enemies / Alliances */}
            {'enemies' in selectedRace && selectedRace.enemies.length > 0 && (
              <div className="mb-5">
                <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Enemies</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRace.enemies.map((e) => (
                    <span key={e} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400/60">{e}</span>
                  ))}
                </div>
              </div>
            )}
            {'alliances' in selectedRace && selectedRace.alliances.length > 0 && (
              <div className="mb-5">
                <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Alliances</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRace.alliances.map((a) => (
                    <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400/60">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Description */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Visual Description</h4>
              <p className="text-[#E8E0D5]/40 text-xs leading-relaxed">{selectedRace.visualDescription}</p>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-xs font-bold text-[#E8E0D5]/40 uppercase tracking-wider mb-2">Additional Information</h4>
              <p className="text-[#E8E0D5]/40 text-xs leading-relaxed">{selectedRace.info}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
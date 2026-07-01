import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getColonyArt } from '@/data/gameArtwork';
import { RACES, getRaceById, type RaceDefinition, type RaceId } from '@/data/playerRaces';
import { useAuth } from '@/contexts/AuthContext';
import RaceChangeModal from '@/components/feature/RaceChangeModal';

interface Colony {
  id: string;
  name: string;
  type: 'planet' | 'moon' | 'asteroid' | 'space-station';
  coordinates: string;
  population: number;
  development: number;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  buildings: number;
  defense: number;
  status: 'thriving' | 'developing' | 'struggling' | 'abandoned';
}

interface Government {
  id: string;
  name: string;
  type: string;
  class: string;
  tier: number;
  description: string;
  bonuses: {
    production: number;
    research: number;
    military: number;
    diplomacy: number;
    expansion: number;
    stability: number;
  };
  penalties: {
    production?: number;
    research?: number;
    military?: number;
    diplomacy?: number;
    expansion?: number;
    stability?: number;
  };
  requirements: {
    planets: number;
    population: number;
    technology: number;
  };
  specialAbilities: string[];
  unlocked: boolean;
}

/* ── Trait bar colors ─────────────── */
const traitColorMap: Record<string, { bar: string; text: string; bg: string }> = {
  strength: { bar: 'bg-gradient-to-r from-red-600 to-red-400', text: 'text-red-400', bg: 'bg-red-400/15' },
  intelligence: { bar: 'bg-gradient-to-r from-cyan-500 to-cyan-300', text: 'text-cyan-400', bg: 'bg-cyan-400/15' },
  agility: { bar: 'bg-gradient-to-r from-emerald-500 to-emerald-300', text: 'text-emerald-400', bg: 'bg-emerald-400/15' },
  endurance: { bar: 'bg-gradient-to-r from-orange-500 to-orange-300', text: 'text-orange-400', bg: 'bg-orange-400/15' },
  charisma: { bar: 'bg-gradient-to-r from-pink-500 to-pink-300', text: 'text-pink-400', bg: 'bg-pink-400/15' },
  perception: { bar: 'bg-gradient-to-r from-yellow-500 to-yellow-300', text: 'text-yellow-400', bg: 'bg-yellow-400/15' },
};

const bonusColorMap: Record<string, { icon: string; color: string; label: string; hex: string }> = {
  mining: { icon: 'ri-hammer-line', color: 'text-yellow-400', label: 'Mining', hex: '#e2c044' },
  research: { icon: 'ri-flask-line', color: 'text-cyan-400', label: 'Research', hex: '#a78bfa' },
  combat: { icon: 'ri-sword-line', color: 'text-red-400', label: 'Combat', hex: '#f87171' },
  construction: { icon: 'ri-building-4-line', color: 'text-emerald-400', label: 'Construction', hex: '#7bc67e' },
  trade: { icon: 'ri-exchange-dollar-line', color: 'text-amber-400', label: 'Trade', hex: '#e2c044' },
  exploration: { icon: 'ri-compass-3-line', color: 'text-purple-400', label: 'Exploration', hex: '#5bc0be' },
};

export default function EmpirePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [showGovernmentModal, setShowGovernmentModal] = useState(false);
  const [showRaceChangeModal, setShowRaceChangeModal] = useState(false);
  const [colonyFilter, setColonyFilter] = useState<string>('all');
  const [colonySort, setColonySort] = useState<string>('population');

  const playerRace: RaceDefinition = profile?.race
    ? getRaceById(profile.race as RaceId)
    : RACES[0];

  const governments: Government[] = [
    {
      id: 'democracy', name: 'Galactic Democracy', type: 'Democracy', class: 'Balanced', tier: 1,
      description: 'A representative government where citizens vote on major decisions. Balanced approach to all aspects of empire management.',
      bonuses: { production: 10, research: 15, military: 5, diplomacy: 20, expansion: 10, stability: 15 },
      penalties: { military: -5 },
      requirements: { planets: 1, population: 100000, technology: 1 },
      specialAbilities: ['Democratic Elections', 'Public Opinion', 'Alliance Bonus', 'Trade Agreements'],
      unlocked: true,
    },
    {
      id: 'autocracy', name: 'Imperial Autocracy', type: 'Autocracy', class: 'Military', tier: 2,
      description: 'Single ruler with absolute power. Focuses on military might and rapid expansion through conquest.',
      bonuses: { production: 15, research: 5, military: 30, diplomacy: -10, expansion: 20, stability: 10 },
      penalties: { diplomacy: -10, research: -5 },
      requirements: { planets: 5, population: 500000, technology: 10 },
      specialAbilities: ['Imperial Decree', 'Forced Labor', 'Military Supremacy', 'Conquest Bonus'],
      unlocked: true,
    },
    {
      id: 'technocracy', name: 'Scientific Technocracy', type: 'Technocracy', class: 'Research', tier: 3,
      description: 'Government led by scientists and engineers. Prioritizes technological advancement and innovation.',
      bonuses: { production: 10, research: 40, military: 10, diplomacy: 10, expansion: 5, stability: 15 },
      penalties: { military: -5, expansion: -5 },
      requirements: { planets: 10, population: 1000000, technology: 50 },
      specialAbilities: ['Research Breakthrough', 'Innovation Hub', 'Tech Sharing', 'Prototype Testing'],
      unlocked: true,
    },
    {
      id: 'monarchy', name: 'Stellar Monarchy', type: 'Monarchy', class: 'Balanced', tier: 2,
      description: 'Hereditary rule with noble houses governing sectors. Strong diplomatic ties through marriage alliances.',
      bonuses: { production: 15, research: 10, military: 15, diplomacy: 25, expansion: 10, stability: 20 },
      penalties: { production: -5 },
      requirements: { planets: 8, population: 800000, technology: 15 },
      specialAbilities: ['Royal Decree', 'Noble Houses', 'Dynastic Alliance', 'Court Intrigue'],
      unlocked: true,
    },
    {
      id: 'hive_mind', name: 'Hive Mind Collective', type: 'Hive Mind', class: 'Expansion', tier: 3,
      description: 'Single consciousness controlling all citizens. Unmatched population growth and resource efficiency.',
      bonuses: { production: 30, research: 5, military: 20, diplomacy: -20, expansion: 35, stability: 25 },
      penalties: { diplomacy: -20, research: -5 },
      requirements: { planets: 15, population: 2000000, technology: 30 },
      specialAbilities: ['Collective Consciousness', 'Rapid Expansion', 'Drone Swarm', 'Hive World'],
      unlocked: true,
    },
    {
      id: 'megacorp', name: 'Mega Corporation', type: 'Corporatocracy', class: 'Economy', tier: 2,
      description: 'Corporate board governs the empire. Maximum trade efficiency and economic control.',
      bonuses: { production: 25, research: 15, military: 5, diplomacy: 10, expansion: 15, stability: 10 },
      penalties: { military: -10 },
      requirements: { planets: 10, population: 1500000, technology: 20 },
      specialAbilities: ['Market Manipulation', 'Hostile Takeover', 'Corporate Espionage', 'Trade Monopoly'],
      unlocked: true,
    },
    {
      id: 'theocracy', name: 'Divine Theocracy', type: 'Theocracy', class: 'Diplomacy', tier: 2,
      description: 'Religious order governing through faith. Powerful diplomatic influence and population loyalty.',
      bonuses: { production: 5, research: 10, military: 10, diplomacy: 30, expansion: 10, stability: 30 },
      penalties: { production: -5, research: -5 },
      requirements: { planets: 5, population: 500000, technology: 10 },
      specialAbilities: ['Divine Mandate', 'Crusade', 'Missionary Network', 'Faith Conversion'],
      unlocked: true,
    },
    {
      id: 'junta', name: 'Military Junta', type: 'Stratocracy', class: 'Military', tier: 3,
      description: 'Military elite ruling with absolute discipline. Maximum combat power and rapid fleet construction.',
      bonuses: { production: 20, research: 10, military: 45, diplomacy: -15, expansion: 15, stability: 15 },
      penalties: { diplomacy: -15 },
      requirements: { planets: 20, population: 3000000, technology: 40 },
      specialAbilities: ['Total War', 'Conscription', 'War Economy', 'Martial Law'],
      unlocked: true,
    },
    {
      id: 'federation', name: 'Interstellar Federation', type: 'Federation', class: 'Diplomacy', tier: 3,
      description: 'Decentralized union of worlds with shared governance. Maximum diplomacy and trade bonuses.',
      bonuses: { production: 10, research: 20, military: 5, diplomacy: 40, expansion: 15, stability: 20 },
      penalties: { military: -5 },
      requirements: { planets: 12, population: 2500000, technology: 35 },
      specialAbilities: ['Federal Assembly', 'Trade Network', 'Mutual Defense', 'Cultural Exchange'],
      unlocked: true,
    },
    {
      id: 'synth_ascendancy', name: 'Synthetic Ascendancy', type: 'Gestalt', class: 'Technology', tier: 4,
      description: 'Uploaded consciousness governing through perfect computation. Maximum research and production.',
      bonuses: { production: 35, research: 45, military: 15, diplomacy: 0, expansion: 10, stability: 20 },
      penalties: { diplomacy: -20 },
      requirements: { planets: 25, population: 5000000, technology: 80 },
      specialAbilities: ['Matrix Computing', 'Perfect Efficiency', 'Digital Ascension', 'Quantum Network'],
      unlocked: false,
    },
    {
      id: 'shadow_council', name: 'Shadow Council', type: 'Oligarchy', class: 'Espionage', tier: 4,
      description: 'Hidden cabal pulling strings from the shadows. Unmatched espionage and diplomatic manipulation.',
      bonuses: { production: 15, research: 25, military: 10, diplomacy: 20, expansion: 10, stability: 15 },
      penalties: {},
      requirements: { planets: 18, population: 3500000, technology: 60 },
      specialAbilities: ['Deep Cover', 'Information Warfare', 'Puppet States', 'Shadow Network'],
      unlocked: false,
    },
    {
      id: 'egalitarian_commune', name: 'Egalitarian Commune', type: 'Communal', class: 'Welfare', tier: 2,
      description: 'Society where all citizens are equal. Maximum population happiness and production from cooperation.',
      bonuses: { production: 20, research: 15, military: 0, diplomacy: 25, expansion: 5, stability: 35 },
      penalties: { military: -10, expansion: -5 },
      requirements: { planets: 5, population: 600000, technology: 12 },
      specialAbilities: ['Collective Labor', 'Social Welfare', 'Utopian Living', 'Worker Cooperatives'],
      unlocked: true,
    },
  ];

  const colonies: Colony[] = [
    { id: 'homeworld', name: 'Homeworld Alpha', type: 'planet', coordinates: '[1:234:8]', population: 2500000, development: 95, resources: { metal: 850000, crystal: 420000, deuterium: 180000 }, buildings: 45, defense: 85, status: 'thriving' },
    { id: 'colony-beta', name: 'Mining Colony Beta', type: 'planet', coordinates: '[1:234:12]', population: 980000, development: 68, resources: { metal: 1200000, crystal: 300000, deuterium: 50000 }, buildings: 28, defense: 45, status: 'developing' },
    { id: 'moon-gamma', name: 'Moon Base Gamma', type: 'moon', coordinates: '[1:234:8-1]', population: 150000, development: 42, resources: { metal: 200000, crystal: 800000, deuterium: 400000 }, buildings: 15, defense: 60, status: 'developing' },
    { id: 'station-delta', name: 'Space Station Delta', type: 'space-station', coordinates: '[2:156:5-S]', population: 50000, development: 55, resources: { metal: 100000, crystal: 150000, deuterium: 200000 }, buildings: 8, defense: 75, status: 'thriving' },
  ];

  const currentGovernment = governments[0];

  const empireStats = {
    totalPlanets: colonies.filter((c) => c.type === 'planet').length,
    totalMoons: colonies.filter((c) => c.type === 'moon').length,
    totalStations: colonies.filter((c) => c.type === 'space-station').length,
    totalColonies: colonies.length,
    maxColonies: 1000,
    totalPopulation: colonies.reduce((sum, c) => sum + c.population, 0),
    averageDevelopment: Math.round(colonies.reduce((sum, c) => sum + c.development, 0) / colonies.length),
    totalBuildings: colonies.reduce((sum, c) => sum + c.buildings, 0),
    averageDefense: Math.round(colonies.reduce((sum, c) => sum + c.defense, 0) / colonies.length),
  };

  const filteredColonies = colonyFilter === 'all' ? colonies : colonies.filter((c) => c.type === colonyFilter);
  const sortedColonies = [...filteredColonies].sort((a, b) => {
    switch (colonySort) {
      case 'population': return b.population - a.population;
      case 'development': return b.development - a.development;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thriving': return '#7bc67e';
      case 'developing': return '#5bc0be';
      case 'struggling': return '#e2c044';
      case 'abandoned': return '#f87171';
      default: return '#5a6577';
    }
  };

  const handleChangeGovernment = (government: Government) => {
    if (government.unlocked) {
      alert(`Changing government to: ${government.name}`);
      setShowGovernmentModal(false);
    } else {
      alert(`Requirements not met for ${government.name}`);
    }
  };

  function TraitBar({ name, value }: { name: string; value: number }) {
    const colors = traitColorMap[name] || traitColorMap.strength;
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    return (
      <div className="mb-3 last:mb-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold ${colors.text}`}>{label}</span>
          <span className="text-xs font-mono" style={{ color: '#8892aa' }}>{value}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className={`h-full ${colors.bar} rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
        </div>
      </div>
    );
  }

  /* ── Stat card colors ── */
  const statColors: Record<string, string> = {
    'Total Colonies': '#5bc0be',
    'Planets': '#7bc67e',
    'Moons': '#b98cd6',
    'Stations': '#38bdf8',
    'Population': '#e2c044',
    'Development': '#f472b6',
    'Buildings': '#d4a853',
    'Defense': '#f87171',
  };

  return (
    <div style={{ color: '#8892aa' }}>
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          src="https://readdy.ai/api/search-image?query=vast%20galactic%20empire%20cosmic%20throne%20holographic%20star%20maps%20dark%20moody%20dramatic%20lighting%20futuristic%20command%20center%20deep%20space%20nebula%20backdrop%20sci-fi%20game%20art%20atmospheric&width=1920&height=500&seq=empire_hero_v3&orientation=landscape"
          alt="Empire Background"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.4)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(7,10,16,0.95) 100%)' }} />
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Empire Management</h1>
              <p className="text-sm" style={{ color: '#5a6577' }}>Rule your civilization across the stars</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/galaxy')} className="px-4 py-2 rounded-lg text-xs font-bold text-white cursor-pointer whitespace-nowrap transition-all hover:brightness-110" style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa' }}>
                <i className="ri-planet-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Explore Galaxy
              </button>
              <button onClick={() => navigate('/diplomacy')} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110" style={{ background: 'rgba(91,192,190,0.15)', border: '1px solid rgba(91,192,190,0.3)', color: '#5bc0be' }}>
                <i className="ri-team-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Diplomacy
              </button>
              <button onClick={() => navigate('/leaderboard')} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110" style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.3)', color: '#d4a853' }}>
                <i className="ri-trophy-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Rankings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Empire Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-5">
          {Object.entries(statColors).map(([label, color]) => {
            const key = label.toLowerCase().replace(/\s+/g, '');
            const valMap: Record<string, string> = {
              'totalcolonies': `${empireStats.totalColonies}/${empireStats.maxColonies}`,
              'planets': String(empireStats.totalPlanets),
              'moons': String(empireStats.totalMoons),
              'stations': String(empireStats.totalStations),
              'population': `${(empireStats.totalPopulation / 1000000).toFixed(1)}M`,
              'development': `${empireStats.averageDevelopment}%`,
              'buildings': String(empireStats.totalBuildings),
              'defense': `${empireStats.averageDefense}%`,
            };
            return (
              <div key={label} className="rounded-lg p-3" style={{ background: `${color}06`, border: `1px solid ${color}20` }}>
                <div className="text-xs mb-0.5" style={{ color: '#5a6577' }}>{label}</div>
                <div className="text-lg font-black text-white">{valMap[key] || '0'}</div>
              </div>
            );
          })}
        </div>

        {/* Current Government */}
        <div className="rounded-xl p-5 mb-5" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-wider" style={{ color: '#8892aa' }}>CURRENT GOVERNMENT</h2>
            <button onClick={() => setShowGovernmentModal(true)} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110" style={{ background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)', color: '#d4a853' }}>
              Change Government
            </button>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)' }}>
              <i className="ri-government-line text-2xl w-8 h-8 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg font-bold text-white">{currentGovernment.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(212,168,83,0.15)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.3)' }}>Tier {currentGovernment.tier}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.03)', color: '#5a6577', border: '1px solid #1e2a36' }}>{currentGovernment.class}</span>
              </div>
              <p className="text-xs mb-4 max-w-2xl" style={{ color: '#6b7a95' }}>{currentGovernment.description}</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Object.entries(currentGovernment.bonuses).map(([key, value]) => {
                  const isPenalty = currentGovernment.penalties[key as keyof typeof currentGovernment.penalties];
                  return (
                    <div key={key} className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="text-xs mb-0.5 capitalize" style={{ color: '#3a4557', fontSize: 10 }}>{key}</div>
                      <div className="text-sm font-bold" style={{ color: value > 0 ? '#7bc67e' : '#f87171' }}>
                        {value > 0 ? '+' : ''}{value}%
                      </div>
                      {isPenalty && <div className="text-xs mt-0.5" style={{ color: '#f87171', fontSize: 10, opacity: 0.7 }}>{isPenalty}%</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Racial Traits */}
        <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1px solid #1e2a36' }}>
          <div className="px-5 py-3.5" style={{ background: 'rgba(212,168,83,0.06)', borderBottom: '1px solid #1e2a36' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.12)' }}>
                  <i className={`${playerRace.icon} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: '#d4a853' }}></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-white">Racial Traits</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap" style={{ background: 'rgba(123,198,126,0.12)', color: '#7bc67e', border: '1px solid rgba(123,198,126,0.25)' }}>ACTIVE</span>
                  </div>
                  <p className="text-xs" style={{ color: '#5a6577' }}>{playerRace.name} — {playerRace.category} • Your species shapes every aspect of your empire</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to="/races-explorer" className="px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2a36', color: '#8892aa' }}>
                  <i className="ri-search-eye-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Explore All Races
                </Link>
                <button onClick={() => setShowRaceChangeModal(true)} className="px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110" style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}>
                  <i className="ri-dna-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Change Race
                </button>
              </div>
            </div>
          </div>

          <div className="p-5" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Column 1 — Identity & Lore */}
              <div>
                <h3 className="text-xs font-bold tracking-wider mb-3" style={{ color: '#5a6577' }}>SPECIES IDENTITY</h3>
                <div className="rounded-lg p-4 mb-4" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                  <p className="text-xs leading-relaxed italic" style={{ color: '#6b7a95' }}>&ldquo;{playerRace.lore}&rdquo;</p>
                </div>
                <div className="space-y-1.5">
                  {[
                    ['Homeworld', playerRace.homeworldType],
                    ['Lifespan', `${playerRace.lifespan >= 500 ? '∞' : ''}${playerRace.lifespan} years`],
                    ['Reproduction', `${playerRace.reproductionRate.toFixed(1)}x rate`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.015)' }}>
                      <span className="text-xs" style={{ color: '#5a6577' }}>{label}</span>
                      <span className="text-xs font-semibold text-white">{val}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.015)' }}>
                    <span className="text-xs" style={{ color: '#5a6577' }}>Adaptability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${playerRace.adaptability}%`, background: 'linear-gradient(90deg, #5bc0be, #7bc67e)' }} />
                      </div>
                      <span className="text-xs font-semibold text-white">{playerRace.adaptability}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                  <h4 className="text-xs font-bold tracking-wider mb-3" style={{ color: '#5a6577' }}>STARTING RESOURCES</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['Metal', playerRace.metalBonus, '#d4a853'],
                      ['Crystal', playerRace.crystalBonus, '#5bc0be'],
                      ['Deuterium', playerRace.deuteriumBonus, '#7bc67e'],
                    ].map(([label, bonus, c]) => (
                      <div key={label as string} className="text-center">
                        <div className="text-xs mb-0.5" style={{ color: '#3a4557', fontSize: 10 }}>{label as string}</div>
                        <div className="text-sm font-bold" style={{ color: (bonus as number) >= 0 ? (c as string) : '#f87171' }}>
                          {(bonus as number) > 0 ? '+' : ''}{bonus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2 — RPG Attributes */}
              <div>
                <h3 className="text-xs font-bold tracking-wider mb-3" style={{ color: '#5a6577' }}>GENETIC ATTRIBUTES</h3>
                <div className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                  <TraitBar name="strength" value={playerRace.traits.strength} />
                  <TraitBar name="intelligence" value={playerRace.traits.intelligence} />
                  <TraitBar name="agility" value={playerRace.traits.agility} />
                  <TraitBar name="endurance" value={playerRace.traits.endurance} />
                  <TraitBar name="charisma" value={playerRace.traits.charisma} />
                  <TraitBar name="perception" value={playerRace.traits.perception} />
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1e2a36' }}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#5a6577' }}>Average Rating</span>
                      <span className="text-white font-bold">{Math.round(Object.values(playerRace.traits).reduce((a, b) => a + b, 0) / 6)}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.round(Object.values(playerRace.traits).reduce((a, b) => a + b, 0) / 6)}%`, background: 'linear-gradient(90deg, #d4a853, #e2c044)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3 — Empire Bonuses */}
              <div>
                <h3 className="text-xs font-bold tracking-wider mb-3" style={{ color: '#5a6577' }}>ACTIVE EMPIRE BONUSES</h3>
                <div className="rounded-lg p-4 mb-4" style={{ background: 'rgba(212,168,83,0.04)', border: '1px solid rgba(212,168,83,0.15)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.15)' }}>
                      <i className="ri-star-fill text-xs w-4 h-4 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
                    </div>
                    <span className="text-xs font-bold" style={{ color: '#d4a853' }}>{playerRace.bonus}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#6b7a95' }}>{playerRace.bonusDetails}</p>
                </div>
                <div className="rounded-lg p-4 mb-4" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                  <h4 className="text-xs font-bold tracking-wider mb-3" style={{ color: '#5a6577' }}>EMPIRE-WIDE MODIFIERS</h4>
                  <div className="space-y-2.5">
                    {(Object.keys(bonusColorMap) as Array<keyof typeof bonusColorMap>).map((key) => {
                      const bonus = playerRace.bonuses[key];
                      const meta = bonusColorMap[key];
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: `${meta.hex}15` }}>
                              <i className={`${meta.icon} text-xs w-4 h-4 flex items-center justify-center`} style={{ color: meta.hex }}></i>
                            </div>
                            <span className="text-xs" style={{ color: '#8892aa' }}>{meta.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <div className="h-full rounded-full" style={{ width: `${Math.min(bonus, 100)}%`, background: 'linear-gradient(90deg, #7bc67e, #34d399)' }} />
                            </div>
                            <span className="text-xs font-bold font-mono" style={{ color: bonus > 0 ? '#7bc67e' : bonus < 0 ? '#f87171' : '#5a6577' }}>
                              {bonus > 0 ? '+' : ''}{bonus}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-lg p-4" style={{ background: 'rgba(212,168,83,0.03)', border: '1px solid rgba(212,168,83,0.12)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'rgba(212,168,83,0.15)' }}>
                      <i className="ri-sparkling-2-line text-xs w-4 h-4 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
                    </div>
                    <span className="text-xs font-bold tracking-wider" style={{ color: '#d4a853' }}>SPECIAL TRAIT</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#6b7a95' }}>{playerRace.specialStartingTrait}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colony Management */}
        <div className="rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #1e2a36' }}>
            <h2 className="text-xs font-bold tracking-wider" style={{ color: '#8892aa' }}>COLONY MANAGEMENT</h2>
            <div className="flex items-center gap-2">
              <select value={colonyFilter} onChange={(e) => setColonyFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2a36', color: '#8892aa' }}>
                <option value="all">All Colonies</option>
                <option value="planet">Planets Only</option>
                <option value="moon">Moons Only</option>
                <option value="space-station">Stations Only</option>
              </select>
              <select value={colonySort} onChange={(e) => setColonySort(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2a36', color: '#8892aa' }}>
                <option value="population">Sort by Population</option>
                <option value="development">Sort by Development</option>
                <option value="name">Sort by Name</option>
              </select>
              <button onClick={() => navigate('/galaxy')} className="px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110" style={{ background: 'rgba(123,198,126,0.12)', border: '1px solid rgba(123,198,126,0.3)', color: '#7bc67e' }}>
                <i className="ri-add-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>New Colony
              </button>
            </div>
          </div>
          <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedColonies.map((colony) => {
              const colonyArt = getColonyArt(colony.name, colony.type);
              const sc = getStatusColor(colony.status);
              return (
                <div key={colony.id} className="rounded-xl overflow-hidden transition-all hover:brightness-110" style={{ background: '#080b0f', border: '1px solid #1e2a36' }}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={colonyArt.url} alt={colonyArt.alt} className="w-full h-full object-cover object-top" style={{ filter: 'brightness(0.6)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(7,10,16,0.92) 100%)' }} />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}30` }}>
                      {colony.type.replace('-', ' ')}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}30` }}>
                      {colony.status}
                    </div>
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="text-sm font-black text-white drop-shadow-lg">{colony.name}</h3>
                      <p className="text-xs" style={{ color: '#5a6577' }}>{colony.coordinates}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <div className="text-xs mb-0.5" style={{ color: '#5a6577' }}>Population</div>
                        <div className="text-sm font-bold text-white">{(colony.population / 1000).toLocaleString()}K</div>
                      </div>
                      <div>
                        <div className="text-xs mb-0.5" style={{ color: '#5a6577' }}>Buildings</div>
                        <div className="text-sm font-bold text-white">{colony.buildings}</div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#5a6577' }}>Development</span>
                        <span style={{ color: '#5bc0be' }}>{colony.development}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${colony.development}%`, background: 'linear-gradient(90deg, #5bc0be, #7bc67e)' }} />
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => navigate('/buildings')} className="flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all hover:brightness-110 text-white" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                        Manage
                      </button>
                      <button onClick={() => navigate('/fleet')} className="px-3 py-2 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2a36', color: '#8892aa' }}>
                        <i className="ri-rocket-line w-3.5 h-3.5 inline-flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Race Change Modal */}
      {showRaceChangeModal && <RaceChangeModal onClose={() => setShowRaceChangeModal(false)} />}

      {/* Government Selection Modal */}
      {showGovernmentModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowGovernmentModal(false)}>
          <div className="rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto" style={{ background: 'linear-gradient(180deg, #111922 0%, #0d131a 100%)', border: '1px solid #1e2a36' }} onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(180deg, #111922 0%, #0d131a 80%, transparent 100%)', borderBottom: '1px solid #1e2a36' }}>
              <h2 className="text-lg font-black text-white">Select Government Type</h2>
              <button onClick={() => setShowGovernmentModal(false)} className="w-8 h-8 rounded flex items-center justify-center cursor-pointer transition-all" style={{ color: '#5a6577' }}>
                <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {governments.map((gov) => (
                <div key={gov.id} onClick={() => gov.unlocked && handleChangeGovernment(gov)}
                  className={`rounded-xl p-4 transition-all ${gov.unlocked ? 'cursor-pointer hover:brightness-110' : 'opacity-50'}`}
                  style={{ background: 'rgba(255,255,255,0.015)', border: gov.unlocked ? '1px solid #1e2a36' : '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">{gov.name}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(212,168,83,0.12)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.25)' }}>Tier {gov.tier}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.02)', color: '#5a6577', border: '1px solid #1e2a36' }}>{gov.class}</span>
                      </div>
                    </div>
                    {!gov.unlocked && <i className="ri-lock-line text-lg w-6 h-6 flex items-center justify-center" style={{ color: '#3a4557' }}></i>}
                  </div>
                  <p className="text-xs mb-3" style={{ color: '#6b7a95' }}>{gov.description}</p>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <div><span style={{ color: '#5a6577' }}>Production:</span><span className="font-bold ml-1" style={{ color: '#7bc67e' }}>+{gov.bonuses.production}%</span></div>
                    <div><span style={{ color: '#5a6577' }}>Research:</span><span className="font-bold ml-1" style={{ color: '#a78bfa' }}>+{gov.bonuses.research}%</span></div>
                    <div><span style={{ color: '#5a6577' }}>Military:</span><span className="font-bold ml-1" style={{ color: '#f87171' }}>+{gov.bonuses.military}%</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
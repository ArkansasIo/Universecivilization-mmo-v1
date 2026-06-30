import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearchManager } from '@/hooks/useResearchManager';
import { useResources } from '@/hooks/useResources';
import { getResearchArt } from '@/data/gameArtwork';

interface TechDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  unlocks: string[];
  baseCost: { metal: number; crystal: number; deuterium: number };
  baseTime: number;
}

const TECHNOLOGIES: TechDefinition[] = [
  { id: 'energy_technology', name: 'Energy Technology', category: 'basic', description: 'Improves energy production efficiency and unlocks advanced power systems', icon: 'ri-flashlight-line', color: '#e2c044', unlocks: ['Laser Technology', 'Ion Technology'], baseCost: { metal: 0, crystal: 800, deuterium: 400 }, baseTime: 2730 },
  { id: 'laser_technology', name: 'Laser Technology', category: 'combat', description: 'Enhances laser weapon systems and defensive capabilities', icon: 'ri-flashlight-fill', color: '#f87171', unlocks: ['Plasma Technology'], baseCost: { metal: 200, crystal: 100, deuterium: 0 }, baseTime: 1935 },
  { id: 'ion_technology', name: 'Ion Technology', category: 'combat', description: 'Develops ion-based weapons with shield-penetrating capabilities', icon: 'ri-thunderstorms-line', color: '#5bc0be', unlocks: ['Plasma Technology'], baseCost: { metal: 1000, crystal: 300, deuterium: 100 }, baseTime: 4365 },
  { id: 'hyperspace_technology', name: 'Hyperspace Technology', category: 'drive', description: 'Enables faster-than-light travel and reduces fleet travel time', icon: 'ri-space-ship-line', color: '#b98cd6', unlocks: ['Hyperspace Drive'], baseCost: { metal: 0, crystal: 4000, deuterium: 2000 }, baseTime: 9000 },
  { id: 'combustion_drive', name: 'Combustion Drive', category: 'drive', description: 'Increases speed of ships using combustion engines', icon: 'ri-rocket-line', color: '#fb923c', unlocks: ['Impulse Drive'], baseCost: { metal: 400, crystal: 0, deuterium: 600 }, baseTime: 3500 },
  { id: 'impulse_drive', name: 'Impulse Drive', category: 'drive', description: 'Improves impulse engine efficiency for medium ships', icon: 'ri-rocket-2-line', color: '#5bc0be', unlocks: ['Hyperspace Drive'], baseCost: { metal: 2000, crystal: 4000, deuterium: 600 }, baseTime: 6310 },
  { id: 'espionage_technology', name: 'Espionage Technology', category: 'research', description: 'Enhances spy probe capabilities and counter-intelligence', icon: 'ri-user-search-line', color: '#7bc67e', unlocks: ['Advanced Sensors'], baseCost: { metal: 200, crystal: 1000, deuterium: 200 }, baseTime: 2430 },
  { id: 'computer_technology', name: 'Computer Technology', category: 'research', description: 'Increases maximum fleet slots and improves targeting systems', icon: 'ri-cpu-line', color: '#a78bfa', unlocks: ['Astrophysics'], baseCost: { metal: 0, crystal: 400, deuterium: 600 }, baseTime: 3160 },
  { id: 'astrophysics', name: 'Astrophysics', category: 'research', description: 'Allows colonization of additional planets and expeditions', icon: 'ri-planet-line', color: '#b98cd6', unlocks: ['Colony Ships'], baseCost: { metal: 4000, crystal: 8000, deuterium: 4000 }, baseTime: 11700 },
  { id: 'weapons_technology', name: 'Weapons Technology', category: 'combat', description: 'Increases damage output of all offensive weapons', icon: 'ri-sword-line', color: '#f87171', unlocks: ['Plasma Technology'], baseCost: { metal: 800, crystal: 200, deuterium: 0 }, baseTime: 3920 },
  { id: 'shielding_technology', name: 'Shielding Technology', category: 'combat', description: 'Strengthens defensive shields on ships and structures', icon: 'ri-shield-line', color: '#5bc0be', unlocks: ['Plasma Technology'], baseCost: { metal: 200, crystal: 600, deuterium: 0 }, baseTime: 2895 },
  { id: 'armor_technology', name: 'Armor Technology', category: 'combat', description: 'Improves hull integrity and damage resistance', icon: 'ri-shield-check-line', color: '#8892aa', unlocks: ['Advanced Armor'], baseCost: { metal: 1000, crystal: 0, deuterium: 0 }, baseTime: 3330 },
];

const CATEGORIES = [
  { id: 'all', name: 'All Technologies', icon: 'ri-apps-line' },
  { id: 'basic', name: 'Basic Research', icon: 'ri-flask-line' },
  { id: 'combat', name: 'Combat Systems', icon: 'ri-sword-line' },
  { id: 'drive', name: 'Propulsion', icon: 'ri-rocket-line' },
  { id: 'research', name: 'Advanced Research', icon: 'ri-microscope-line' },
];

function calcCost(tech: TechDefinition, level: number) {
  const mult = Math.pow(2, level);
  return { metal: Math.floor(tech.baseCost.metal * mult), crystal: Math.floor(tech.baseCost.crystal * mult), deuterium: Math.floor(tech.baseCost.deuterium * mult) };
}

function calcTime(tech: TechDefinition, level: number): number {
  return Math.floor(tech.baseTime * Math.pow(1.75, level));
}

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function ResearchPage() {
  const navigate = useNavigate();
  const { research, activeResearch, loading, startResearch, cancelResearch, getResearchLevel, getTimeRemaining, getProgress } = useResearchManager();
  const { resources, canAfford, deductResources } = useResources();
  const [activeCategory, setActiveCategory] = useState('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [working, setWorking] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpgrade = useCallback(async (tech: TechDefinition) => {
    const currentLevel = getResearchLevel(tech.id);
    const cost = calcCost(tech, currentLevel);
    const time = calcTime(tech, currentLevel);
    if (!canAfford(cost)) { showToast('Insufficient resources!', 'error'); return; }
    setWorking(tech.id);
    try {
      const deducted = await deductResources(cost);
      if (!deducted) { showToast('Failed to deduct resources', 'error'); return; }
      const result = await startResearch(tech.name, currentLevel, time, cost);
      if (result.success) {
        showToast(`Researching ${tech.name} Level ${currentLevel + 1} — ${formatTime(time)}`);
      } else {
        showToast(result.error ?? 'Failed to start research', 'error');
      }
    } finally { setWorking(null); }
  }, [getResearchLevel, canAfford, deductResources, startResearch]);

  const handleCancel = async () => {
    const result = await cancelResearch();
    if (result.success) { showToast('Research cancelled — resources refunded'); }
    else { showToast(result.error ?? 'Failed to cancel', 'error'); }
  };

  const timeLeft = getTimeRemaining();
  const progress = getProgress();
  const filteredTechs = activeCategory === 'all' ? TECHNOLOGIES : TECHNOLOGIES.filter(t => t.category === activeCategory);

  return (
    <div style={{ color: '#8892aa' }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-xs font-semibold transition-all max-w-sm"
          style={{ background: 'linear-gradient(135deg, #111922, #1a2035)', border: `1px solid ${toast.type === 'error' ? 'rgba(248,113,113,0.5)' : 'rgba(212,168,83,0.4)'}`, color: toast.type === 'error' ? '#f87171' : '#d4a853' }}>
          <i className={`${toast.type === 'error' ? 'ri-error-warning-line' : 'ri-information-line'} mr-2 w-3.5 h-3.5 inline-flex items-center justify-center`}></i>{toast.msg}
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <div className="absolute inset-0">
          <img src="https://readdy.ai/api/search-image?query=futuristic%20research%20laboratory%20with%20holographic%20displays%20scientific%20equipment%20ambient%20blue-orange%20glow%20advanced%20technology%20workstations%20scientists%20analyzing%20data%20dark%20atmospheric%20chamber%20sci-fi%20game%20art&width=1920&height=600&seq=research_hero_v3&orientation=landscape"
            alt="Research" className="w-full h-full object-cover object-top" style={{ filter: 'brightness(0.4)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(7,10,16,0.95) 100%)' }}></div>
        </div>
        <div className="relative z-10 h-full flex items-end px-6 pb-5">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Research Lab</h1>
              <p className="text-sm" style={{ color: '#5a6577' }}>Unlock the secrets of the universe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Research Banner */}
      {activeResearch && (
        <div className="mx-5 mt-4 p-4 rounded-xl" style={{ background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <i className="ri-flask-line text-lg w-5 h-5 flex items-center justify-center" style={{ color: '#a78bfa' }}></i>
              <div>
                <p className="text-sm font-bold text-white">Researching: {activeResearch.technology_name} Level {activeResearch.level}</p>
                <p className="text-xs" style={{ color: '#5a6577' }}>Time remaining: <span className="font-mono" style={{ color: '#e2c044' }}>{formatTime(timeLeft)}</span></p>
              </div>
            </div>
            <button onClick={handleCancel} className="text-xs px-3 py-1.5 rounded cursor-pointer whitespace-nowrap font-bold transition-all"
              style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
              <i className="ri-close-line mr-1 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Cancel
            </button>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #a78bfa, #b98cd6)' }} />
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="px-5 py-3" style={{ borderBottom: '1px solid #1e2a36', background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat.id ? 'text-white' : ''
              }`}
              style={activeCategory === cat.id
                ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' }
                : { background: 'rgba(255,255,255,0.02)', border: '1px solid #1e2a36', color: '#5a6577' }}>
              <i className={`${cat.icon} mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center`}></i>{cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-sm animate-pulse" style={{ color: '#5a6577' }}>Loading research data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTechs.map(tech => {
              const currentLevel = getResearchLevel(tech.id);
              const nextLevel = currentLevel + 1;
              const cost = calcCost(tech, currentLevel);
              const time = calcTime(tech, currentLevel);
              const affordable = canAfford(cost);
              const isActive = activeResearch?.technology_name === tech.name;
              const isWorking = working === tech.id;
              const canStart = !activeResearch && affordable && !isWorking;
              const art = getResearchArt(tech.name.toLowerCase().replace(/\s+/g, '_'));

              return (
                <div key={tech.id} className="rounded-xl overflow-hidden border transition-all hover:brightness-110"
                  style={{ background: '#080b0f', borderColor: isActive ? 'rgba(167,139,250,0.4)' : '#1e2a36' }}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={art.url} alt={art.alt} className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                      style={{ filter: 'brightness(0.65) saturate(1.15)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,11,15,0.92) 100%)' }} />
                    <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <i className={`${tech.icon} text-base w-4 h-4 flex items-center justify-center`} style={{ color: tech.color }}></i>
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-xs font-black text-white" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(212,168,83,0.25)' }}>Lv.{currentLevel}</div>
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.1)' }}>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa' }}>
                          <i className="ri-loader-4-line animate-spin w-3.5 h-3.5 flex items-center justify-center"></i>Researching…
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-3 right-3"><h3 className="text-sm font-black text-white drop-shadow-lg">{tech.name}</h3></div>
                  </div>
                  <div className="p-3.5">
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: '#6b7a95' }}>{tech.description}</p>
                    <div className="rounded-lg p-3.5 mb-3" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid #1e2a36' }}>
                      <p className="text-xs mb-2" style={{ color: '#5a6577' }}>Upgrade to Level {nextLevel}:</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <i className="ri-copper-coin-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#d4a853' }}></i>
                          <span className={`font-semibold ${cost.metal > 0 && resources.metal < cost.metal ? 'text-red-400' : 'text-white'}`}>{cost.metal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-sparkling-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#5bc0be' }}></i>
                          <span className={`font-semibold ${cost.crystal > 0 && resources.crystal < cost.crystal ? 'text-red-400' : 'text-white'}`}>{cost.crystal.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <i className="ri-drop-line w-3.5 h-3.5 flex items-center justify-center" style={{ color: '#7bc67e' }}></i>
                          <span className={`font-semibold ${cost.deuterium > 0 && resources.deuterium < cost.deuterium ? 'text-red-400' : 'text-white'}`}>{cost.deuterium.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-2.5">
                        <span style={{ color: '#5a6577' }}>Research Time:</span>
                        <span className="font-semibold" style={{ color: '#e2c044' }}>{formatTime(time)}</span>
                      </div>
                    </div>
                    {tech.unlocks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {tech.unlocks.map((u, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa' }}>{u}</span>
                        ))}
                      </div>
                    )}
                    <button onClick={() => handleUpgrade(tech)} disabled={!canStart || isActive}
                      className={`w-full px-4 py-2.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap ${canStart && !isActive ? 'text-white cursor-pointer hover:opacity-90' : 'cursor-not-allowed'}`}
                      style={canStart && !isActive ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' } : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: '#5a6577' }}>
                      {isWorking ? (<><i className="ri-loader-4-line animate-spin mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Starting...</>)
                        : isActive ? (<><i className="ri-loader-4-line animate-spin mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Researching...</>)
                          : activeResearch ? (<><i className="ri-time-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Lab Busy</>)
                            : !affordable ? (<><i className="ri-close-circle-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Insufficient Resources</>)
                              : (<><i className="ri-arrow-up-line mr-1.5 w-3.5 h-3.5 inline-flex items-center justify-center"></i>Research Level {nextLevel}</>)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
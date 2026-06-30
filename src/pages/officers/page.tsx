import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getOfficerArt } from '@/data/gameArtwork';

const GOLD = '#d4a853';
const BORDER = '#1e2a36';
const CARD_BG = '#080b0f';

interface Officer {
  id: string; name: string; title: string; level: number; maxLevel: number; active: boolean;
  cost: { credits: number; darkMatter?: number }; duration: number;
  bonuses: { type: string; value: string }[]; description: string; icon: string; rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function OfficersPage() {
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const officers: Officer[] = [
    { id: '1', name: 'Commander', title: 'Fleet Commander', level: 5, maxLevel: 10, active: true, cost: { credits: 500000 }, duration: 7,
      bonuses: [{ type: 'Fleet Slots', value: '+2 slots' },{ type: 'Fleet Speed', value: '+10%' },{ type: 'Combat Power', value: '+5%' }],
      description: 'Increases fleet capacity and combat effectiveness. Essential for military operations.', icon: 'ri-shield-star-line', rarity: 'epic' },
    { id: '2', name: 'Admiral', title: 'Grand Admiral', level: 8, maxLevel: 10, active: true, cost: { credits: 750000, darkMatter: 500 }, duration: 7,
      bonuses: [{ type: 'Fleet Capacity', value: '+25%' },{ type: 'Attack Power', value: '+15%' },{ type: 'Defense Power', value: '+10%' },{ type: 'Fleet Speed', value: '+20%' }],
      description: 'Master of naval warfare. Provides significant combat bonuses and fleet management improvements.', icon: 'ri-sword-line', rarity: 'legendary' },
    { id: '3', name: 'Engineer', title: 'Chief Engineer', level: 7, maxLevel: 10, active: true, cost: { credits: 400000 }, duration: 7,
      bonuses: [{ type: 'Build Speed', value: '+15%' },{ type: 'Build Cost', value: '-10%' },{ type: 'Energy Production', value: '+10%' }],
      description: 'Accelerates construction and reduces building costs. Perfect for rapid expansion.', icon: 'ri-tools-line', rarity: 'rare' },
    { id: '4', name: 'Geologist', title: 'Resource Specialist', level: 6, maxLevel: 10, active: true, cost: { credits: 350000 }, duration: 7,
      bonuses: [{ type: 'Metal Production', value: '+20%' },{ type: 'Crystal Production', value: '+20%' },{ type: 'Deuterium Production', value: '+20%' }],
      description: 'Boosts resource production across all planets. Critical for economic growth.', icon: 'ri-earth-line', rarity: 'rare' },
    { id: '5', name: 'Technocrat', title: 'Research Director', level: 9, maxLevel: 10, active: true, cost: { credits: 600000, darkMatter: 300 }, duration: 7,
      bonuses: [{ type: 'Research Speed', value: '+25%' },{ type: 'Research Cost', value: '-15%' },{ type: 'Tech Efficiency', value: '+10%' }],
      description: 'Accelerates technological advancement and reduces research costs.', icon: 'ri-flask-line', rarity: 'epic' },
    { id: '6', name: 'Merchant', title: 'Trade Master', level: 4, maxLevel: 10, active: false, cost: { credits: 300000 }, duration: 7,
      bonuses: [{ type: 'Trade Profit', value: '+20%' },{ type: 'Market Fee', value: '-25%' },{ type: 'Cargo Capacity', value: '+15%' }],
      description: 'Improves trading efficiency and reduces marketplace fees.', icon: 'ri-exchange-line', rarity: 'rare' },
    { id: '7', name: 'Spy Master', title: 'Intelligence Chief', level: 0, maxLevel: 10, active: false, cost: { credits: 450000 }, duration: 7,
      bonuses: [{ type: 'Espionage Success', value: '+30%' },{ type: 'Counter-Espionage', value: '+25%' },{ type: 'Probe Survival', value: '+20%' }],
      description: 'Enhances espionage operations and protects against enemy spies.', icon: 'ri-user-search-line', rarity: 'epic' },
    { id: '8', name: 'Colonizer', title: 'Expansion Coordinator', level: 0, maxLevel: 10, active: false, cost: { credits: 250000 }, duration: 7,
      bonuses: [{ type: 'Colony Slots', value: '+2 slots' },{ type: 'Colonization Speed', value: '+20%' },{ type: 'Starting Resources', value: '+50%' }],
      description: 'Enables faster expansion and provides better starting conditions for new colonies.', icon: 'ri-planet-line', rarity: 'common' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-amber-500 to-orange-600';
      case 'epic': return 'from-purple-500 to-pink-600';
      case 'rare': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-amber-500/50';
      case 'epic': return 'border-purple-500/50';
      case 'rare': return 'border-blue-500/50';
      default: return 'border-gray-500/50';
    }
  };

  return (
    <div className="text-white">
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=futuristic%20space%20military%20officer%20corps%20elite%20commanders%20specialists%20diverse%20portraits%20holographic%20command%20center%20background%20sci-fi%20cinematic%20wide%20angle%20dramatic%20lighting%20dark%20atmosphere&width=1920&height=600&seq=officers_hero_main&orientation=landscape"
          alt="Officers"
          className="w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.65) saturate(1.1)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-6">
          <div>
            <h1 className="text-5xl font-black mb-2 drop-shadow-lg" style={{ color: GOLD }}>
              Officers &amp; Commanders
            </h1>
            <p className="text-ogame-muted text-lg">Hire elite officers to boost your empire&apos;s capabilities</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2" style={{ border: `1px solid ${BORDER}` }}>
              <div className="text-xs text-ogame-dim mb-1">Credits</div>
              <div className="text-xl font-bold text-amber-400">45.8M</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2" style={{ border: '1px solid rgba(168,85,247,0.4)' }}>
              <div className="text-xs text-ogame-dim mb-1">Dark Matter</div>
              <div className="text-xl font-bold text-purple-400">12,450</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2" style={{ border: '1px solid rgba(52,211,153,0.4)' }}>
              <div className="text-xs text-ogame-dim mb-1">Active Officers</div>
              <div className="text-xl font-bold text-emerald-400">{officers.filter(o => o.active).length}/{officers.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {officers.map(officer => {
            const portrait = getOfficerArt(officer.name);
            return (
              <div key={officer.id}
                className={`rounded-xl overflow-hidden hover:scale-105 transition-all cursor-pointer ${!officer.active && 'opacity-70'}`}
                style={{ background: CARD_BG, border: `1px solid ${getRarityBorder(officer.rarity).replace('border-', '')}` }}
                onClick={() => { setSelectedOfficer(officer); setShowDetails(true); }}>
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${getRarityColor(officer.rarity)}`}>
                  <img src={portrait.url} alt={portrait.alt}
                    className="w-full h-full object-cover object-top"
                    style={{ filter: 'brightness(0.85) saturate(1.2)', mixBlendMode: 'luminosity' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.75) 100%)' }} />
                  {officer.active && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold capitalize text-white" style={{ background: 'rgba(0,0,0,0.6)' }}>{officer.rarity}</span>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="text-base font-black text-white drop-shadow-lg">{officer.name}</h3>
                    <p className="text-xs text-white/80">{officer.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-ogame-dim">Level {officer.level}/{officer.maxLevel}</span>
                      <span className="text-purple-400">{Math.round((officer.level / officer.maxLevel) * 100)}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className={`bg-gradient-to-r ${getRarityColor(officer.rarity)} h-1.5 rounded-full transition-all`}
                        style={{ width: `${(officer.level / officer.maxLevel) * 100}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {officer.bonuses.slice(0, 3).map((bonus, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-ogame-dim">{bonus.type}</span>
                        <span className="text-emerald-400 font-bold">{bonus.value}</span>
                      </div>
                    ))}
                    {officer.bonuses.length > 3 && <div className="text-xs text-purple-400 text-center">+{officer.bonuses.length - 3} more bonuses</div>}
                  </div>
                  <div className="border-t pt-2.5 space-y-1.5 mb-3" style={{ borderColor: BORDER }}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ogame-dim">Cost</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400">{(officer.cost.credits / 1000).toFixed(0)}K</span>
                        {officer.cost.darkMatter && <span className="text-purple-400">+{officer.cost.darkMatter} DM</span>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ogame-dim">Duration</span>
                      <span className="text-amber-400">{officer.duration} days</span>
                    </div>
                  </div>
                  <button className={`w-full py-2 rounded-lg font-bold transition-all whitespace-nowrap text-sm cursor-pointer ${
                    officer.active
                      ? 'text-emerald-400'
                      : officer.level === 0
                      ? 'text-black'
                      : 'text-amber-400'
                  }`} style={
                    officer.active
                      ? { background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }
                      : officer.level === 0
                      ? { background: 'linear-gradient(90deg, #d4a853, #e2c044)' }
                      : { background: 'rgba(212,168,83,0.12)', border: `1px solid rgba(212,168,83,0.25)` }
                  }>
                    {officer.active ? <><i className="ri-refresh-line mr-1.5 w-4 h-4 inline-flex items-center justify-center"></i>Extend</>
                    : officer.level === 0 ? <><i className="ri-add-line mr-1.5 w-4 h-4 inline-flex items-center justify-center"></i>Hire</>
                    : <><i className="ri-play-line mr-1.5 w-4 h-4 inline-flex items-center justify-center"></i>Activate</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Bonuses Summary */}
        <div className="mt-8 rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: GOLD }}>Active Bonuses Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Fleet Power', val: '+35%', color: 'text-emerald-400' },
              { label: 'Production', val: '+20%', color: 'text-amber-400' },
              { label: 'Research Speed', val: '+25%', color: 'text-purple-400' },
              { label: 'Build Speed', val: '+15%', color: 'text-amber-400' },
            ].map((s, i) => (
              <div key={i} className="rounded-lg p-4" style={{ background: '#0d1117' }}>
                <div className="text-sm text-ogame-dim mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedOfficer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowDetails(false)}>
          <div className="rounded-xl max-w-2xl w-full" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }} onClick={(e) => e.stopPropagation()}>
            <div className={`relative h-48 bg-gradient-to-br ${getRarityColor(selectedOfficer.rarity)} overflow-hidden`}>
              <img src={getOfficerArt(selectedOfficer.name).url} alt={selectedOfficer.name}
                className="w-full h-full object-cover object-top"
                style={{ filter: 'brightness(0.7) saturate(1.1)', mixBlendMode: 'luminosity' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)' }} />
              <button onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white bg-black/40 rounded-full transition-colors cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-3xl font-bold text-white">{selectedOfficer.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-lg text-white/90">{selectedOfficer.title}</p>
                  <span className="text-xs px-2 py-0.5 bg-white/20 rounded-full uppercase font-bold text-white">{selectedOfficer.rarity}</span>
                  <span className="text-sm text-white/80">Lv.{selectedOfficer.level}/{selectedOfficer.maxLevel}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-ogame-muted mb-6">{selectedOfficer.description}</p>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3" style={{ color: GOLD }}>Bonuses</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOfficer.bonuses.map((bonus, idx) => (
                    <div key={idx} className="rounded-lg p-3" style={{ background: CARD_BG }}>
                      <div className="text-sm text-ogame-dim">{bonus.type}</div>
                      <div className="text-lg font-bold text-emerald-400">{bonus.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg p-4 mb-6" style={{ background: CARD_BG }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-ogame-dim mb-1">Hiring Cost</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-amber-400">{(selectedOfficer.cost.credits / 1000).toFixed(0)}K Credits</span>
                      {selectedOfficer.cost.darkMatter && <span className="text-lg font-bold text-purple-400">+{selectedOfficer.cost.darkMatter} DM</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-ogame-dim mb-1">Duration</div>
                    <div className="text-xl font-bold text-amber-400">{selectedOfficer.duration} days</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {selectedOfficer.active ? (
                  <>
                    <button className="flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-emerald-400" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}>
                      <i className="ri-refresh-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>Extend for 7 Days</button>
                    <button className="flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <i className="ri-close-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>Deactivate</button>
                  </>
                ) : selectedOfficer.level === 0 ? (
                  <button className="w-full px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-black" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                    <i className="ri-add-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>Hire Officer</button>
                ) : (
                  <>
                    <button className="flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-amber-400" style={{ background: 'rgba(212,168,83,0.1)', border: `1px solid rgba(212,168,83,0.3)` }}>
                      <i className="ri-play-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>Activate</button>
                    <button className="flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <i className="ri-arrow-up-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>Upgrade</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
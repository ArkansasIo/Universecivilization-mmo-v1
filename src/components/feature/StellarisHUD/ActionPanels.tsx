import { useState } from 'react';

/* ─── COLONIZE ─── */
export function ColonizePanel({ onClose }: { onClose: () => void }) {
  const [planet] = useState({ name: 'Arid III', system: 'Vega', type: 'Arid World', habitability: 60, size: 18, colonizationCost: 500 });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg overflow-hidden" style={{ width: 440, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2"><i className="ri-planet-line text-lg" style={{ color: '#3aaa5e' }}></i><span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Colonize</span></div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-close-line text-sm"></i></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="rounded p-4 text-center" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
            <div className="text-4xl mb-2">🏜️</div>
            <div className="text-lg font-bold mb-1" style={{ color: '#c8d8e8' }}>New Colony</div>
            <div className="text-sm" style={{ color: '#6b8aaa' }}>Arid Worlds · And Holds</div>
          </div>
          {[
            { label: 'Target System', value: 'And Holds', icon: 'ri-star-line' },
            { label: 'Habitability', value: '60%', icon: 'ri-heart-line' },
            { label: 'Anomalies Found', value: '3', icon: 'ri-search-eye-line' },
            { label: 'Planet Size', value: '5,300', icon: 'ri-planet-line' },
            { label: 'Colonization Cost', value: '300 → ???', icon: 'ri-coins-line' },
            { label: 'Estimated Casualties', value: 'Low', icon: 'ri-shield-line' },
          ].map(d => (
            <div key={d.label} className="flex items-center justify-between text-xs py-1.5" style={{ borderBottom: '1px solid #1d2d4060' }}>
              <div className="flex items-center gap-2"><i className={`${d.icon}`} style={{ color: '#6b8aaa' }}></i><span style={{ color: '#6b8aaa' }}>{d.label}</span></div>
              <span style={{ color: '#c8d8e8' }}>{d.value}</span>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Cancel</button>
            <button className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(58,170,94,0.15)', border: '1px solid rgba(58,170,94,0.4)', color: '#3aaa5e' }}>Colonize</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SURVEY ─── */
export function SurveyPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg overflow-hidden" style={{ width: 440, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2"><i className="ri-search-eye-line text-lg" style={{ color: '#4a9dd4' }}></i><span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Survey</span></div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-close-line text-sm"></i></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="rounded p-3" style={{ background: 'rgba(74,157,212,0.08)', border: '1px solid rgba(74,157,212,0.25)' }}>
            <div className="text-sm font-semibold mb-1" style={{ color: '#4a9dd4' }}>Survey System: Epsilon Eridani</div>
            <div className="text-xs" style={{ color: '#6b8aaa' }}>Assign a science ship to survey all bodies</div>
          </div>
          {[
            { label: 'Science Ship', value: 'ISS Explorer', icon: 'ri-microscope-line', color: '#a78bfa' },
            { label: 'Survey Progress', value: '68%', icon: 'ri-progress-3-line', color: '#4a9dd4' },
            { label: 'Anomalies Found', value: '3', icon: 'ri-star-line', color: '#c9a227' },
            { label: 'Resources Found', value: '—', icon: 'ri-copper-coin-line', color: '#3aaa5e' },
          ].map(d => (
            <div key={d.label} className="flex items-center justify-between rounded p-2.5" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
              <div className="flex items-center gap-2"><i className={d.icon} style={{ color: d.color }}></i><span className="text-xs" style={{ color: '#6b8aaa' }}>{d.label}</span></div>
              <span className="text-xs font-semibold" style={{ color: d.color }}>{d.value}</span>
            </div>
          ))}
          <div className="w-full h-2 rounded-full" style={{ background: '#1d2d40' }}>
            <div className="h-2 rounded-full" style={{ width: '68%', background: 'linear-gradient(90deg, #4a9dd4, #a78bfa)' }}></div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Cancel</button>
            <button className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(74,157,212,0.15)', border: '1px solid rgba(74,157,212,0.4)', color: '#4a9dd4' }}>Assign Science Ship</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ATTACK ─── */
export function AttackPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg overflow-hidden" style={{ width: 480, background: '#0e1520', border: '1px solid rgba(232,122,90,0.4)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(232,122,90,0.3)', background: 'rgba(232,122,90,0.08)' }}>
          <div className="flex items-center gap-2"><i className="ri-sword-fill text-lg" style={{ color: '#e87a5a' }}></i><span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Attack</span></div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-close-line text-sm"></i></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded p-3 text-center" style={{ background: 'rgba(58,170,94,0.08)', border: '1px solid rgba(58,170,94,0.25)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: '#3aaa5e' }}>Your Forces</div>
              <div className="text-2xl font-bold" style={{ color: '#3aaa5e' }}>★ 25.3K</div>
              <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>1st Strike Force · 128 ships</div>
            </div>
            <div className="rounded p-3 text-center" style={{ background: 'rgba(232,122,90,0.08)', border: '1px solid rgba(232,122,90,0.25)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: '#e87a5a' }}>Attack Target</div>
              <div className="text-lg font-bold mb-1" style={{ color: '#e87a5a' }}>Yorlon Dugam</div>
              <div className="text-xs" style={{ color: '#6b8aaa' }}>Yorlon System · ★ 12.4K</div>
            </div>
          </div>
          {[
            { label: 'Attacker Power', value: '25,300', color: '#3aaa5e' },
            { label: 'Defender Power', value: '12,400', color: '#e87a5a' },
            { label: 'Victory Probability', value: '~88%', color: '#4a9dd4' },
            { label: 'Estimated Casualties', value: 'Low', color: '#c9a227' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between text-xs py-1.5" style={{ borderBottom: '1px solid #1d2d4060' }}>
              <span style={{ color: '#6b8aaa' }}>{s.label}</span>
              <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Cancel</button>
            <button className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(232,122,90,0.15)', border: '1px solid rgba(232,122,90,0.4)', color: '#e87a5a' }}>Launch Attack</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TRADE ─── */
export function TradePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg overflow-hidden" style={{ width: 500, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2"><i className="ri-exchange-line text-lg" style={{ color: '#c9a227' }}></i><span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Trade Deal</span></div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-close-line text-sm"></i></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="rounded p-3 text-center" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)' }}>
            <div className="text-sm font-semibold" style={{ color: '#c9a227' }}>Trade Deal</div>
            <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>Affects Kethri Coalition</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'We Give', items: [{ icon: 'ri-copper-coin-line', val: '8.4K', color: '#9aa0a6' }, { icon: 'ri-tools-line', val: '12.3K', color: '#4a5a6a' }], color: '#3aaa5e' },
              { label: 'We Receive', items: [{ icon: 'ri-rocket-2-line', val: '500', color: '#a78bfa' }, { icon: 'ri-exchange-line', val: '100', color: '#c9a227' }], color: '#4a9dd4' },
            ].map(side => (
              <div key={side.label} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1d2d40' }}>
                <div className="text-xs font-semibold mb-3" style={{ color: side.color }}>{side.label}</div>
                {side.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <i className={item.icon} style={{ color: item.color }}></i>
                    <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded p-3" style={{ background: 'rgba(58,170,94,0.08)', border: '1px solid rgba(58,170,94,0.25)' }}>
            <i className="ri-bar-chart-line text-lg" style={{ color: '#3aaa5e' }}></i>
            <div>
              <div className="text-xs font-semibold" style={{ color: '#3aaa5e' }}>Deal Value: +5.4</div>
              <div className="text-xs" style={{ color: '#6b8aaa' }}>Favorable for both parties</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Cancel</button>
            <button className="flex-1 py-2 rounded text-sm font-bold cursor-pointer" style={{ background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227' }}>Confirm Trade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FEDERATION ─── */
export function FederationPanel({ onClose }: { onClose: () => void }) {
  const members = [
    { name: 'Aetherion Empire', role: 'President', contribution: 76, icon: 'ri-crown-line', color: '#c9a227' },
    { name: 'Salfing Starclave', role: 'Member', contribution: 24, icon: 'ri-shield-line', color: '#4a9dd4' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg overflow-hidden" style={{ width: 500, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2"><i className="ri-shield-star-line text-lg" style={{ color: '#3aaa5e' }}></i><span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Galactic Union</span></div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-close-line text-sm"></i></button>
        </div>
        <div className="p-4 space-y-4">
          <div className="rounded p-3" style={{ background: 'rgba(58,170,94,0.08)', border: '1px solid rgba(58,170,94,0.25)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: '#3aaa5e' }}>Galactic Union</span>
              <span className="text-xs" style={{ color: '#6b8aaa' }}>Members: 8 / 13</span>
            </div>
            <div className="text-xs" style={{ color: '#6b8aaa' }}>Founded: 2351 · President: Aetherion Empire</div>
          </div>

          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Members</div>
            {members.map(m => (
              <div key={m.name} className="flex items-center gap-3 rounded p-2.5 mb-2" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
                <i className={`${m.icon} text-sm`} style={{ color: m.color }}></i>
                <span className="flex-1 text-sm" style={{ color: '#c8d8e8' }}>{m.name}</span>
                <span className="text-xs" style={{ color: m.color }}>{m.role}</span>
                <span className="text-xs" style={{ color: '#6b8aaa' }}>{m.contribution}% contrib</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7eb8da' }}>Federation Law</div>
            {['Open Borders', 'Research Sharing', 'Combined Fleet', 'Free Trade'].map(law => (
              <div key={law} className="flex items-center justify-between rounded p-2 mb-1.5" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                <span className="text-xs" style={{ color: '#c8d8e8' }}>{law}</span>
                <i className="ri-checkbox-circle-fill text-sm" style={{ color: '#3aaa5e' }}></i>
              </div>
            ))}
          </div>

          <div className="rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: '#7eb8da' }}>Federation Level</span>
              <span className="text-xs font-bold" style={{ color: '#c9a227' }}>Lv. 3</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: '#1d2d40' }}>
              <div className="h-1.5 rounded-full" style={{ width: '74%', background: '#c9a227' }}></div>
            </div>
            <div className="text-xs mt-1" style={{ color: '#6b8aaa' }}>74% to Level 4</div>
          </div>

          <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(58,170,94,0.1)', border: '1px solid rgba(58,170,94,0.25)', color: '#3aaa5e' }}>
            Activate Relic
          </button>
          <button onClick={onClose} className="w-full py-1.5 rounded text-xs cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── RELICS ─── */
export function RelicsPanel({ onClose }: { onClose: () => void }) {
  const relics = [
    { name: 'The Zroni Archive', from: 'Aetherion Empire', power: 4, bonus: 'Precursor Relics', active: true, icon: 'ri-ancient-pavilion-line', color: '#c9a227' },
    { name: 'The Grand Compass', from: 'Precursor Ruins', power: 3, bonus: 'Precursor Relics', active: false, icon: 'ri-compass-3-line', color: '#4a9dd4' },
    { name: 'Key of the Shroud', from: 'Psionic Discovery', power: 5, bonus: 'Psionic Bonus', active: true, icon: 'ri-key-line', color: '#a78bfa' },
    { name: 'Toils of Devotion', from: 'Faith Missions', power: 2, bonus: 'Unity Boost', active: false, icon: 'ri-heart-fill', color: '#e87a5a' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg overflow-hidden" style={{ width: 500, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2"><i className="ri-ancient-pavilion-line text-lg" style={{ color: '#c9a227' }}></i><span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Relics</span><span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}>{relics.length} owned</span></div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-close-line text-sm"></i></button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 500, scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          {relics.map(r => (
            <div key={r.name} className="rounded p-3" style={{ background: r.active ? `${r.color}08` : 'rgba(0,0,0,0.25)', border: `1px solid ${r.active ? r.color + '30' : '#1d2d40'}` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}15`, border: `1px solid ${r.color}30` }}>
                  <i className={`${r.icon} text-xl`} style={{ color: r.color }}></i>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{r.name}</div>
                  <div className="text-xs" style={{ color: '#6b8aaa' }}>From: {r.from}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: r.color }}>Power {r.power}</div>
                  <div className="text-xs" style={{ color: r.active ? '#3aaa5e' : '#6b8aaa' }}>{r.active ? '● Active' : '○ Inactive'}</div>
                </div>
              </div>
              <div className="text-xs mb-2" style={{ color: '#6b8aaa' }}>Bonus: <span style={{ color: r.color }}>{r.bonus}</span></div>
              <button className="w-full py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: r.active ? 'rgba(232,122,90,0.1)' : `${r.color}15`, border: `1px solid ${r.active ? 'rgba(232,122,90,0.3)' : r.color + '30'}`, color: r.active ? '#e87a5a' : r.color }}>
                {r.active ? 'Deactivate' : 'Activate Relic'}
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 flex justify-end" style={{ borderTop: '1px solid #1d2d40' }}>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── ACHIEVEMENTS ─── */
export function AchievementsPanel({ onClose }: { onClose: () => void }) {
  const achievements = [
    { name: 'Master of the Galaxy', desc: 'Win the game on any difficulty', progress: 26, max: 100, completed: false, icon: 'ri-trophy-fill', color: '#c9a227' },
    { name: 'Technological Passages', desc: 'Research 50 technologies', progress: 47, max: 50, completed: false, icon: 'ri-flask-fill', color: '#a78bfa', pct: 75 },
    { name: 'Benevolent Ruler', desc: 'Achieve 90%+ happiness empire-wide', progress: 88, max: 90, completed: false, icon: 'ri-heart-fill', color: '#3aaa5e', pct: 75 },
    { name: 'Unstoppable Force', desc: 'Destroy 10,000 enemy ships', progress: 4820, max: 10000, completed: false, icon: 'ri-sword-fill', color: '#e87a5a', pct: 45 },
  ];
  const total = 58;
  const completed = 24;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="rounded-lg overflow-hidden" style={{ width: 500, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2"><i className="ri-medal-line text-lg" style={{ color: '#c9a227' }}></i><span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Achievements</span><span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}>{completed}/{total}</span></div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}><i className="ri-close-line text-sm"></i></button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 520, scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          <div className="rounded p-3 mb-2" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid #1d2d40' }}>
            <div className="flex justify-between mb-1 text-xs" style={{ color: '#6b8aaa' }}>
              <span>Completion</span><span>{completed}/{total} ({Math.round(completed / total * 100)}%)</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: '#1d2d40' }}>
              <div className="h-2 rounded-full" style={{ width: `${(completed / total) * 100}%`, background: 'linear-gradient(90deg, #c9a227, #e87a5a)' }}></div>
            </div>
          </div>
          {achievements.map(a => {
            const pct = a.pct ?? Math.round((a.progress / a.max) * 100);
            return (
              <div key={a.name} className="rounded p-3" style={{ background: a.completed ? `${a.color}08` : 'rgba(0,0,0,0.25)', border: `1px solid ${a.completed ? a.color + '30' : '#1d2d40'}` }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}12`, border: `1px solid ${a.color}25` }}>
                    <i className={`${a.icon} text-lg`} style={{ color: a.color }}></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{a.name}</div>
                    <div className="text-xs" style={{ color: '#6b8aaa' }}>{a.desc}</div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: a.color }}>{pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ background: '#1d2d40' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: a.color }}></div>
                </div>
              </div>
            );
          })}
          <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer mt-2" style={{ background: 'rgba(74,157,212,0.08)', border: '1px solid rgba(74,157,212,0.2)', color: '#4a9dd4' }}>View All</button>
        </div>
        <div className="p-3 flex justify-end" style={{ borderTop: '1px solid #1d2d40' }}>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

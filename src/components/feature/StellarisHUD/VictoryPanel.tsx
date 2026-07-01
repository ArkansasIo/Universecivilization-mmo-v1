const VICTORY_CONDITIONS = [
  { name: 'Domination', desc: 'Control 40% of all colonized systems', progress: 26, max: 40, unit: '% systems', color: '#e87a5a', icon: 'ri-sword-fill', rank: 1 },
  { name: 'Science', desc: 'Research 2 endgame technologies', progress: 1, max: 2, unit: 'techs', color: '#a78bfa', icon: 'ri-flask-fill', rank: 2 },
  { name: 'Federation', desc: 'Lead a Federation with 5+ members', progress: 1, max: 5, unit: 'members', color: '#3aaa5e', icon: 'ri-shield-star-fill', rank: 3 },
  { name: 'Supremacy', desc: 'Achieve the highest score in all aspects', progress: 0, max: 1, unit: 'achieved', color: '#4a9dd4', icon: 'ri-trophy-fill', rank: 4 },
  { name: 'Relics', desc: 'Collect 5 major Precursor relics', progress: 2, max: 5, unit: 'relics', color: '#c9a227', icon: 'ri-ancient-pavilion-fill', rank: 5 },
];

const SCORE_BREAKDOWN = [
  { cat: 'Economy', score: 4200, color: '#c9a227' },
  { cat: 'Military', score: 3850, color: '#e87a5a' },
  { cat: 'Science', score: 2900, color: '#a78bfa' },
  { cat: 'Exploration', score: 1800, color: '#4a9dd4' },
  { cat: 'Population', score: 1240, color: '#3aaa5e' },
];

const totalScore = SCORE_BREAKDOWN.reduce((s, c) => s + c.score, 0);

const LEADERBOARD = [
  { name: 'Aetherion Empire', score: 14050, rank: 1, you: true },
  { name: 'Zircon Hegemony', score: 12800, rank: 2, you: false },
  { name: 'Kethri Coalition', score: 9400, rank: 3, you: false },
  { name: 'Salfing Starclave', score: 7200, rank: 4, you: false },
  { name: 'Union of Sirius', score: 5800, rank: 5, you: false },
];

export default function VictoryPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 600, height: 680, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-trophy-line text-lg" style={{ color: '#c9a227' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Victory Conditions</span>
          </div>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
            <i className="ri-close-line text-sm"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          {/* Score */}
          <div className="rounded p-4" style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.25)' }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xl font-bold" style={{ color: '#c9a227' }}>{totalScore.toLocaleString()}</div>
                <div className="text-xs" style={{ color: '#6b8aaa' }}>Score Victory</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: '#c9a227' }}>#1</div>
                <div className="text-xs" style={{ color: '#6b8aaa' }}>Current Rank</div>
              </div>
            </div>
            <div className="space-y-2">
              {SCORE_BREAKDOWN.map(s => (
                <div key={s.cat} className="flex items-center gap-3">
                  <span className="text-xs w-24 flex-shrink-0" style={{ color: '#6b8aaa' }}>{s.cat}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: '#1d2d40' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(s.score / 5000) * 100}%`, background: s.color }}></div>
                  </div>
                  <span className="text-xs w-16 text-right font-semibold" style={{ color: s.color }}>{s.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Victory conditions */}
          <div>
            <div className="text-xs font-semibold mb-3" style={{ color: '#7eb8da' }}>Victory Conditions</div>
            <div className="space-y-3">
              {VICTORY_CONDITIONS.map(v => (
                <div key={v.name} className="rounded p-3" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${v.color}20` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${v.color}15` }}>
                      <i className={`${v.icon} text-sm`} style={{ color: v.color }}></i>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold" style={{ color: '#c8d8e8' }}>{v.name}</div>
                      <div className="text-xs" style={{ color: '#6b8aaa' }}>{v.desc}</div>
                    </div>
                    <div className="text-sm font-bold text-right" style={{ color: v.color }}>
                      {v.progress} / {v.max}
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: '#1d2d40' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min((v.progress / v.max) * 100, 100)}%`, background: v.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <div className="text-xs font-semibold mb-3" style={{ color: '#7eb8da' }}>Galaxy Score Ranking</div>
            <div className="space-y-2">
              {LEADERBOARD.map(l => (
                <div key={l.name} className="flex items-center gap-3 rounded p-3" style={{ background: l.you ? 'rgba(201,162,39,0.08)' : 'rgba(0,0,0,0.2)', border: `1px solid ${l.you ? 'rgba(201,162,39,0.3)' : '#1d2d40'}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: l.rank === 1 ? '#c9a227' : l.rank === 2 ? '#9aa0a6' : l.rank === 3 ? '#cd7f32' : '#1d2d40', color: l.rank <= 3 ? '#0e1520' : '#6b8aaa' }}>
                    {l.rank}
                  </div>
                  <span className="flex-1 text-sm" style={{ color: l.you ? '#c9a227' : '#c8d8e8' }}>{l.name}{l.you ? ' (You)' : ''}</span>
                  <span className="text-sm font-bold" style={{ color: l.you ? '#c9a227' : '#6b8aaa' }}>{l.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  universeData,
  UniverseData,
  RealmSystem,
  UniverseClass,
  universeClassColors,
  securityColors,
} from '@/data/realmSystems';

// ─── helpers ─────────────────────────────────────────────────────────────────
function ClassBadge({ cls }: { cls: UniverseClass }) {
  const color = universeClassColors[cls];
  return (
    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {cls}
    </span>
  );
}

function SecurityBadge({ level }: { level: RealmSystem['security'] }) {
  const color = securityColors[level];
  return (
    <span className="px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {level}
    </span>
  );
}

function ThreatBar({ level }: { level: number }) {
  const color = level <= 3 ? '#4ade80' : level <= 6 ? '#fbbf24' : level <= 8 ? '#f97316' : '#ef4444';
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-2 h-3 rounded-sm"
            style={{ background: i < level ? color : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color }}>{level}/10</span>
    </div>
  );
}

function ResourcePill({ label, value }: { label: string; value: string }) {
  const colorMap: Record<string, string> = {
    None: '#4b5563', Scarce: '#ef4444', Low: '#f97316', Normal: '#6b7280',
    Rich: '#4ade80', Abundant: '#34d399', Trace: '#fbbf24', Present: '#60a5fa',
    Overflowing: '#a78bfa',
  };
  const color = colorMap[value] || '#6b7280';
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSE SELECTION MODAL  (3-step wizard)
// ─────────────────────────────────────────────────────────────────────────────
type SelectionStep = 'universe' | 'realm' | 'confirm' | 'entering';

interface SelectionState {
  universe: UniverseData | null;
  realm: RealmSystem | null;
}

function UniverseSelectionModal({
  open,
  initialUniverse,
  initialRealm,
  onClose,
  onConfirm,
}: {
  open: boolean;
  initialUniverse: UniverseData;
  initialRealm: RealmSystem;
  onClose: () => void;
  onConfirm: (u: UniverseData, r: RealmSystem) => void;
}) {
  const [step, setStep] = useState<SelectionStep>('universe');
  const [sel, setSel] = useState<SelectionState>({ universe: initialUniverse, realm: initialRealm });
  const [uSearch, setUSearch] = useState('');
  const [uFilter, setUFilter] = useState<UniverseClass | 'All'>('All');
  const [enterProgress, setEnterProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // reset when opened
  useEffect(() => {
    if (open) {
      setStep('universe');
      setSel({ universe: initialUniverse, realm: initialRealm });
      setUSearch('');
      setUFilter('All');
      setEnterProgress(0);
    }
  }, [open, initialUniverse, initialRealm]);

  // entering animation
  useEffect(() => {
    if (step === 'entering') {
      setEnterProgress(0);
      timerRef.current = setInterval(() => {
        setEnterProgress((p) => {
          if (p >= 100) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (sel.universe && sel.realm) onConfirm(sel.universe, sel.realm);
            return 100;
          }
          return p + 2;
        });
      }, 40);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const filteredUniverses = useMemo(() => universeData.filter((u) => {
    const ms = u.name.toLowerCase().includes(uSearch.toLowerCase()) ||
      u.description.toLowerCase().includes(uSearch.toLowerCase());
    const mc = uFilter === 'All' || u.class === uFilter;
    return ms && mc;
  }), [uSearch, uFilter]);

  if (!open) return null;

  const uColor = sel.universe?.color ?? '#00d4ff';
  const rColor = sel.realm?.color ?? '#00d4ff';

  // ── Step: Universe picker ──────────────────────────────────────────────────
  const StepUniverse = () => (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="px-8 pt-8 pb-5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.15)' }}>
            <i className="ri-global-line text-cyan-400"></i>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(0,212,255,0.6)' }}>Step 1 of 3</div>
            <h2 className="text-2xl font-black text-white">Choose Your Universe</h2>
          </div>
        </div>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Select the universe where your empire will rise. Each universe has unique rules, resources, and challenges.
        </p>
        {/* search + filter */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}></i>
            <input type="text" placeholder="Search universes…" value={uSearch}
              onChange={(e) => setUSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(['All', 'Standard', 'Hardcore', 'Peaceful', 'Mythic', 'Chaos', 'Void'] as const).map((c) => {
              const col = c === 'All' ? '#00d4ff' : universeClassColors[c as UniverseClass];
              return (
                <button key={c} onClick={() => setUFilter(c as UniverseClass | 'All')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: uFilter === c ? `${col}25` : 'rgba(255,255,255,0.05)',
                    color: uFilter === c ? col : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${uFilter === c ? `${col}50` : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="flex-1 overflow-y-auto px-8 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}>
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredUniverses.map((u) => {
            const chosen = sel.universe?.id === u.id;
            const fill = Math.round((u.totalPlayers / u.maxPlayers) * 100);
            return (
              <div key={u.id} onClick={() => setSel((s) => ({ ...s, universe: u, realm: u.realms[0] }))}
                className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group"
                style={{
                  border: `2px solid ${chosen ? u.color : 'rgba(255,255,255,0.07)'}`,
                  boxShadow: chosen ? `0 0 24px ${u.color}40` : 'none',
                  background: chosen ? `${u.color}10` : 'rgba(8,13,26,0.8)',
                  transform: chosen ? 'scale(1.02)' : 'scale(1)',
                }}>
                <div className="relative h-24 overflow-hidden">
                  <img src={u.image} alt={u.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {chosen && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: u.color }}>
                      <i className="ri-check-line text-xs text-black font-black"></i>
                    </div>
                  )}
                  <div className="absolute top-2 left-2"><ClassBadge cls={u.class} /></div>
                  <div className="absolute bottom-2 left-2 text-sm font-black text-white">{u.name}</div>
                </div>
                <div className="p-3">
                  <p className="text-xs mb-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {u.description.slice(0, 60)}…
                  </p>
                  <div className="h-1 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${fill}%`, background: `linear-gradient(90deg,${u.color},${u.accentColor})` }} />
                  </div>
                  <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <span>{u.totalPlayers.toLocaleString()} players</span>
                    <span style={{ color: u.color }}>{u.age}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* footer */}
      <div className="px-8 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          Cancel
        </button>
        {sel.universe && (
          <div className="flex items-center gap-4">
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Selected: <span className="font-bold" style={{ color: sel.universe.color }}>{sel.universe.name}</span>
            </div>
            <button onClick={() => setStep('realm')}
              className="px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2"
              style={{ background: `linear-gradient(135deg,${sel.universe.color},${sel.universe.accentColor})`, color: '#000' }}>
              Choose Realm
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── Step: Realm picker ─────────────────────────────────────────────────────
  const StepRealm = () => {
    if (!sel.universe) return null;
    const u = sel.universe;
    return (
      <div className="flex flex-col h-full">
        <div className="px-8 pt-8 pb-5 flex-shrink-0">
          <button onClick={() => setStep('universe')} className="flex items-center gap-1.5 text-xs mb-4 cursor-pointer transition-all hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <i className="ri-arrow-left-line"></i> Back to Universe Selection
          </button>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `2px solid ${u.color}` }}>
              <img src={u.image} alt={u.name} className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest mb-0.5" style={{ color: `${u.color}99` }}>Step 2 of 3 — {u.name}</div>
              <h2 className="text-2xl font-black text-white">Choose Your Realm</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {u.description.slice(0, 90)}…
              </p>
            </div>
          </div>
          {/* universe characteristics */}
          <div className="flex gap-3 flex-wrap">
            {Object.entries(u.characteristics).map(([k, v]) => {
              const cm: Record<string, string> = { Sparse:'#6b7280',Normal:'#00d4ff',Dense:'#4ade80',Packed:'#fbbf24',Peaceful:'#4ade80',Moderate:'#fbbf24',Dangerous:'#f97316',Extreme:'#ef4444',Scarce:'#ef4444',Abundant:'#4ade80',Infinite:'#a78bfa',Primitive:'#6b7280',Standard:'#00d4ff',Advanced:'#4ade80',Transcendent:'#f59e0b' };
              return (
                <div key={k} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }} className="capitalize">{k}: </span>
                  <span className="font-semibold" style={{ color: cm[v] || '#fff' }}>{v}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* realm grid */}
        <div className="flex-1 overflow-y-auto px-8 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: `${u.color}33 transparent` }}>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {u.realms.map((r) => {
              const chosen = sel.realm?.id === r.id;
              return (
                <div key={r.id} onClick={() => r.isOpen && setSel((s) => ({ ...s, realm: r }))}
                  className="rounded-xl p-4 transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: chosen ? `${r.color}18` : 'rgba(255,255,255,0.03)',
                    border: `2px solid ${chosen ? r.color : 'rgba(255,255,255,0.07)'}`,
                    boxShadow: chosen ? `0 0 20px ${r.color}35` : 'none',
                    cursor: r.isOpen ? 'pointer' : 'not-allowed',
                    transform: chosen ? 'scale(1.01)' : 'scale(1)',
                  }}>
                  {!r.isOpen && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10">
                      <div className="flex flex-col items-center gap-1">
                        <i className="ri-lock-line text-2xl text-gray-400"></i>
                        <span className="text-xs text-gray-400">Locked</span>
                      </div>
                    </div>
                  )}
                  {chosen && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center z-20" style={{ background: r.color }}>
                      <i className="ri-check-line text-xs text-black font-black"></i>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}20` }}>
                      <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-tight">{r.name}</div>
                      <div className="text-xs" style={{ color: r.color }}>{r.type}</div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {r.description.slice(0, 70)}…
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <SecurityBadge level={r.security} />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const tc = r.threatLevel <= 3 ? '#4ade80' : r.threatLevel <= 6 ? '#fbbf24' : r.threatLevel <= 8 ? '#f97316' : '#ef4444';
                        return <div key={i} className="w-1.5 h-2.5 rounded-sm" style={{ background: i < r.threatLevel ? tc : 'rgba(255,255,255,0.08)' }} />;
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="rounded py-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="text-xs font-bold text-white">{r.speed}x</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Speed</div>
                    </div>
                    <div className="rounded py-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="text-xs font-bold text-white">{r.fleetSpeed}x</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Fleet</div>
                    </div>
                    <div className="rounded py-1" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="text-xs font-bold text-white">{r.researchSpeed}x</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Research</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setStep('universe')} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="ri-arrow-left-line mr-1"></i> Back
          </button>
          {sel.realm && (
            <div className="flex items-center gap-4">
              <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Realm: <span className="font-bold" style={{ color: sel.realm.color }}>{sel.realm.name}</span>
              </div>
              <button onClick={() => setStep('confirm')}
                className="px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all flex items-center gap-2"
                style={{ background: `linear-gradient(135deg,${sel.realm.color},${u.accentColor})`, color: '#000' }}>
                Review &amp; Confirm
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Step: Confirm ──────────────────────────────────────────────────────────
  const StepConfirm = () => {
    if (!sel.universe || !sel.realm) return null;
    const u = sel.universe;
    const r = sel.realm;
    const warnings: string[] = [];
    if (r.threatLevel >= 8) warnings.push('Extreme threat level — high risk of losing ships and resources');
    if (r.security === 'Null') warnings.push('Null security — no protection from attacks at any time');
    if (r.security === 'Anomalous') warnings.push('Anomalous space — unpredictable physics and random events');
    if (u.class === 'Hardcore') warnings.push('Hardcore universe — permanent consequences for defeat');
    if (u.class === 'Chaos') warnings.push('Chaos universe — rules change randomly without warning');

    return (
      <div className="flex flex-col h-full">
        <div className="px-8 pt-8 pb-5 flex-shrink-0">
          <button onClick={() => setStep('realm')} className="flex items-center gap-1.5 text-xs mb-4 cursor-pointer transition-all hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <i className="ri-arrow-left-line"></i> Back to Realm Selection
          </button>
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: `${r.color}99` }}>Step 3 of 3</div>
          <h2 className="text-2xl font-black text-white mb-1">Confirm Your Selection</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Review your choices carefully. Once you enter a realm, your empire will be bound to it.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-4" style={{ scrollbarWidth: 'thin', scrollbarColor: `${r.color}33 transparent` }}>
          <div className="grid grid-cols-2 gap-5 mb-5">
            {/* Universe summary */}
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${u.color}40` }}>
              <div className="relative h-36">
                <img src={u.image} alt={u.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: `${u.color}cc` }}>Universe</div>
                  <div className="text-xl font-black text-white">{u.name}</div>
                </div>
                <div className="absolute top-3 right-3"><ClassBadge cls={u.class} /></div>
              </div>
              <div className="p-4" style={{ background: `${u.color}08` }}>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(u.characteristics).map(([k, v]) => {
                    const cm: Record<string, string> = { Sparse:'#6b7280',Normal:'#00d4ff',Dense:'#4ade80',Packed:'#fbbf24',Peaceful:'#4ade80',Moderate:'#fbbf24',Dangerous:'#f97316',Extreme:'#ef4444',Scarce:'#ef4444',Abundant:'#4ade80',Infinite:'#a78bfa',Primitive:'#6b7280',Standard:'#00d4ff',Advanced:'#4ade80',Transcendent:'#f59e0b' };
                    return (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="capitalize" style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                        <span className="font-semibold" style={{ color: cm[v] || '#fff' }}>{v}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Players</span>
                    <span className="font-semibold text-white">{u.totalPlayers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>Age</span>
                    <span className="font-semibold" style={{ color: u.color }}>{u.age}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Realm summary */}
            <div className="rounded-2xl p-5" style={{ background: `${r.color}08`, border: `1px solid ${r.color}40` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}20`, border: `1px solid ${r.color}40` }}>
                  <i className={`${r.icon} text-2xl`} style={{ color: r.color }}></i>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: `${r.color}99` }}>Realm</div>
                  <div className="text-xl font-black text-white">{r.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: r.color }}>{r.type}</span>
                    <SecurityBadge level={r.security} />
                  </div>
                </div>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>{r.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Threat Level</span>
                  <ThreatBar level={r.threatLevel} />
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Players</span>
                  <span className="font-semibold text-white">{r.playerCount.toLocaleString()} / {r.maxPlayers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Dominant Faction</span>
                  <span className="font-semibold text-white">{r.dominantFaction}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Speed multipliers */}
          <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Active Multipliers in This Realm</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Universe Speed', value: r.speed, icon: 'ri-time-line', color: '#00d4ff' },
                { label: 'Fleet Speed', value: r.fleetSpeed, icon: 'ri-rocket-2-line', color: '#f87171' },
                { label: 'Research Speed', value: r.researchSpeed, icon: 'ri-flask-line', color: '#4ade80' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                  <i className={`${s.icon} text-xl mb-1`} style={{ color: s.color }}></i>
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}x</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Resource Availability</div>
            <div className="grid grid-cols-5 gap-2">
              <ResourcePill label="Metal" value={r.resources.metal} />
              <ResourcePill label="Crystal" value={r.resources.crystal} />
              <ResourcePill label="Deuterium" value={r.resources.deuterium} />
              <ResourcePill label="Dark Matter" value={r.resources.darkMatter} />
              <ResourcePill label="Exotic" value={r.resources.exoticMatter} />
            </div>
          </div>

          {/* Special features */}
          <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Special Features</div>
            <div className="flex flex-wrap gap-2">
              {r.specialFeatures.map((f) => (
                <span key={f} className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30` }}>
                  <i className="ri-star-line mr-1"></i>{f}
                </span>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="flex items-center gap-2 mb-3">
                <i className="ri-alert-line text-red-400"></i>
                <span className="text-sm font-bold text-red-400">Warnings</span>
              </div>
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(239,68,68,0.8)' }}>
                    <i className="ri-error-warning-line mt-0.5 flex-shrink-0"></i>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-5 flex items-center justify-between flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setStep('realm')} className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <i className="ri-arrow-left-line mr-1"></i> Back
          </button>
          <button onClick={() => setStep('entering')}
            className="px-8 py-3 rounded-xl text-base font-black cursor-pointer transition-all flex items-center gap-3 hover:opacity-90"
            style={{ background: `linear-gradient(135deg,${r.color},${u.accentColor})`, color: '#000' }}>
            <i className="ri-rocket-2-line text-lg"></i>
            Enter {r.name}
          </button>
        </div>
      </div>
    );
  };

  // ── Step: Entering animation ───────────────────────────────────────────────
  const StepEntering = () => {
    if (!sel.universe || !sel.realm) return null;
    const u = sel.universe;
    const r = sel.realm;
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center relative overflow-hidden">
        {/* animated bg */}
        <div className="absolute inset-0">
          <img src={u.image} alt="" className="w-full h-full object-cover object-top opacity-20" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${r.color}15 0%, #070c1a 70%)` }} />
        </div>

        {/* pulsing ring */}
        <div className="relative z-10 mb-8">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {[1, 2, 3].map((ring) => (
              <div key={ring} className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${r.color}`,
                  opacity: 0.3 / ring,
                  animation: `ping ${ring * 0.8}s cubic-bezier(0,0,0.2,1) infinite`,
                  animationDelay: `${ring * 0.2}s`,
                }} />
            ))}
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: `${r.color}20`, border: `2px solid ${r.color}` }}>
              <i className={`${r.icon} text-4xl`} style={{ color: r.color }}></i>
            </div>
          </div>
        </div>

        <div className="relative z-10 mb-2">
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: `${r.color}99` }}>
            Entering {u.name}
          </div>
          <h2 className="text-4xl font-black text-white mb-1">{r.name}</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Initializing dimensional gateway…
          </p>
        </div>

        {/* progress bar */}
        <div className="relative z-10 w-80 mt-8">
          <div className="h-2 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-100"
              style={{ width: `${enterProgress}%`, background: `linear-gradient(90deg,${r.color},${u.accentColor})` }} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <span>{enterProgress < 30 ? 'Calibrating coordinates…' : enterProgress < 60 ? 'Opening dimensional rift…' : enterProgress < 90 ? 'Synchronizing empire data…' : 'Arrival imminent…'}</span>
            <span style={{ color: r.color }}>{enterProgress}%</span>
          </div>
        </div>

        <style>{`
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
        `}</style>
      </div>
    );
  };

  // ── Modal shell ────────────────────────────────────────────────────────────
  const stepColors: Record<SelectionStep, string> = {
    universe: '#00d4ff',
    realm: rColor,
    confirm: rColor,
    entering: rColor,
  };
  const borderColor = stepColors[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full flex flex-col"
        style={{
          maxWidth: step === 'entering' ? 560 : 1100,
          height: step === 'entering' ? 480 : '88vh',
          maxHeight: 820,
          background: 'linear-gradient(135deg,#070c1a 0%,#0b0e1f 100%)',
          border: `1px solid ${borderColor}30`,
          borderRadius: 20,
          boxShadow: `0 0 80px ${borderColor}20`,
          overflow: 'hidden',
          transition: 'max-width 0.4s ease, height 0.4s ease',
        }}>

        {/* step indicator (not shown during entering) */}
        {step !== 'entering' && (
          <div className="absolute top-5 right-6 flex items-center gap-2 z-20">
            {(['universe', 'realm', 'confirm'] as const).map((s, i) => {
              const done = ['universe', 'realm', 'confirm'].indexOf(step) > i;
              const active = step === s;
              const col = active ? borderColor : done ? '#4ade80' : 'rgba(255,255,255,0.15)';
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all"
                    style={{ background: active ? `${col}25` : done ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${col}`, color: col }}>
                    {done ? <i className="ri-check-line text-xs"></i> : i + 1}
                  </div>
                  {i < 2 && <div className="w-6 h-px" style={{ background: done ? '#4ade80' : 'rgba(255,255,255,0.1)' }} />}
                </div>
              );
            })}
            <button onClick={onClose} className="ml-3 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>
        )}

        {step === 'universe' && <StepUniverse />}
        {step === 'realm' && <StepRealm />}
        {step === 'confirm' && <StepConfirm />}
        {step === 'entering' && <StepEntering />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REALM DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────
function RealmDetailPanel({
  realm,
  universe,
  onEnter,
}: {
  realm: RealmSystem;
  universe: UniverseData;
  onEnter: () => void;
}) {
  return (
    <div className="rounded-2xl p-5 h-full flex flex-col"
      style={{ background: 'rgba(8,13,26,0.95)', border: `1px solid ${realm.color}40`, boxShadow: `0 0 40px ${realm.color}15` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${realm.color}20`, border: `1px solid ${realm.color}40` }}>
          <i className={`${realm.icon} text-xl`} style={{ color: realm.color }}></i>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">{realm.name}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs" style={{ color: realm.color }}>{realm.type}</span>
            <span className="text-gray-600">•</span>
            <SecurityBadge level={realm.security} />
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{realm.description}</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Galaxies', value: realm.galaxyCount, icon: 'ri-global-line', color: '#38bdf8' },
          { label: 'Star Systems', value: `${(realm.starSystemCount / 1000).toFixed(1)}K`, icon: 'ri-star-line', color: '#fbbf24' },
          { label: 'Planets', value: `${(realm.planetCount / 1000).toFixed(1)}K`, icon: 'ri-planet-line', color: '#4ade80' },
          { label: 'Players', value: realm.playerCount.toLocaleString(), icon: 'ri-user-line', color: '#a78bfa' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <i className={`${s.icon} text-xs`} style={{ color: s.color }}></i>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
            </div>
            <div className="text-sm font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Speed Multipliers</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Universe', value: realm.speed, icon: 'ri-time-line', color: '#00d4ff' },
            { label: 'Fleet', value: realm.fleetSpeed, icon: 'ri-rocket-2-line', color: '#f87171' },
            { label: 'Research', value: realm.researchSpeed, icon: 'ri-flask-line', color: '#4ade80' },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-2 text-center" style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
              <i className={`${s.icon} text-base mb-0.5`} style={{ color: s.color }}></i>
              <div className="text-base font-black" style={{ color: s.color }}>{s.value}x</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Resources</div>
        <div className="rounded-lg p-2.5 grid grid-cols-5 gap-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ResourcePill label="Metal" value={realm.resources.metal} />
          <ResourcePill label="Crystal" value={realm.resources.crystal} />
          <ResourcePill label="Deut." value={realm.resources.deuterium} />
          <ResourcePill label="Dark M." value={realm.resources.darkMatter} />
          <ResourcePill label="Exotic" value={realm.resources.exoticMatter} />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Threat Level</div>
        <ThreatBar level={realm.threatLevel} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {realm.specialFeatures.map((f) => (
          <span key={f} className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: `${realm.color}15`, color: realm.color, border: `1px solid ${realm.color}30` }}>
            {f}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto space-y-2">
        <button onClick={onEnter}
          className="w-full py-3 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          style={{
            background: realm.isOpen ? `linear-gradient(135deg,${realm.color},${universe.accentColor})` : 'rgba(255,255,255,0.05)',
            color: realm.isOpen ? '#000' : 'rgba(255,255,255,0.3)',
            cursor: realm.isOpen ? 'pointer' : 'not-allowed',
          }}
          disabled={!realm.isOpen}>
          {realm.isOpen
            ? <><i className="ri-rocket-2-line"></i> Enter Realm</>
            : <><i className="ri-lock-line"></i> Realm Locked</>}
        </button>
        {realm.isOpen && (
          <button onClick={onEnter}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <i className="ri-settings-3-line"></i>
            Open Universe Selection Wizard
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REALM CARD (browse grid)
// ─────────────────────────────────────────────────────────────────────────────
function RealmCard({ realm, selected, onClick }: { realm: RealmSystem; selected: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className="rounded-xl p-4 cursor-pointer transition-all duration-200 relative overflow-hidden"
      style={{
        background: selected ? `${realm.color}18` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? realm.color : 'rgba(255,255,255,0.07)'}`,
        boxShadow: selected ? `0 0 20px ${realm.color}30` : 'none',
      }}>
      {!realm.isOpen && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10">
          <div className="flex flex-col items-center gap-1">
            <i className="ri-lock-line text-2xl text-gray-400"></i>
            <span className="text-xs text-gray-400">Locked</span>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${realm.color}20` }}>
            <i className={`${realm.icon} text-sm`} style={{ color: realm.color }}></i>
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">{realm.name}</div>
            <div className="text-xs" style={{ color: realm.color }}>{realm.type}</div>
          </div>
        </div>
        <SecurityBadge level={realm.security} />
      </div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{realm.description.slice(0, 70)}…</p>
      <div className="mb-3">
        <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Threat</div>
        <ThreatBar level={realm.threatLevel} />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div>
          <div className="text-xs font-bold text-white">{realm.galaxyCount}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Galaxies</div>
        </div>
        <div>
          <div className="text-xs font-bold text-white">{(realm.starSystemCount / 1000).toFixed(1)}K</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Systems</div>
        </div>
        <div>
          <div className="text-xs font-bold text-white">{realm.playerCount.toLocaleString()}</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Players</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {realm.specialFeatures.slice(0, 2).map((f) => (
          <span key={f} className="px-1.5 py-0.5 rounded text-xs" style={{ background: `${realm.color}15`, color: realm.color }}>{f}</span>
        ))}
        {realm.specialFeatures.length > 2 && (
          <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>+{realm.specialFeatures.length - 2}</span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIVERSE CARD (sidebar)
// ─────────────────────────────────────────────────────────────────────────────
function UniverseCard({ universe, selected, onClick }: { universe: UniverseData; selected: boolean; onClick: () => void }) {
  const fillPct = Math.round((universe.totalPlayers / universe.maxPlayers) * 100);
  return (
    <div onClick={onClick} className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group"
      style={{
        border: `1px solid ${selected ? universe.color : 'rgba(255,255,255,0.07)'}`,
        boxShadow: selected ? `0 0 30px ${universe.color}30` : 'none',
        background: 'rgba(8,13,26,0.8)',
      }}>
      <div className="relative h-28 overflow-hidden">
        <img src={universe.image} alt={universe.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-2 left-2"><ClassBadge cls={universe.class} /></div>
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(0,0,0,0.7)', color: universe.color }}>{universe.age}</div>
        <div className="absolute bottom-2 left-3 text-base font-black text-white">{universe.name}</div>
      </div>
      <div className="p-3">
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{universe.description.slice(0, 80)}…</p>
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Players</span>
            <span style={{ color: universe.color }}>{universe.totalPlayers.toLocaleString()} / {universe.maxPlayers.toLocaleString()}</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, background: `linear-gradient(90deg,${universe.color},${universe.accentColor})` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="rounded-lg py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-sm font-bold" style={{ color: universe.color }}>10</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Realms</div>
          </div>
          <div className="rounded-lg py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="text-sm font-bold text-white">{universe.realms.filter((r) => r.isOpen).length}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Open</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE SELECTION BANNER
// ─────────────────────────────────────────────────────────────────────────────
function ActiveSelectionBanner({
  universe,
  realm,
  onChange,
}: {
  universe: UniverseData;
  realm: RealmSystem;
  onChange: () => void;
}) {
  return (
    <div className="mx-6 mt-4 rounded-2xl overflow-hidden flex items-center gap-0"
      style={{ border: `1px solid ${realm.color}40`, background: `${realm.color}08` }}>
      <div className="relative w-24 h-16 flex-shrink-0">
        <img src={universe.image} alt={universe.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
      </div>
      <div className="flex-1 px-4 py-3">
        <div className="flex items-center gap-2 mb-0.5">
          <i className="ri-checkbox-circle-fill text-sm" style={{ color: '#4ade80' }}></i>
          <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>Active Selection</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <span style={{ color: universe.color }}>{universe.name}</span>
          <i className="ri-arrow-right-s-line" style={{ color: 'rgba(255,255,255,0.3)' }}></i>
          <span style={{ color: realm.color }}>{realm.name}</span>
          <SecurityBadge level={realm.security} />
        </div>
      </div>
      <div className="flex items-center gap-2 pr-4">
        <div className="grid grid-cols-3 gap-2 text-center mr-2">
          {[
            { label: 'Speed', value: `${realm.speed}x`, color: '#00d4ff' },
            { label: 'Fleet', value: `${realm.fleetSpeed}x`, color: '#f87171' },
            { label: 'Research', value: `${realm.researchSpeed}x`, color: '#4ade80' },
          ].map((s) => (
            <div key={s.label} className="px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-xs font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <button onClick={onChange}
          className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
          style={{ background: `${realm.color}20`, color: realm.color, border: `1px solid ${realm.color}40` }}>
          <i className="ri-edit-line mr-1"></i>Change
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function RealmsPage() {
  const [selectedUniverseId, setSelectedUniverseId] = useState('u1');
  const [selectedRealmId, setSelectedRealmId] = useState('u1-r1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<UniverseClass | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeUniverse, setActiveUniverse] = useState<UniverseData>(universeData[0]);
  const [activeRealm, setActiveRealm] = useState<RealmSystem>(universeData[0].realms[0]);
  const [hasActive, setHasActive] = useState(false);

  const selectedUniverse = useMemo(() => universeData.find((u) => u.id === selectedUniverseId) ?? universeData[0], [selectedUniverseId]);
  const selectedRealm = useMemo(() => selectedUniverse.realms.find((r) => r.id === selectedRealmId) ?? selectedUniverse.realms[0], [selectedUniverse, selectedRealmId]);

  const filteredUniverses = useMemo(() => universeData.filter((u) => {
    const ms = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.description.toLowerCase().includes(searchQuery.toLowerCase());
    const mc = filterClass === 'All' || u.class === filterClass;
    return ms && mc;
  }), [searchQuery, filterClass]);

  const universeClasses: Array<UniverseClass | 'All'> = ['All', 'Standard', 'Hardcore', 'Peaceful', 'Chaos', 'Ancient', 'Void', 'Primordial', 'Quantum', 'Temporal', 'Mythic'];

  const totalStats = useMemo(() => ({
    universes: universeData.length,
    realms: universeData.reduce((s, u) => s + u.realms.length, 0),
    players: universeData.reduce((s, u) => s + u.totalPlayers, 0),
    openRealms: universeData.reduce((s, u) => s + u.realms.filter((r) => r.isOpen).length, 0),
  }), []);

  const handleConfirm = (u: UniverseData, r: RealmSystem) => {
    setActiveUniverse(u);
    setActiveRealm(r);
    setHasActive(true);
    setModalOpen(false);
    // also sync the browse view
    setSelectedUniverseId(u.id);
    setSelectedRealmId(r.id);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#070c1a 0%,#0b0e1f 50%,#090d1b 100%)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#0a0f1e 0%,#070c1a 100%)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="absolute inset-0 opacity-20">
          <img src="https://readdy.ai/api/search-image?query=multiple%20universes%20side%20by%20side%20cosmic%20multiverse%20dimensional%20portals%20galaxies%20floating%20in%20void%20epic%20scale%20space%20art&width=1920&height=400&seq=realms-hero&orientation=landscape"
            alt="Realms Hero" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>
        <div className="relative z-10 px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
                <i className="ri-earth-line text-xl text-cyan-400"></i>
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-wider">REALM SYSTEMS</h1>
                <p className="text-sm" style={{ color: 'rgba(0,212,255,0.7)' }}>Universe-Empire-Dominions — 30 Universes × 10 Realms</p>
              </div>
            </div>
            <button onClick={openModal}
              className="px-6 py-3 rounded-xl font-black text-sm cursor-pointer transition-all flex items-center gap-2 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#00d4ff,#0891b2)', color: '#000' }}>
              <i className="ri-rocket-2-line text-base"></i>
              {hasActive ? 'Change Universe & Realm' : 'Select Universe & Realm'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
            {[
              { label: 'Universes', value: totalStats.universes, icon: 'ri-global-line', color: '#00d4ff' },
              { label: 'Total Realms', value: totalStats.realms, icon: 'ri-layout-4-line', color: '#a78bfa' },
              { label: 'Open Realms', value: totalStats.openRealms, icon: 'ri-door-open-line', color: '#4ade80' },
              { label: 'Total Players', value: `${(totalStats.players / 1000).toFixed(0)}K`, icon: 'ri-user-line', color: '#fbbf24' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                <div className="flex items-center gap-2 mb-1">
                  <i className={`${s.icon} text-sm`} style={{ color: s.color }}></i>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                </div>
                <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active selection banner */}
      {hasActive && (
        <ActiveSelectionBanner universe={activeUniverse} realm={activeRealm} onChange={openModal} />
      )}

      {/* Main 3-panel layout */}
      <div className="flex" style={{ height: hasActive ? 'calc(100vh - 340px)' : 'calc(100vh - 260px)', minHeight: 520 }}>
        {/* Left: universe list */}
        <div className="w-72 flex-shrink-0 flex flex-col" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,13,26,0.6)' }}>
          <div className="p-3 space-y-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}></i>
              <input type="text" placeholder="Search universes…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg text-sm bg-transparent text-white placeholder-gray-600 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div className="flex gap-1 flex-wrap">
              {['All', 'Standard', 'Hardcore', 'Peaceful', 'Mythic'].map((cls) => (
                <button key={cls} onClick={() => setFilterClass(cls as UniverseClass | 'All')}
                  className="px-2 py-0.5 rounded text-xs cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: filterClass === cls ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)',
                    color: filterClass === cls ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${filterClass === cls ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {cls}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}>
            {filteredUniverses.map((u) => (
              <UniverseCard key={u.id} universe={u} selected={selectedUniverseId === u.id}
                onClick={() => { setSelectedUniverseId(u.id); setSelectedRealmId(u.realms[0].id); }} />
            ))}
          </div>
        </div>

        {/* Center: realm grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: `${selectedUniverse.color}08` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `1px solid ${selectedUniverse.color}40` }}>
                <img src={selectedUniverse.image} alt={selectedUniverse.name} className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white">{selectedUniverse.name}</h2>
                  <ClassBadge cls={selectedUniverse.class} />
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span><i className="ri-user-line mr-1"></i>{selectedUniverse.totalPlayers.toLocaleString()} players</span>
                  <span><i className="ri-calendar-line mr-1"></i>Launched {selectedUniverse.launchDate}</span>
                  <span style={{ color: selectedUniverse.color }}>{selectedUniverse.age}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                {(['grid', 'list'] as const).map((mode) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className="px-3 py-1.5 text-xs cursor-pointer transition-all"
                    style={{ background: viewMode === mode ? 'rgba(0,212,255,0.15)' : 'transparent', color: viewMode === mode ? '#00d4ff' : 'rgba(255,255,255,0.4)' }}>
                    <i className={mode === 'grid' ? 'ri-grid-line' : 'ri-list-check'}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 py-2 flex items-center gap-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}>
            {Object.entries(selectedUniverse.characteristics).map(([key, val]) => {
              const cm: Record<string, string> = { Sparse:'#6b7280',Normal:'#00d4ff',Dense:'#4ade80',Packed:'#fbbf24',Peaceful:'#4ade80',Moderate:'#fbbf24',Dangerous:'#f97316',Extreme:'#ef4444',Scarce:'#ef4444',Abundant:'#4ade80',Infinite:'#a78bfa',Primitive:'#6b7280',Standard:'#00d4ff',Advanced:'#4ade80',Transcendent:'#f59e0b' };
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.4)' }}>{key}:</span>
                  <span className="text-xs font-semibold" style={{ color: cm[val] || '#fff' }}>{val}</span>
                </div>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}>
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 xl:grid-cols-3 gap-3' : 'space-y-2'}>
              {selectedUniverse.realms.map((realm) => (
                <RealmCard key={realm.id} realm={realm} selected={selectedRealmId === realm.id}
                  onClick={() => setSelectedRealmId(realm.id)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: realm detail */}
        <div className="w-80 flex-shrink-0 overflow-y-auto p-3"
          style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,212,255,0.2) transparent' }}>
          <RealmDetailPanel realm={selectedRealm} universe={selectedUniverse} onEnter={openModal} />
        </div>
      </div>

      {/* Bottom class filter bar */}
      <div className="px-6 py-3 flex items-center gap-2 overflow-x-auto"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,13,26,0.8)', scrollbarWidth: 'none' }}>
        <span className="text-xs font-semibold uppercase tracking-wider flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>Filter:</span>
        {universeClasses.map((cls) => {
          const color = cls === 'All' ? '#00d4ff' : universeClassColors[cls as UniverseClass];
          const count = cls === 'All' ? universeData.length : universeData.filter((u) => u.class === cls).length;
          return (
            <button key={cls} onClick={() => setFilterClass(cls)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex-shrink-0 whitespace-nowrap"
              style={{
                background: filterClass === cls ? `${color}20` : 'rgba(255,255,255,0.04)',
                color: filterClass === cls ? color : 'rgba(255,255,255,0.4)',
                border: `1px solid ${filterClass === cls ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
              }}>
              {cls}
              <span className="px-1.5 py-0.5 rounded-full text-xs"
                style={{ background: filterClass === cls ? `${color}30` : 'rgba(255,255,255,0.08)', color: filterClass === cls ? color : 'rgba(255,255,255,0.3)' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Universe Selection Modal */}
      <UniverseSelectionModal
        open={modalOpen}
        initialUniverse={selectedUniverse}
        initialRealm={selectedRealm}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

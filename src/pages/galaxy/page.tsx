import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import SpaceCanvas from '@/components/feature/SpaceCanvas';
import { Planet3D, Star3D } from '@/components/feature/Planet3D';
import type { PlanetType, StarType } from '@/components/feature/Planet3D';

// ── Types ──────────────────────────────────────────────────────────────────
interface PlanetRow {
  position: number;
  planetDbId: number | null;
  planetUserId: string | null;
  planetName: string | null;
  planetType: string | null;
  hasPlayer: boolean;
  isOwnPlanet: boolean;
  playerName: string | null;
  allianceTag: string | null;
  allianceName: string | null;
  rank: number | null;
  points: number | null;
  status: 'active' | 'inactive' | 'vacation' | 'banned' | 'newbie' | null;
  activityMinutes: number | null;
  moon: boolean;
  moonHasBase: boolean;
  debris: { metal: number; crystal: number; deuterium: number } | null;
  debrisId: number | null;
}

interface SpyReport {
  coordinates: string;
  player: string;
  metal: number;
  crystal: number;
  deuterium: number;
  energy: number;
  fleet: { type: string; count: number }[];
  defenses: { type: string; count: number }[];
  buildings: { name: string; level: number }[];
  detected: boolean;
}

interface FleetDispatch {
  coordinates: string;
  player: string;
  mission: 'attack' | 'transport' | 'deploy' | 'colonize' | 'harvest' | 'spy' | 'expedition';
  debris?: { metal: number; crystal: number; deuterium: number };
  debrisId?: number | null;
}

// ── Status helpers ─────────────────────────────────────────────────────────
function statusBadge(status: PlanetRow['status']) {
  if (!status) return <span className="text-xs text-ogame-dim">—</span>;
  const map: Record<string, { label: string; bg: string; text: string }> = {
    active:   { label: 'Active',    bg: 'bg-green-500/20',  text: 'text-green-400' },
    inactive: { label: 'Inactive',  bg: 'bg-gray-500/20',   text: 'text-gray-400' },
    vacation: { label: 'Vacation',  bg: 'bg-amber-500/20',  text: 'text-amber-400' },
    banned:   { label: 'Banned',    bg: 'bg-red-500/20',    text: 'text-red-400' },
    newbie:   { label: 'Protected', bg: 'bg-amber-500/20',  text: 'text-amber-400' },
  };
  const s = map[status];
  return <span className={`text-xs px-1.5 py-0.5 rounded ${s.bg} ${s.text} font-medium whitespace-nowrap`}>{s.label}</span>;
}

// ── Spy Report Modal ───────────────────────────────────────────────────────
function SpyReportModal({ report, onClose }: { report: SpyReport; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{ background: '#080b0f', border: '1px solid rgba(212,168,83,0.4)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-amber-400/20">
          <div>
            <h2 className="text-sm font-bold text-amber-400">Espionage Report</h2>
            <p className="text-xs text-ogame-muted mt-0.5">{report.coordinates} · {report.player}</p>
          </div>
          <div className="flex items-center gap-3">
            {report.detected && (
              <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                Detected
              </span>
            )}
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-ogame-muted hover:text-white hover:bg-white/10 cursor-pointer">
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Resources</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Metal', val: report.metal, color: '#fcd34d', icon: 'ri-copper-coin-line' },
                { label: 'Crystal', val: report.crystal, color: '#5bc0be', icon: 'ri-drop-line' },
                { label: 'Deuterium', val: report.deuterium, color: '#4ade80', icon: 'ri-drop-line' },
                { label: 'Energy', val: report.energy, color: '#e2c044', icon: 'ri-flashlight-line' },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                  <i className={`${r.icon} text-sm`} style={{ color: r.color }}></i>
                  <div>
                    <p className="text-xs text-ogame-muted">{r.label}</p>
                    <p className="text-sm font-bold text-white">{r.val.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {report.fleet.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Fleet</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {report.fleet.map((f, i) => (
                  <div key={i} className="flex items-center justify-between bg-red-400/5 border border-red-400/15 rounded px-3 py-1.5">
                    <span className="text-xs text-ogame-muted">{f.type}</span>
                    <span className="text-xs font-bold text-red-400">{f.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {report.defenses.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Defenses</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {report.defenses.map((d, i) => (
                  <div key={i} className="flex items-center justify-between bg-orange-400/5 border border-orange-400/15 rounded px-3 py-1.5">
                    <span className="text-xs text-ogame-muted">{d.type}</span>
                    <span className="text-xs font-bold text-orange-400">{d.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {report.buildings.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Buildings</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {report.buildings.map((b, i) => (
                  <div key={i} className="flex items-center justify-between bg-teal-400/5 border border-teal-400/15 rounded px-3 py-1.5">
                    <span className="text-xs text-ogame-muted">{b.name}</span>
                    <span className="text-xs font-bold text-teal-400">Lv.{b.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-amber-400/10 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-1.5 text-xs rounded border border-white/10 text-ogame-muted hover:bg-white/5 cursor-pointer whitespace-nowrap">Close</button>
          <button className="px-4 py-1.5 text-xs rounded bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 cursor-pointer whitespace-nowrap">
            <i className="ri-sword-line mr-1"></i>Attack
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Harvest Recycler Dispatch Modal ───────────────────────────────────────
function HarvestDispatchModal({ dispatch, onClose }: { dispatch: FleetDispatch; onClose: () => void }) {
  const { user } = useAuth();
  const [recyclerCount, setRecyclerCount] = useState(1);
  const [availableRecyclers, setAvailableRecyclers] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadRecyclers = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('ships')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('ship_type', 'recycler')
        .maybeSingle();
      setAvailableRecyclers(data?.quantity || 0);
    };
    loadRecyclers();
  }, [user]);

  const RECYCLER_CARGO = 20000;
  const totalCargo = recyclerCount * RECYCLER_CARGO;
  const debris = dispatch.debris || { metal: 0, crystal: 0, deuterium: 0 };
  const totalDebris = debris.metal + debris.crystal + debris.deuterium;
  const willClear = totalCargo >= totalDebris;

  const handleSendRecyclers = async () => {
    if (!user) {
      setError('You must be logged in to send recyclers.');
      return;
    }
    if (recyclerCount <= 0 || recyclerCount > availableRecyclers) {
      setError(`You only have ${availableRecyclers} recycler(s) available.`);
      return;
    }

    setSending(true);
    setError(null);

    try {
      const coordsMatch = dispatch.coordinates.match(/\[?(\d+):(\d+):(\d+)\]?/);
      if (!coordsMatch) {
        setError('Invalid coordinates format.');
        setSending(false);
        return;
      }

      const targetCoords = {
        galaxy: parseInt(coordsMatch[1]),
        system: parseInt(coordsMatch[2]),
        planet: parseInt(coordsMatch[3]),
      };

      const { data: homeworld } = await supabase
        .from('planets')
        .select('id, position_galaxy, position_system, position_planet')
        .eq('user_id', user.id)
        .eq('is_homeworld', true)
        .maybeSingle();

      const { data: newFleet, error: fleetErr } = await supabase
        .from('fleets')
        .insert({
          user_id: user.id,
          player_id: user.id,
          name: `Recycler Fleet → ${dispatch.coordinates}`,
          mission: 'recycle',
          status: 'moving',
          origin_planet_id: homeworld?.id || null,
          dest_galaxy: targetCoords.galaxy,
          dest_system: targetCoords.system,
          dest_planet: targetCoords.planet,
          dest_coords: dispatch.coordinates,
          ships: { recycler: recyclerCount },
          total_ships: recyclerCount,
          cargo_metal: 0,
          cargo_crystal: 0,
          cargo_deuterium: 0,
          departure_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (fleetErr) throw new Error(fleetErr.message);

      if (availableRecyclers > 0) {
        await supabase
          .from('ships')
          .update({ quantity: Math.max(0, availableRecyclers - recyclerCount) })
          .eq('user_id', user.id)
          .eq('ship_type', 'recycler');
      }

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/process-fleet-mission`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
            'apikey': (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, ''),
          },
          body: JSON.stringify({
            fleet_id: newFleet.id,
            mission_type: 'recycle',
            target_coords: targetCoords,
            cargo: { metal: 0, crystal: 0, deuterium: 0 },
            hold_time: 0,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Dispatch failed');

      setSuccess(true);
      setTimeout(() => { onClose(); }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch recyclers.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl overflow-hidden"
        style={{ background: '#080b0f', border: '1px solid rgba(212,168,83,0.4)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-amber-400/20">
          <div>
            <h2 className="text-sm font-bold text-amber-400">
              <i className="ri-recycle-line mr-1.5"></i>Harvest Debris Field
            </h2>
            <p className="text-xs text-ogame-muted mt-0.5">→ {dispatch.coordinates}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-ogame-muted hover:text-white hover:bg-white/10 cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 mb-4">
              <i className="ri-check-line text-2xl text-amber-400"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Recyclers Dispatched!</h3>
            <p className="text-sm text-ogame-muted">
              {recyclerCount} recycler{recyclerCount > 1 ? 's' : ''} en route to {dispatch.coordinates}
            </p>
            <p className="text-xs text-amber-400 mt-2">
              They will automatically harvest the debris upon arrival.
            </p>
          </div>
        ) : (
          <>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg" style={{ background: 'rgba(212,168,83,0.06)', border: '1px solid rgba(212,168,83,0.2)' }}>
                <div className="text-center">
                  <p className="text-xs text-ogame-muted">Metal</p>
                  <p className="text-sm font-bold text-yellow-400">{debris.metal.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-ogame-muted">Crystal</p>
                  <p className="text-sm font-bold text-teal-400">{debris.crystal.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-ogame-muted">Deuterium</p>
                  <p className="text-sm font-bold text-green-400">{debris.deuterium.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-ogame-muted uppercase tracking-wider">Send Recyclers</h3>
                  <span className="text-xs text-ogame-dim">Available: {availableRecyclers}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRecyclerCount(Math.max(1, recyclerCount - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-ogame-muted cursor-pointer"
                  ><i className="ri-subtract-line"></i></button>
                  <input
                    type="number"
                    min={1}
                    max={availableRecyclers}
                    value={recyclerCount}
                    onChange={e => setRecyclerCount(Math.max(1, Math.min(availableRecyclers, parseInt(e.target.value) || 1)))}
                    className="w-20 h-10 text-center bg-white/10 border border-amber-400/30 rounded-lg text-lg font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => setRecyclerCount(Math.min(availableRecyclers, recyclerCount + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 text-ogame-muted cursor-pointer"
                  ><i className="ri-add-line"></i></button>
                  <button
                    onClick={() => setRecyclerCount(availableRecyclers)}
                    className="px-3 py-2 rounded text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 hover:bg-amber-400/20 cursor-pointer whitespace-nowrap"
                  >Max</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-xs text-ogame-muted">Total Cargo Capacity</p>
                  <p className="text-sm font-bold text-white">{totalCargo.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ogame-muted">Debris to Harvest</p>
                  <p className={`text-sm font-bold ${willClear ? 'text-green-400' : 'text-amber-400'}`}>
                    {willClear ? 'Full Clear!' : `${Math.min(totalCargo, totalDebris).toLocaleString()} / ${totalDebris.toLocaleString()}`}
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-white/5 flex gap-2 justify-end">
              <button onClick={onClose} className="px-4 py-1.5 text-xs rounded border border-white/10 text-ogame-muted hover:bg-white/5 cursor-pointer whitespace-nowrap">
                Cancel
              </button>
              <button
                onClick={handleSendRecyclers}
                disabled={sending || recyclerCount <= 0 || availableRecyclers <= 0}
                className="px-5 py-1.5 text-xs rounded font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                style={{ background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.4)', color: '#d4a853' }}
              >
                {sending ? (
                  <><i className="ri-loader-4-line animate-spin mr-1"></i>Dispatching...</>
                ) : (
                  <><i className="ri-send-plane-2-line mr-1"></i>Send {recyclerCount} Recycler{recyclerCount > 1 ? 's' : ''}</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Moon Tooltip ──────────────────────────────────────────────────────────
function MoonInfo({ moon, moonHasBase, coords }: { moon: boolean; moonHasBase: boolean; coords: string }) {
  const [show, setShow] = useState(false);
  if (!moon) return <span className="text-ogame-dim text-xs">—</span>;
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div className="flex items-center gap-1 cursor-default">
        <i className="ri-moon-fill text-teal-300 text-base"></i>
      </div>
      {show && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-30 w-48 p-3 rounded-lg text-xs"
          style={{ background: '#0d1526', border: '1px solid #1e2a36' }}>
          <p className="font-bold text-teal-300 mb-2">Moon · {coords}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-ogame-muted">
              <i className="ri-building-2-line text-xs"></i>
              <span>Base: {moonHasBase ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDebrisAmount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function GalaxyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [galaxy, setGalaxy] = useState(1);
  const [system, setSystem] = useState(234);
  const [galaxyInput, setGalaxyInput] = useState('1');
  const [systemInput, setSystemInput] = useState('234');
  const [planets, setPlanets] = useState<PlanetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [spyReport, setSpyReport] = useState<SpyReport | null>(null);
  const [harvestDispatch, setHarvestDispatch] = useState<FleetDispatch | null>(null);
  const [spying, setSpying] = useState<number | null>(null);

  const fetchSystemData = useCallback(async (gal: number, sys: number) => {
    setLoading(true);
    try {
      const [planetsRes, moonsRes, debrisRes] = await Promise.all([
        supabase.from('planets').select('*').eq('position_galaxy', gal).eq('position_system', sys),
        supabase.from('moons').select('*').eq('position_galaxy', gal).eq('position_system', sys),
        supabase.from('debris_fields').select('*').eq('galaxy', gal).eq('system', sys),
      ]);

      const dbPlanets = planetsRes.data || [];
      const dbMoons = moonsRes.data || [];
      const dbDebris = debrisRes.data || [];

      const moonMap: Record<number, boolean> = {};
      const moonBaseMap: Record<number, boolean> = {};
      dbMoons.forEach((m: any) => {
        if (m.position_planet) {
          moonMap[m.position_planet] = true;
          if (m.has_base) moonBaseMap[m.position_planet] = true;
        }
      });

      const debrisMap: Record<number, { metal: number; crystal: number; deuterium: number; id: number }> = {};
      dbDebris.forEach((d: any) => {
        debrisMap[d.planet] = { metal: Number(d.metal) || 0, crystal: Number(d.crystal) || 0, deuterium: Number(d.deuterium) || 0, id: d.id };
      });

      const planetMap: Record<number, any> = {};
      dbPlanets.forEach((p: any) => { planetMap[p.position_planet] = p; });

      const rows: PlanetRow[] = [];
      for (let pos = 1; pos <= 15; pos++) {
        const p = planetMap[pos];
        const debris = debrisMap[pos] || null;
        const isOwnPlanet = p?.user_id === user?.id;

        if (p) {
          const hasNpcOwner = p.npc_owner && p.npc_owner.length > 0;
          rows.push({
            position: pos,
            planetDbId: p.id,
            planetUserId: p.user_id || null,
            planetName: p.name,
            planetType: p.planet_type,
            hasPlayer: hasNpcOwner || (p.user_id !== null),
            isOwnPlanet,
            playerName: isOwnPlanet ? 'You' : (hasNpcOwner ? p.npc_owner : null),
            allianceTag: hasNpcOwner ? p.npc_alliance : null,
            allianceName: hasNpcOwner ? (p.npc_alliance || '').replace(/[[\]]/g, '') : null,
            rank: hasNpcOwner ? p.npc_rank : null,
            points: hasNpcOwner ? p.npc_points : null,
            status: hasNpcOwner ? p.npc_status : (isOwnPlanet ? 'active' : null),
            activityMinutes: hasNpcOwner ? p.activity_minutes : (isOwnPlanet ? 1 : null),
            moon: moonMap[pos] || false,
            moonHasBase: moonBaseMap[pos] || false,
            debris: debris ? { metal: debris.metal, crystal: debris.crystal, deuterium: debris.deuterium } : null,
            debrisId: debris?.id || null,
          });
        } else {
          rows.push({
            position: pos,
            planetDbId: null,
            planetUserId: null,
            planetName: null,
            planetType: null,
            hasPlayer: false,
            isOwnPlanet: false,
            playerName: null,
            allianceTag: null,
            allianceName: null,
            rank: null,
            points: null,
            status: null,
            activityMinutes: null,
            moon: moonMap[pos] || false,
            moonHasBase: moonBaseMap[pos] || false,
            debris: debris ? { metal: debris.metal, crystal: debris.crystal, deuterium: debris.deuterium } : null,
            debrisId: debris?.id || null,
          });
        }
      }
      setPlanets(rows);
    } catch (err) {
      console.error('Failed to fetch system data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const navigateTo = useCallback((gal: number, sys: number) => {
    const g = Math.max(1, Math.min(9, gal));
    const s = Math.max(1, Math.min(499, sys));
    setGalaxy(g);
    setSystem(s);
    setGalaxyInput(String(g));
    setSystemInput(String(s));
    fetchSystemData(g, s);
  }, [fetchSystemData]);

  useEffect(() => {
    fetchSystemData(1, 234);
  }, []);

  const handleGalaxyInput = (v: string) => {
    setGalaxyInput(v);
    const n = parseInt(v);
    if (!isNaN(n)) navigateTo(n, system);
  };

  const handleSystemInput = (v: string) => {
    setSystemInput(v);
    const n = parseInt(v);
    if (!isNaN(n)) navigateTo(galaxy, n);
  };

  const coords = useCallback((pos: number) => `[${galaxy}:${system}:${pos}]`, [galaxy, system]);

  const handleSpy = useCallback(async (row: PlanetRow) => {
    if (!user) return;
    setSpying(row.position);

    try {
      // 1. Check spy probe availability
      const { data: probeData } = await supabase
        .from('ships')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('ship_type', 'espionage_probe')
        .maybeSingle();

      if (!probeData || probeData.quantity < 1) {
        setSpying(null);
        alert('No spy probes available! Build some in the Shipyard first.');
        return;
      }

      // 2. Deduct 1 spy probe
      await supabase
        .from('ships')
        .update({ quantity: probeData.quantity - 1 })
        .eq('id', probeData.id);

      // 3. Gather intel — real DB queries for player planets, scaled generation for NPCs
      let buildings: { name: string; level: number }[] = [];
      let defenses: { type: string; count: number }[] = [];
      let fleet: { type: string; count: number }[] = [];
      let resources = { metal: 0, crystal: 0, deuterium: 0, energy: 0 };
      let detected = false;

      // Determine if this is a real player planet or NPC
      const isRealPlayer = row.planetUserId && row.planetUserId !== user.id;

      if (isRealPlayer && row.planetDbId) {
        // Real player — query actual tables
        const [bldgRes, defRes, shipRes, resRes] = await Promise.all([
          supabase.from('buildings').select('building_type, level').eq('planet_id', row.planetDbId),
          supabase.from('defense_structures').select('structure_type, quantity').eq('planet_id', row.planetDbId),
          supabase.from('ships').select('ship_type, quantity').eq('user_id', row.planetUserId).eq('planet_id', row.planetDbId),
          supabase.from('player_resources').select('metal, crystal, deuterium, energy').eq('player_id', row.planetUserId).maybeSingle(),
        ]);

        buildings = (bldgRes.data || []).map((b: any) => ({ name: b.building_type, level: b.level }));
        defenses = (defRes.data || []).map((d: any) => ({ type: d.structure_type, count: d.quantity }));
        fleet = (shipRes.data || []).map((s: any) => ({ type: s.ship_type, count: s.quantity }));
        if (resRes.data) {
          resources = {
            metal: Number(resRes.data.metal) || 0,
            crystal: Number(resRes.data.crystal) || 0,
            deuterium: Number(resRes.data.deuterium) || 0,
            energy: Number(resRes.data.energy) || 0,
          };
        }
        // Real players have a detection chance based on their research level
        detected = Math.random() < 0.18;
      } else {
        // NPC empire — generate consistent data scaled by their actual rank & points
        const seed = (row.planetDbId || galaxy * 10000 + system * 100 + row.position);
        let h = 0;
        for (let i = 0; i < String(seed).length; i++) h = ((h << 5) - h + String(seed).charCodeAt(i)) | 0;
        const rng = (min: number, max: number) => {
          h = (h * 1103515245 + 12345) & 0x7fffffff;
          return min + (h % (max - min + 1));
        };

        const scale = Math.max(0.3, Math.min(2.5, (row.points || 50000) / 50000));
        const rankScale = Math.max(0.5, 2 - ((row.rank || 50) / 100));
        const s = scale * rankScale;

        buildings = [
          { name: 'Metal Mine', level: Math.floor(rng(18, 30) * s) },
          { name: 'Crystal Mine', level: Math.floor(rng(15, 26) * s) },
          { name: 'Deuterium Synthesizer', level: Math.floor(rng(12, 22) * s) },
          { name: 'Solar Plant', level: Math.floor(rng(20, 28) * s) },
          { name: 'Fusion Reactor', level: Math.floor(rng(8, 18) * s) },
          { name: 'Research Lab', level: Math.floor(rng(8, 18) * s) },
          { name: 'Shipyard', level: Math.floor(rng(6, 14) * s) },
          { name: 'Robotics Factory', level: Math.floor(rng(6, 12) * s) },
          { name: 'Nanite Factory', level: s > 1.5 ? Math.floor(rng(2, 5) * s) : 0 },
          { name: 'Space Dock', level: s > 1.2 ? Math.floor(rng(2, 6) * s) : 0 },
          { name: 'Alliance Depot', level: rng(1, 12) },
          { name: 'Missile Silo', level: rng(1, 8) },
        ].filter(b => b.level > 0);

        const defCount = Math.floor(rng(800, 3500) * s);
        const rlCount = Math.floor(defCount * rng(35, 55) / 100);
        const llCount = Math.floor(defCount * rng(20, 35) / 100);
        const hlCount = Math.floor(defCount * rng(5, 15) / 100);
        const gcCount = Math.floor(defCount * rng(2, 8) / 100);
        const icCount = Math.floor(defCount * rng(1, 4) / 100);
        defenses = [
          { type: 'Rocket Launcher', count: rlCount },
          { type: 'Light Laser', count: llCount },
          { type: 'Heavy Laser', count: hlCount },
          { type: 'Gauss Cannon', count: gcCount },
          { type: 'Ion Cannon', count: icCount },
        ].filter(d => d.count > 0);

        fleet = [
          { type: 'Light Fighter', count: Math.floor(rng(100, 800) * s) },
          { type: 'Heavy Fighter', count: Math.floor(rng(30, 250) * s) },
          { type: 'Cruiser', count: Math.floor(rng(20, 150) * s) },
          { type: 'Battleship', count: Math.floor(rng(5, 60) * s) },
          { type: 'Battlecruiser', count: Math.floor(rng(2, 25) * s) },
          { type: 'Destroyer', count: s > 1.3 ? Math.floor(rng(1, 8) * s) : 0 },
          { type: 'Small Cargo', count: Math.floor(rng(20, 150) * s) },
          { type: 'Large Cargo', count: Math.floor(rng(10, 60) * s) },
          { type: 'Recycler', count: Math.floor(rng(5, 40) * s) },
          { type: 'Espionage Probe', count: Math.floor(rng(5, 30) * s) },
        ].filter(f => f.count > 0);

        resources = {
          metal: Math.floor(rng(200000, 6000000) * s),
          crystal: Math.floor(rng(100000, 4000000) * s),
          deuterium: Math.floor(rng(50000, 2000000) * s),
          energy: Math.floor(rng(500, 8000) * s),
        };

        // Higher rank = more likely to detect
        detected = rng(0, 100) < (row.rank ? Math.max(5, 35 - (row.rank / 4)) : 15);
      }

      // 4. Save espionage report to DB
      await supabase.from('espionage_reports').insert({
        spy_id: user.id,
        spy_name: 'You',
        target_name: row.playerName || 'Unknown',
        target_planet: coords(row.position),
        success: true,
        detail_level: detected ? 'partial' : 'full',
        report_data: { buildings, defenses, fleet, resources, detected },
        is_read: false,
      });

      // 5. Show the report
      setSpyReport({
        coordinates: coords(row.position),
        player: row.playerName ?? 'Unknown',
        metal: resources.metal,
        crystal: resources.crystal,
        deuterium: resources.deuterium,
        energy: resources.energy,
        fleet,
        defenses,
        buildings,
        detected,
      });
    } catch (err) {
      console.error('Spy mission failed:', err);
      alert('Espionage mission failed. Try again.');
    } finally {
      setSpying(null);
    }
  }, [galaxy, system, coords, user]);

  const openHarvest = useCallback((row: PlanetRow) => {
    setHarvestDispatch({
      coordinates: coords(row.position),
      player: row.playerName ?? '',
      mission: 'harvest',
      debris: row.debris ?? undefined,
      debrisId: row.debrisId ?? null,
    });
  }, [coords]);

  const navigateToFleet = useCallback((dispatch: FleetDispatch) => {
    navigate('/fleet', { state: { prefill: { destination: dispatch.coordinates, mission: dispatch.mission, debris: dispatch.debris, ships: { recycler: 0 } } } });
  }, [navigate]);

  const debrisCount = planets.filter(p => p.debrisId !== null).length;

  return (
    <div className="text-white">
      {spyReport && <SpyReportModal report={spyReport} onClose={() => setSpyReport(null)} />}
      {harvestDispatch && <HarvestDispatchModal dispatch={harvestDispatch} onClose={() => setHarvestDispatch(null)} />}

      {/* Hero */}
      <div className="relative h-40 overflow-hidden" style={{ background: '#020408' }}>
        <SpaceCanvas starCount={300} showNebulae />
        <div className="absolute inset-0 flex items-center px-6 z-10">
          <div className="flex items-center gap-6">
            <Star3D type={'G' as StarType} size={70} animate useImage />
            <div>
              <h1 className="text-3xl font-black tracking-wide" style={{ color: '#d4a853' }}>Galaxy View</h1>
              <p className="text-xs text-ogame-muted mt-1">Browse coordinates · spy · attack · harvest debris</p>
              <div className="flex gap-3 mt-2">
                {(['terrestrial', 'gas_giant', 'ice', 'volcanic', 'ocean'] as PlanetType[]).map((t, i) => (
                  <Planet3D key={i} type={t} size={28} animate={false} useImage />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Navigation bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl" style={{ background: '#080b0f', border: '1px solid #1e2a36' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ogame-muted font-medium">Galaxy</span>
            <button onClick={() => navigateTo(galaxy - 1, system)} className="w-7 h-7 flex items-center justify-center rounded bg-amber-400/10 hover:bg-amber-400/25 text-amber-400 cursor-pointer transition-all">
              <i className="ri-arrow-left-s-line text-sm"></i>
            </button>
            <input
              type="number" min={1} max={9} value={galaxyInput}
              onChange={e => handleGalaxyInput(e.target.value)}
              className="w-12 h-7 text-center bg-white/10 border border-amber-400/25 rounded text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-400"
            />
            <button onClick={() => navigateTo(galaxy + 1, system)} className="w-7 h-7 flex items-center justify-center rounded bg-amber-400/10 hover:bg-amber-400/25 text-amber-400 cursor-pointer transition-all">
              <i className="ri-arrow-right-s-line text-sm"></i>
            </button>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ogame-muted font-medium">System</span>
            <button onClick={() => navigateTo(galaxy, system - 1)} className="w-7 h-7 flex items-center justify-center rounded bg-teal-400/10 hover:bg-teal-400/25 text-teal-400 cursor-pointer transition-all">
              <i className="ri-arrow-left-s-line text-sm"></i>
            </button>
            <input
              type="number" min={1} max={499} value={systemInput}
              onChange={e => handleSystemInput(e.target.value)}
              className="w-16 h-7 text-center bg-white/10 border border-teal-400/25 rounded text-sm font-bold text-teal-400 focus:outline-none focus:border-teal-400"
            />
            <button onClick={() => navigateTo(galaxy, system + 1)} className="w-7 h-7 flex items-center justify-center rounded bg-teal-400/10 hover:bg-teal-400/25 text-teal-400 cursor-pointer transition-all">
              <i className="ri-arrow-right-s-line text-sm"></i>
            </button>
          </div>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-ogame-dim">Debris Fields:</span>
            {loading ? (
              <span className="text-ogame-muted"><i className="ri-loader-4-line animate-spin mr-1"></i>Loading...</span>
            ) : (
              <span className="text-teal-400 font-semibold">
                {debrisCount} field{debrisCount !== 1 ? 's' : ''}
              </span>
            )}
            <span className="text-ogame-dim">|</span>
            <span className="text-ogame-muted">
              System {system} · {planets.filter(p => p.planetName).length} bodies
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3 text-xs text-ogame-dim">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Active</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-500 inline-block"></span> Inactive</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Vacation</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Protected</span>
          </div>
        </div>

        {/* Galaxy table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <i className="ri-loader-4-line animate-spin text-4xl text-amber-400"></i>
              <p className="text-sm text-ogame-muted mt-3">Scanning system...</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e2a36' }}>
            <table className="w-full text-sm">
              <thead style={{ background: 'rgba(212,168,83,0.06)', borderBottom: '1px solid #1e2a36' }}>
                <tr>
                  <th className="px-3 py-2.5 text-left text-xs font-bold text-amber-400 uppercase tracking-wider w-28">Position</th>
                  <th className="px-3 py-2.5 text-left text-xs font-bold text-amber-400 uppercase tracking-wider">Player / Planet</th>
                  <th className="px-3 py-2.5 text-left text-xs font-bold text-amber-400 uppercase tracking-wider w-24">Alliance</th>
                  <th className="px-3 py-2.5 text-left text-xs font-bold text-amber-400 uppercase tracking-wider w-24">Status</th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold text-amber-400 uppercase tracking-wider w-20">Moon</th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold text-amber-400 uppercase tracking-wider w-36">Debris</th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold text-amber-400 uppercase tracking-wider w-40">Activity</th>
                  <th className="px-3 py-2.5 text-center text-xs font-bold text-amber-400 uppercase tracking-wider w-52">Actions</th>
                </tr>
              </thead>
              <tbody>
                {planets.map((row) => {
                  const c = coords(row.position);
                  const isSpying = spying === row.position;
                  const hasRealDebris = row.debrisId !== null;
                  const hasPlayer = row.hasPlayer && row.playerName;
                  const isOwn = row.isOwnPlanet;
                  return (
                    <tr
                      key={row.position}
                      className="transition-colors"
                      style={{
                        background: isOwn ? 'rgba(212,168,83,0.08)' : (hasRealDebris ? 'rgba(212,168,83,0.04)' : (hasPlayer ? 'rgba(255,255,255,0.015)' : 'transparent')),
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-white">{c}</span>
                          {hasRealDebris && (
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" title="Debris field present"></span>
                          )}
                          {isOwn && (
                            <span className="text-xs text-amber-400" title="Your planet">★</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        {hasPlayer ? (
                          <div>
                            <p className="text-xs font-semibold text-white leading-none">
                              {isOwn ? 'You' : row.playerName}
                            </p>
                            {row.planetName && (
                              <p className="text-xs text-ogame-dim mt-0.5">
                                {row.planetName}
                                {row.rank && <> · Rank #{row.rank}</>}
                                {row.points && <> · {(row.points / 1000).toFixed(0)}K pts</>}
                              </p>
                            )}
                          </div>
                        ) : row.planetName ? (
                          <div>
                            <p className="text-xs text-ogame-dim italic">{row.planetName}</p>
                            <p className="text-xs text-ogame-dim mt-0.5">{row.planetType} · Unclaimed</p>
                          </div>
                        ) : (
                          <span className="text-xs text-ogame-dim italic">Deep Space</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {row.allianceTag ? (
                          <span className="text-xs font-bold text-purple-400">{row.allianceTag}</span>
                        ) : (
                          <span className="text-xs text-ogame-dim">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        {hasPlayer ? statusBadge(row.status) : <span className="text-xs text-ogame-dim">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <MoonInfo moon={row.moon} moonHasBase={row.moonHasBase} coords={c} />
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {row.debris && (row.debris.metal > 0 || row.debris.crystal > 0 || row.debris.deuterium > 0) ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-yellow-400 font-semibold">{formatDebrisAmount(row.debris.metal)} M</span>
                              <span className="text-xs text-ogame-dim">·</span>
                              <span className="text-xs text-teal-400 font-semibold">{formatDebrisAmount(row.debris.crystal)} C</span>
                            </div>
                            {row.debris.deuterium > 0 && (
                              <span className="text-xs text-green-400 font-semibold">{formatDebrisAmount(row.debris.deuterium)} D</span>
                            )}
                            {hasRealDebris && (
                              <span className="text-xs text-teal-400/70 mt-0.5" style={{ fontSize: '0.65rem' }}>active</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-ogame-dim">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        {row.activityMinutes !== null ? (
                          <span className="text-xs text-green-400">
                            {row.activityMinutes}m ago
                          </span>
                        ) : hasPlayer ? (
                          <span className="text-xs text-ogame-dim">Offline</span>
                        ) : (
                          <span className="text-xs text-ogame-dim">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center justify-center gap-1">
                          {row.debris && (row.debris.metal > 0 || row.debris.crystal > 0) && (
                            <button
                              onClick={() => openHarvest(row)}
                              title="Send Recyclers to Harvest Debris"
                              className="w-7 h-7 flex items-center justify-center rounded bg-teal-400/15 hover:bg-teal-400/35 text-teal-400 transition-all cursor-pointer"
                            >
                              <i className="ri-recycle-line text-sm"></i>
                            </button>
                          )}
                          {hasPlayer && !isOwn && (
                            <>
                              <button
                                onClick={() => navigateToFleet({ coordinates: c, player: row.playerName ?? '', mission: 'attack' })}
                                title="Attack"
                                className="w-7 h-7 flex items-center justify-center rounded bg-red-400/10 hover:bg-red-400/30 text-red-400 transition-all cursor-pointer"
                              ><i className="ri-sword-line text-sm"></i></button>
                              <button
                                onClick={() => navigateToFleet({ coordinates: c, player: row.playerName ?? '', mission: 'transport' })}
                                title="Transport"
                                className="w-7 h-7 flex items-center justify-center rounded bg-green-400/10 hover:bg-green-400/30 text-green-400 transition-all cursor-pointer"
                              ><i className="ri-truck-line text-sm"></i></button>
                              <button
                                onClick={() => handleSpy(row)}
                                title="Spy"
                                disabled={isSpying}
                                className="w-7 h-7 flex items-center justify-center rounded bg-amber-400/10 hover:bg-amber-400/30 text-amber-400 transition-all cursor-pointer disabled:opacity-40"
                              >
                                {isSpying
                                  ? <i className="ri-loader-4-line text-sm animate-spin"></i>
                                  : <i className="ri-user-search-line text-sm"></i>
                                }
                              </button>
                            </>
                          )}
                          {!hasPlayer && !row.debris && (
                            <button
                              onClick={() => navigateToFleet({ coordinates: c, player: '', mission: 'colonize' })}
                              title="Colonize"
                              className="w-7 h-7 flex items-center justify-center rounded bg-teal-400/10 hover:bg-teal-400/30 text-teal-400 transition-all cursor-pointer"
                            ><i className="ri-planet-line text-sm"></i></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ogame-dim pt-1">
          <span className="flex items-center gap-1.5"><i className="ri-sword-line text-red-400"></i> Attack</span>
          <span className="flex items-center gap-1.5"><i className="ri-truck-line text-green-400"></i> Transport</span>
          <span className="flex items-center gap-1.5"><i className="ri-user-search-line text-amber-400"></i> Espionage</span>
          <span className="flex items-center gap-1.5"><i className="ri-planet-line text-teal-400"></i> Colonize</span>
          <span className="flex items-center gap-1.5"><i className="ri-recycle-line text-teal-400"></i> Harvest Debris</span>
          <span className="flex items-center gap-1.5"><i className="ri-moon-fill text-teal-300"></i> Moon</span>
          <span className="flex items-center gap-1.5 ml-4"><span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span> Active Debris Field</span>
          <span className="flex items-center gap-1.5"><span className="text-amber-400">★</span> Your Planet</span>
        </div>
      </div>
    </div>
  );
}
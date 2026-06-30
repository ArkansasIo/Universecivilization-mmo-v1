import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ── Types ────────────────────────────────────────────────────────────── */
type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';
type BattlePhase = 'idle' | 'preparing' | 'combat' | 'result';

interface Objective { text: string; done: boolean }
interface Reward { type: string; amount: string; icon: string; color: string }

interface Mission {
  id: string;
  chapter: number;
  name: string;
  subtitle: string;
  description: string;
  difficulty: Difficulty;
  requiredLevel: number;
  previousMission?: string;
  completed: boolean;
  unlocked: boolean;
  objectives: Objective[];
  rewards: Reward[];
  enemy: { name: string; ships: number; power: number; fleet: Record<string, number> };
  planet: string;
  lore: string;
}

const CHAPTERS: Record<number, string> = {
  1: 'Origins of Conflict',
  2: 'Rising Shadows',
  3: 'War of Dominions',
};

const ALL_MISSIONS: Mission[] = [
  {
    id: 'c1m1', chapter: 1, name: 'First Contact', subtitle: 'The Pirates Attack',
    description: 'Pirate raiders have been spotted approaching your homeworld. Scramble your defenses and repel the initial assault before they reach the colony.',
    difficulty: 'Easy', requiredLevel: 1, completed: false, unlocked: true,
    objectives: [
      { text: 'Destroy all 3 pirate ships', done: false },
      { text: 'Protect colony health above 50%', done: false },
      { text: 'Complete in under 5 minutes', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '50,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '1,200 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Metal', amount: '150,000', icon: 'ri-copper-coin-line', color: '#fcd34d' },
    ],
    enemy: { name: 'Pirate Raider Fleet', ships: 3, power: 4500, fleet: { 'Fighter': 2, 'Pirate Corvette': 1 } },
    planet: 'Homeworld Alpha',
    lore: 'The Outer Rim Pirate Confederation has grown bold. Intelligence reports show multiple raider fleets moving toward settled systems. This will not be the last encounter.',
  },
  {
    id: 'c1m2', chapter: 1, name: 'Supply Lines', subtitle: 'Escort the Convoy',
    description: 'A vital supply convoy must reach the forward base. Enemy raiders have set ambushes along the route. Escort the transports safely through hostile space.',
    difficulty: 'Easy', requiredLevel: 2, previousMission: 'c1m1', completed: false, unlocked: false,
    objectives: [
      { text: 'Escort all 3 cargo ships to the destination', done: false },
      { text: 'Neutralize ambush forces', done: false },
      { text: 'Lose no more than 1 escort ship', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '80,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '2,000 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Crystal', amount: '80,000', icon: 'ri-drop-line', color: '#60a5fa' },
      { type: 'Blueprint: Cruiser Mk.I', amount: '×1', icon: 'ri-file-list-3-line', color: '#34d399' },
    ],
    enemy: { name: 'Ambush Squadron', ships: 6, power: 9000, fleet: { 'Fighter': 4, 'Raider Frigate': 2 } },
    planet: 'Trade Route Gamma-7',
    lore: 'The supply lines are the lifeline of any growing empire. Without steady resource flow, even the mightiest fleet crumbles.',
  },
  {
    id: 'c1m3', chapter: 1, name: 'The Stronghold', subtitle: 'Assault the Pirate Base',
    description: 'Intelligence has located the main pirate stronghold. A coordinated strike must destroy their base, eliminate the pirate captain, and cut off future raids permanently.',
    difficulty: 'Medium', requiredLevel: 4, previousMission: 'c1m2', completed: false, unlocked: false,
    objectives: [
      { text: 'Destroy all base defense platforms', done: false },
      { text: 'Defeat the Pirate Captain\'s flagship', done: false },
      { text: 'Capture enemy commander (50% chance)', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '200,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '4,500 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Dark Matter', amount: '500', icon: 'ri-focus-2-line', color: '#c084fc' },
      { type: 'Rare Weapon Mod', amount: '×2', icon: 'ri-sword-line', color: '#f87171' },
    ],
    enemy: { name: 'Pirate Stronghold', ships: 12, power: 22000, fleet: { 'Fighter': 6, 'Corvette': 4, 'Pirate Battlecruiser': 1, 'Defense Platform': 3 } },
    planet: 'Asteroid Base Kron',
    lore: 'The pirate captain "Iron Maw" has terrorized the sector for a decade. Defeating him will send a clear message to the Outer Rim factions.',
  },
  {
    id: 'c2m1', chapter: 2, name: 'Ancient Ruins', subtitle: 'The Alien Discovery',
    description: 'Deep scanners detected an ancient alien structure on a remote planet. Enemy factions race to claim it. You must secure the ruins and neutralize guardian drones before they do.',
    difficulty: 'Medium', requiredLevel: 6, previousMission: 'c1m3', completed: false, unlocked: false,
    objectives: [
      { text: 'Reach the ruins before enemy faction', done: false },
      { text: 'Destroy all guardian drones', done: false },
      { text: 'Recover the alien artifact', done: false },
      { text: 'Retreat before structural collapse', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '350,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '7,000 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Ancient Artifact', amount: '×1', icon: 'ri-ancient-gate-line', color: '#38bdf8' },
      { type: 'Dark Matter', amount: '2,000', icon: 'ri-focus-2-line', color: '#c084fc' },
    ],
    enemy: { name: 'Guardian Defense Network', ships: 15, power: 38000, fleet: { 'Guardian Drone': 10, 'Ancient Sentinel': 3, 'Core Defender': 2 } },
    planet: 'Xel\'Zara Ruins',
    lore: 'The Xel\'Zara precursor civilization vanished 200,000 years ago. Their technology could shift the balance of galactic power.',
  },
  {
    id: 'c2m2', chapter: 2, name: 'Corporate War', subtitle: 'Infiltrate and Extract',
    description: 'The Helios Corporation has stolen classified research data. Infiltrate their orbital facility, neutralize their security fleet, and extract the stolen files before they are sold.',
    difficulty: 'Hard', requiredLevel: 9, previousMission: 'c2m1', completed: false, unlocked: false,
    objectives: [
      { text: 'Breach the orbital defense grid', done: false },
      { text: 'Destroy communication relay (prevent alert)', done: false },
      { text: 'Neutralize Helios Security Wing', done: false },
      { text: 'Extract the data core ship', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '500,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '12,000 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Research Boost', amount: '+25% (7 days)', icon: 'ri-flask-line', color: '#34d399' },
      { type: 'Stealth Module', amount: '×1', icon: 'ri-eye-off-line', color: '#818cf8' },
    ],
    enemy: { name: 'Helios Security Force', ships: 18, power: 55000, fleet: { 'Security Fighter': 8, 'Helios Cruiser': 5, 'Assault Frigate': 3, 'Command Vessel': 2 } },
    planet: 'Helios Station Sigma',
    lore: 'The Helios Corporation funds half the galaxy\'s black market. Their connections run deeper than anyone suspects.',
  },
  {
    id: 'c2m3', chapter: 2, name: 'Alien Invasion', subtitle: 'Defend or Die',
    description: 'A full-scale alien armada has emerged from a subspace rift. Coordinate with neighboring systems to hold the line and destroy the invasion flagship.',
    difficulty: 'Hard', requiredLevel: 12, previousMission: 'c2m2', completed: false, unlocked: false,
    objectives: [
      { text: 'Survive 3 invasion waves', done: false },
      { text: 'Defend all 4 colony systems', done: false },
      { text: 'Destroy the invasion mothership', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '800,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '18,000 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Dark Matter', amount: '8,000', icon: 'ri-focus-2-line', color: '#c084fc' },
      { type: 'Alien Hull Tech', amount: '×1', icon: 'ri-shield-star-line', color: '#38bdf8' },
    ],
    enemy: { name: 'Xel Armada', ships: 35, power: 120000, fleet: { 'Invasion Fighter': 15, 'War Cruiser': 12, 'Carrier': 5, 'Mothership': 1, 'Siege Platform': 2 } },
    planet: 'Core Systems Perimeter',
    lore: 'They call themselves the Xel. They have no interest in diplomacy. They consume.',
  },
  {
    id: 'c3m1', chapter: 3, name: 'Into the Void', subtitle: 'The Abyss Awaits',
    description: 'A subspace anomaly leads to a region of space that defies known physics. Explore the Void, survive its dangers, and uncover what lurks beyond the observable universe.',
    difficulty: 'Extreme', requiredLevel: 18, previousMission: 'c2m3', completed: false, unlocked: false,
    objectives: [
      { text: 'Enter and stabilize the void rift', done: false },
      { text: 'Survive gravitational anomaly field', done: false },
      { text: 'Locate the Void Crystal source', done: false },
      { text: 'Escape before rift collapse', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '2,000,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '35,000 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Void Crystal', amount: '×3', icon: 'ri-contrast-drop-line', color: '#f43f5e' },
      { type: 'Dark Matter', amount: '25,000', icon: 'ri-focus-2-line', color: '#c084fc' },
    ],
    enemy: { name: 'Void Entity Cluster', ships: 28, power: 200000, fleet: { 'Void Specter': 12, 'Reality Fracture': 8, 'Singularity Drone': 6, 'Void Titan': 2 } },
    planet: 'The Void',
    lore: 'The Void is not empty. Something has lived there since before the first star was born.',
  },
  {
    id: 'c3m2', chapter: 3, name: 'Galactic War', subtitle: 'End the Dominion',
    description: 'The final battle. Lead a combined fleet of all allied factions in an all-out assault on the enemy Emperor\'s capital world. The fate of the known galaxy hangs in the balance.',
    difficulty: 'Extreme', requiredLevel: 25, previousMission: 'c3m1', completed: false, unlocked: false,
    objectives: [
      { text: 'Break through the orbital defense ring', done: false },
      { text: 'Destroy the planetary shield generators (×4)', done: false },
      { text: 'Defeat the Emperor\'s personal fleet', done: false },
      { text: 'Capture the Emperor alive', done: false },
    ],
    rewards: [
      { type: 'Credits', amount: '5,000,000', icon: 'ri-coins-line', color: '#fbbf24' },
      { type: 'Experience', amount: '80,000 XP', icon: 'ri-star-line', color: '#a78bfa' },
      { type: 'Legendary Ship', amount: '×1', icon: 'ri-rocket-2-line', color: '#f43f5e' },
      { type: 'Emperor\'s Sigil', amount: '×1 (Title)', icon: 'ri-vip-crown-line', color: '#fbbf24' },
      { type: 'Dark Matter', amount: '100,000', icon: 'ri-focus-2-line', color: '#c084fc' },
    ],
    enemy: { name: 'Imperial Dominion Fleet', ships: 80, power: 500000, fleet: { 'Imperial Fighter': 30, 'Battle Cruiser': 20, 'Dreadnought': 10, 'Emperor\'s Flagship': 1, 'Fortress Platform': 15, 'Orbital Cannon': 4 } },
    planet: 'Dominion Capital: Aurath Prime',
    lore: 'Emperor Valdris has ruled through terror for 300 years. Today that rule ends.',
  },
];

/* ── Difficulty styling ─────────────────────────────────────────────── */
const DIFF_STYLE: Record<Difficulty, { color: string; bg: string; label: string }> = {
  Easy: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', label: 'Easy' },
  Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'Medium' },
  Hard: { color: '#fb923c', bg: 'rgba(251,146,60,0.12)', label: 'Hard' },
  Extreme: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)', label: 'Extreme' },
};

/* ── Battle log simulator ──────────────────────────────────────────── */
function simulateBattle(mission: Mission): string[] {
  const log: string[] = [];
  const playerPower = 80000;
  const enemyPower = mission.enemy.power;
  let playerHP = 100;
  let enemyHP = 100;
  const playerAdvantage = playerPower > enemyPower;

  log.push(`=== MISSION: ${mission.name.toUpperCase()} ===`);
  log.push(`Engaging ${mission.enemy.name} at ${mission.planet}`);
  log.push(`Enemy forces: ${mission.enemy.ships} ships · Combat power: ${mission.enemy.power.toLocaleString()}`);
  log.push('');
  log.push('--- BATTLE BEGINS ---');
  log.push('');

  let round = 1;
  while (playerHP > 0 && enemyHP > 0 && round <= 12) {
    log.push(`[ Round ${round} ]`);
    const playerAtk = Math.floor(Math.random() * (playerAdvantage ? 18 : 12)) + (playerAdvantage ? 10 : 6);
    const enemyAtk = Math.floor(Math.random() * (playerAdvantage ? 10 : 15)) + (playerAdvantage ? 4 : 8);
    enemyHP = Math.max(0, enemyHP - playerAtk);
    playerHP = Math.max(0, playerHP - enemyAtk);
    log.push(`  Your fleet fires — ${playerAtk} damage dealt (enemy: ${enemyHP}% hull)`);
    if (enemyHP <= 0) { log.push(''); log.push('  >>> Enemy fleet destroyed!'); break; }
    log.push(`  Enemy returns fire — ${enemyAtk} damage taken (your fleet: ${playerHP}% hull)`);
    if (playerHP <= 0) { log.push(''); log.push('  >>> Your fleet has been defeated!'); break; }
    log.push('');
    round++;
  }

  log.push('');
  log.push('--- BATTLE RESULT ---');
  if (playerHP > 0 && enemyHP <= 0) {
    log.push('VICTORY! Enemy fleet eliminated.');
    log.push('Mission objectives achieved.');
    log.push('');
    log.push('Rewards granted — check your inventory.');
  } else {
    log.push('DEFEAT. Your fleet was overwhelmed.');
    log.push('Consider upgrading your ships or research before retrying.');
  }
  return log;
}

/* ── Main Page ─────────────────────────────────────────────────────── */
export default function CampaignPage() {
  const [missions, setMissions] = useState<Mission[]>(ALL_MISSIONS);
  const [selected, setSelected] = useState<Mission>(ALL_MISSIONS[0]);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('idle');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [logVisible, setLogVisible] = useState<string[]>([]);
  const [victory, setVictory] = useState<boolean | null>(null);
  const [playerLevel] = useState(5);
  const logRef = useRef<HTMLDivElement>(null);

  const chapter1 = missions.filter(m => m.chapter === 1);
  const chapter2 = missions.filter(m => m.chapter === 2);
  const chapter3 = missions.filter(m => m.chapter === 3);

  const completedCount = missions.filter(m => m.completed).length;
  const progress = Math.round((completedCount / missions.length) * 100);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logVisible]);

  const handleStart = async () => {
    if (!selected.unlocked || selected.completed) return;
    setBattlePhase('preparing');
    setBattleLog([]);
    setLogVisible([]);
    setVictory(null);

    await new Promise(r => setTimeout(r, 800));
    setBattlePhase('combat');

    const log = simulateBattle(selected);
    const won = log.includes('VICTORY! Enemy fleet eliminated.');
    setBattleLog(log);

    // Stream lines
    for (let i = 0; i < log.length; i++) {
      await new Promise(r => setTimeout(r, 80));
      setLogVisible(prev => [...prev, log[i]]);
    }

    setBattlePhase('result');
    setVictory(won);

    if (won) {
      setMissions(prev => prev.map(m => {
        if (m.id === selected.id) return { ...m, completed: true };
        if (m.previousMission === selected.id) return { ...m, unlocked: true };
        return m;
      }));
      setSelected(s => ({ ...s, completed: true }));
    }
  };

  const handleRetry = () => {
    setBattlePhase('idle');
    setBattleLog([]);
    setLogVisible([]);
    setVictory(null);
  };

  const diffStyle = DIFF_STYLE[selected.difficulty];
  const canStart = selected.unlocked && !selected.completed && playerLevel >= selected.requiredLevel && battlePhase === 'idle';

  function ChapterSection({ chapterNum, missionList }: { chapterNum: number; missionList: Mission[] }) {
    return (
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#6b7a95' }}>
          Chapter {chapterNum}: {CHAPTERS[chapterNum]}
        </p>
        <div className="space-y-1.5">
          {missionList.map(m => {
            const ds = DIFF_STYLE[m.difficulty];
            const isSelected = selected.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { setSelected(m); if (battlePhase === 'result' || battlePhase === 'combat') handleRetry(); }}
                className="w-full text-left rounded-xl px-3.5 py-3 transition-all cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  opacity: !m.unlocked ? 0.45 : 1,
                }}
              >
                <div className="flex items-center gap-2">
                  {m.completed ? (
                    <i className="ri-checkbox-circle-fill text-green-400 text-sm flex-shrink-0"></i>
                  ) : !m.unlocked ? (
                    <i className="ri-lock-line text-gray-600 text-sm flex-shrink-0"></i>
                  ) : (
                    <i className="ri-play-circle-line text-cyan-400 text-sm flex-shrink-0"></i>
                  )}
                  <span className="text-xs font-semibold text-white truncate flex-1">{m.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0" style={{ background: ds.bg, color: ds.color }}>
                    {ds.label}
                  </span>
                </div>
                <p className="text-xs mt-0.5 ml-5" style={{ color: '#6b7a95' }}>{m.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="text-white px-6 py-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-amber-400">Campaign</h1>
          <p className="text-xs text-gray-400 mt-1">Story-driven missions with escalating challenges and exclusive rewards</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Campaign Progress</p>
          <p className="text-sm font-bold text-white">{completedCount}/{missions.length} missions</p>
          <div className="w-32 h-1.5 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1.5 rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#fbbf24,#f59e0b)' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Mission list sidebar */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <ChapterSection chapterNum={1} missionList={chapter1} />
          <ChapterSection chapterNum={2} missionList={chapter2} />
          <ChapterSection chapterNum={3} missionList={chapter3} />
        </div>

        {/* Mission detail panel */}
        <div className="col-span-3 space-y-4">
          {/* Mission info */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#0d1526', border: '1px solid rgba(251,191,36,0.2)' }}>
            {/* Mission banner */}
            <div className="relative h-32 overflow-hidden">
              <img
                src={`https://readdy.ai/api/search-image?query=epic%20space%20battle%20dramatic%20cinematic%20sci-fi%20$%7Bselected.planet%7D%20planet%20surface%20with%20fleet%20combat%20explosions%20light%20beams%20atmospheric%20warfare%20futuristic%20dark%20space%20backdrop%20with%20vibrant%20energy%20effects%20high%20detail%20render&width=900&height=260&seq=campaign-${selected.id}&orientation=landscape`}
                alt={selected.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1526] via-black/30 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.color}30` }}>
                      {diffStyle.label}
                    </span>
                    <span className="text-xs text-gray-300">Ch.{selected.chapter} · {CHAPTERS[selected.chapter]}</span>
                    {selected.completed && <span className="text-xs px-2 py-0.5 rounded bg-green-400/15 text-green-400 border border-green-400/25">COMPLETED</span>}
                    {!selected.unlocked && <span className="text-xs px-2 py-0.5 rounded bg-white/8 text-gray-500 border border-white/10">LOCKED</span>}
                  </div>
                  <h2 className="text-xl font-black text-white leading-tight">{selected.name}</h2>
                  <p className="text-xs text-amber-400">{selected.subtitle}</p>
                </div>
                <div className="text-right text-xs text-gray-300">
                  <p>Required Level: <span className={playerLevel >= selected.requiredLevel ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{selected.requiredLevel}</span></p>
                  <p>Location: <span className="text-cyan-400">{selected.planet}</span></p>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
              {/* Left: description + objectives */}
              <div>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">{selected.description}</p>
                <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.12)' }}>
                  <p className="text-xs font-bold text-amber-400 mb-2"><i className="ri-compass-3-line mr-1"></i>Lore</p>
                  <p className="text-xs text-gray-400 italic leading-relaxed">{selected.lore}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Objectives</p>
                  <div className="space-y-1.5">
                    {selected.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <i className={`${obj.done ? 'ri-checkbox-circle-fill text-green-400' : 'ri-checkbox-blank-circle-line text-gray-600'} flex-shrink-0 mt-0.5`}></i>
                        <span className={obj.done ? 'text-green-300 line-through' : 'text-gray-300'}>{obj.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: enemy info + rewards */}
              <div>
                <div className="rounded-lg p-3 mb-3" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.18)' }}>
                  <p className="text-xs font-bold text-red-400 mb-2"><i className="ri-sword-fill mr-1"></i>{selected.enemy.name}</p>
                  <div className="flex gap-4 text-xs mb-2">
                    <span className="text-gray-400">Ships: <span className="text-red-400 font-bold">{selected.enemy.ships}</span></span>
                    <span className="text-gray-400">Power: <span className="text-red-400 font-bold">{selected.enemy.power.toLocaleString()}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(selected.enemy.fleet).map(([ship, count]) => (
                      <span key={ship} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' }}>
                        {count}× {ship}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Rewards</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selected.rewards.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-2" style={{ background: `${r.color}08`, border: `1px solid ${r.color}18` }}>
                        <i className={`${r.icon} text-sm flex-shrink-0`} style={{ color: r.color }}></i>
                        <div className="min-w-0">
                          <p className="text-xs font-bold" style={{ color: r.color }}>{r.amount}</p>
                          <p className="text-xs text-gray-500 truncate">{r.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="px-4 pb-4">
              {battlePhase === 'idle' && (
                <button
                  onClick={handleStart}
                  disabled={!canStart}
                  className="w-full py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
                  style={selected.completed
                    ? { background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }
                    : canStart
                    ? { background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#4b5563' }
                  }
                >
                  {selected.completed
                    ? <><i className="ri-checkbox-circle-fill mr-1"></i>Mission Complete</>
                    : !selected.unlocked
                    ? <><i className="ri-lock-line mr-1"></i>Locked — Complete Previous Mission</>
                    : playerLevel < selected.requiredLevel
                    ? <><i className="ri-arrow-up-line mr-1"></i>Requires Level {selected.requiredLevel}</>
                    : <><i className="ri-play-fill mr-1"></i>Launch Mission</>
                  }
                </button>
              )}
              {battlePhase === 'preparing' && (
                <div className="py-2.5 text-center text-sm" style={{ color: '#fbbf24' }}>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>Deploying fleet and initializing battle systems...
                </div>
              )}
              {battlePhase === 'result' && (
                <div className="flex gap-2">
                  {victory ? (
                    <div className="flex-1 py-2.5 text-center text-sm font-bold rounded-lg" style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>
                      <i className="ri-trophy-fill mr-1"></i>Victory! Mission Completed!
                    </div>
                  ) : (
                    <>
                      <button onClick={handleRetry} className="flex-1 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all whitespace-nowrap" style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                        <i className="ri-refresh-line mr-1"></i>Retry Mission
                      </button>
                      <Link to="/research" className="flex-1 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-all whitespace-nowrap text-center" style={{ background: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.3)', color: '#818cf8' }}>
                        <i className="ri-flask-line mr-1"></i>Upgrade First
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Battle log */}
          {(battlePhase === 'combat' || battlePhase === 'result') && logVisible.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ background: '#060b12', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <i className="ri-terminal-box-line text-green-400 text-sm"></i>
                  <p className="text-xs font-bold text-green-400 uppercase tracking-wider">Battle Log</p>
                </div>
                {battlePhase === 'combat' && <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div><span className="text-xs text-red-400">LIVE</span></div>}
              </div>
              <div ref={logRef} className="p-4 font-mono text-xs space-y-0.5 overflow-y-auto" style={{ maxHeight: 280 }}>
                {logVisible.map((line, i) => (
                  <div key={i} style={{
                    color: line.includes('VICTORY') ? '#4ade80'
                      : line.includes('DEFEAT') ? '#f87171'
                      : line.includes('===') || line.includes('---') ? '#fbbf24'
                      : line.includes('Round') ? '#00d4ff'
                      : line.includes('>>>') ? '#f87171'
                      : line.includes('damage dealt') ? '#4ade80'
                      : line.includes('damage taken') ? '#f87171'
                      : '#8892aa'
                  }}>
                    {line || '\u00A0'}
                  </div>
                ))}
                {battlePhase === 'combat' && <div className="inline-block w-2 h-3 bg-green-400 animate-pulse ml-0.5"></div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
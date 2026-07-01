import { useState } from 'react';

interface SpyReport {
  id: string;
  target: string;
  coordinates: string;
  timestamp: string;
  resources: {
    metal: number;
    crystal: number;
    deuterium: number;
  };
  fleet: Array<{ name: string; count: number }>;
  defense: Array<{ name: string; count: number }>;
  buildings: Array<{ name: string; level: number }>;
  research: Array<{ name: string; level: number }>;
}

export default function EspionagePage() {
  const [activeTab, setActiveTab] = useState<'reports' | 'send' | 'sabotage' | 'operations'>('reports');
  const [targetCoords, setTargetCoords] = useState('');
  const [probeCount, setProbeCount] = useState(1);
  const [sabotageTarget, setSabotageTarget] = useState('');
  const [sabotageType, setSabotageType] = useState('');
  const [operationType, setOperationType] = useState('');
  
  const spyReports: SpyReport[] = [
    {
      id: '1',
      target: 'Commander Zyx',
      coordinates: '2:147:8',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      resources: { metal: 125000, crystal: 87000, deuterium: 45000 },
      fleet: [
        { name: 'Light Fighter', count: 50 },
        { name: 'Heavy Fighter', count: 25 },
        { name: 'Cruiser', count: 10 },
      ],
      defense: [
        { name: 'Rocket Launcher', count: 100 },
        { name: 'Light Laser', count: 50 },
        { name: 'Heavy Laser', count: 25 },
      ],
      buildings: [
        { name: 'Metal Mine', level: 15 },
        { name: 'Crystal Mine', level: 12 },
        { name: 'Shipyard', level: 8 },
      ],
      research: [
        { name: 'Energy Technology', level: 10 },
        { name: 'Laser Technology', level: 8 },
        { name: 'Weapons Technology', level: 7 },
      ],
    },
    {
      id: '2',
      target: 'Admiral Nova',
      coordinates: '1:234:5',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      resources: { metal: 89000, crystal: 56000, deuterium: 32000 },
      fleet: [
        { name: 'Battleship', count: 15 },
        { name: 'Cruiser', count: 30 },
        { name: 'Destroyer', count: 5 },
      ],
      defense: [
        { name: 'Gauss Cannon', count: 40 },
        { name: 'Plasma Turret', count: 20 },
        { name: 'Ion Cannon', count: 30 },
      ],
      buildings: [
        { name: 'Metal Mine', level: 18 },
        { name: 'Crystal Mine', level: 16 },
        { name: 'Research Lab', level: 10 },
      ],
      research: [
        { name: 'Weapons Technology', level: 12 },
        { name: 'Shielding Technology', level: 10 },
        { name: 'Armor Technology', level: 9 },
      ],
    },
  ];

  // Mock active operations
  const activeOperations = [
    {
      id: '1',
      type: 'Spy Mission',
      target: '3:89:12',
      targetPlayer: 'Captain Rex',
      status: 'in_progress',
      progress: 65,
      arrival: new Date(Date.now() + 900000),
      probes: 5
    },
    {
      id: '2',
      type: 'Sabotage',
      target: '2:147:8',
      targetPlayer: 'Commander Zyx',
      status: 'executing',
      progress: 85,
      arrival: new Date(Date.now() + 300000),
      probes: 10
    }
  ];

  const sendSpyProbe = () => {
    if (!targetCoords) {
      alert('Please enter target coordinates!');
      return;
    }
    if (probeCount < 1) {
      alert('Please select at least 1 probe!');
      return;
    }
    alert(`Sending ${probeCount} spy probe(s) to ${targetCoords}`);
    setTargetCoords('');
    setProbeCount(1);
  };

  const launchSabotage = () => {
    if (!sabotageTarget) {
      alert('Please enter target coordinates!');
      return;
    }
    if (!sabotageType) {
      alert('Please select sabotage type!');
      return;
    }
    alert(`Launching ${sabotageType} sabotage mission to ${sabotageTarget}`);
    setSabotageTarget('');
    setSabotageType('');
  };

  const launchOperation = () => {
    if (!targetCoords) {
      alert('Please enter target coordinates!');
      return;
    }
    if (!operationType) {
      alert('Please select operation type!');
      return;
    }
    alert(`Launching ${operationType} operation to ${targetCoords}`);
    setTargetCoords('');
    setOperationType('');
  };

  const attackTarget = (coords: string) => {
    alert(`Preparing attack fleet for ${coords}. Redirecting to Fleet Command...`);
  };

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <i className="ri-user-search-line w-10 h-10 flex items-center justify-center"></i>
            Espionage Center
          </h1>
          <p className="text-white/60">Gather intelligence, sabotage enemies, and conduct covert operations</p>
        </div>

        <div className="flex gap-2 mb-6 bg-[#080b0f] rounded-xl p-2">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className="ri-file-list-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
            Spy Reports
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'send'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className="ri-send-plane-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
            Send Spy Probe
          </button>
          <button
            onClick={() => setActiveTab('sabotage')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sabotage'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className="ri-bug-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
            Sabotage
          </button>
          <button
            onClick={() => setActiveTab('operations')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'operations'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <i className="ri-shield-user-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
            Active Operations ({activeOperations.length})
          </button>
        </div>

        {activeTab === 'reports' ? (
          <div className="space-y-4">
            {spyReports.map((report) => (
              <div key={report.id} className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-6 hover:border-[#d4a853]/30 transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{report.target}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>
                        <i className="ri-map-pin-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                        {report.coordinates}
                      </span>
                      <span>
                        <i className="ri-time-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>
                        {new Date(report.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => attackTarget(report.coordinates)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all whitespace-nowrap cursor-pointer font-semibold"
                    >
                      <i className="ri-sword-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                      Attack
                    </button>
                    <button className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all whitespace-nowrap cursor-pointer font-semibold">
                      <i className="ri-fire-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                      Raid
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {/* Resources */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <i className="ri-database-2-line text-yellow-400 w-5 h-5 flex items-center justify-center"></i>
                      Resources
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Metal:</span>
                        <span className="text-white font-semibold">{report.resources.metal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Crystal:</span>
                        <span className="text-white font-semibold">{report.resources.crystal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Deuterium:</span>
                        <span className="text-white font-semibold">{report.resources.deuterium.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fleet */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <i className="ri-rocket-line text-cyan-400 w-5 h-5 flex items-center justify-center"></i>
                      Fleet
                    </h4>
                    <div className="space-y-2 text-sm">
                      {report.fleet.map((ship, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-white/70">{ship.name}:</span>
                          <span className="text-white font-semibold">{ship.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Defense */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <i className="ri-shield-line text-teal-400 w-5 h-5 flex items-center justify-center"></i>
                      Defense
                    </h4>
                    <div className="space-y-2 text-sm">
                      {report.defense.map((def, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-white/70">{def.name}:</span>
                          <span className="text-white font-semibold">{def.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buildings */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <i className="ri-building-line text-emerald-400 w-5 h-5 flex items-center justify-center"></i>
                      Buildings
                    </h4>
                    <div className="space-y-2 text-sm">
                      {report.buildings.map((building, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-white/70">{building.name}:</span>
                          <span className="text-white font-semibold">Lv {building.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'send' ? (
          <div className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Send Spy Probe</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Target Coordinates
                </label>
                <input
                  type="text"
                  value={targetCoords}
                  onChange={(e) => setTargetCoords(e.target.value)}
                  placeholder="e.g., 2:147:8"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Number of Probes
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={probeCount}
                  onChange={(e) => setProbeCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
                <p className="text-xs text-white/60 mt-2">
                  More probes provide more detailed information but increase detection risk
                </p>
              </div>

              <div className="bg-teal-500/20 border border-teal-500/50 rounded-lg p-4">
                <h4 className="font-semibold text-teal-300 mb-2">Intelligence Level</h4>
                <div className="space-y-1 text-sm text-white/80">
                  <div>• 1 probe: Resources only</div>
                  <div>• 3 probes: Resources + Fleet</div>
                  <div>• 5 probes: Resources + Fleet + Defense</div>
                  <div>• 7 probes: Resources + Fleet + Defense + Buildings</div>
                  <div>• 10 probes: Complete intelligence (includes Research)</div>
                </div>
              </div>

              <button
                onClick={sendSpyProbe}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#d4a853] to-[#e2c044] text-[#080b0f] rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer font-bold"
              >
                <i className="ri-send-plane-fill mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                Send Spy Mission
              </button>
            </div>
          </div>
        ) : activeTab === 'sabotage' ? (
          <div className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Launch Sabotage Mission</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Target Coordinates
                </label>
                <input
                  type="text"
                  value={sabotageTarget}
                  onChange={(e) => setSabotageTarget(e.target.value)}
                  placeholder="e.g., 2:147:8"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Sabotage Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'infrastructure', name: 'Infrastructure', icon: 'ri-building-line', desc: 'Damage buildings', color: 'red' },
                    { id: 'defense', name: 'Defense Systems', icon: 'ri-shield-line', desc: 'Disable defenses', color: 'orange' },
                    { id: 'production', name: 'Production', icon: 'ri-building-4-line', desc: 'Halt production', color: 'yellow' },
                    { id: 'research', name: 'Research', icon: 'ri-flask-line', desc: 'Corrupt data', color: 'pink' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSabotageType(type.id)}
                      className={`p-4 rounded-xl transition-all cursor-pointer ${
                        sabotageType === type.id
                          ? `bg-${type.color}-500/20 border-2 border-${type.color}-400`
                          : `bg-white/5 border border-white/20 hover:border-${type.color}-400`
                      }`}
                    >
                      <i className={`${type.icon} text-3xl text-${type.color}-400 mb-2 block w-8 h-8 mx-auto flex items-center justify-center`}></i>
                      <p className="text-sm font-semibold text-white mb-1">{type.name}</p>
                      <p className="text-xs text-white/60">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-300 mb-2 flex items-center gap-2">
                  <i className="ri-alert-line w-5 h-5 flex items-center justify-center"></i>
                  Warning
                </h4>
                <p className="text-sm text-white/80">
                  Sabotage missions have a high detection rate. If detected, you may lose agents and face retaliation.
                </p>
              </div>

              <button
                onClick={launchSabotage}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-bug-fill mr-2 w-5 h-5 inline-flex items-center justify-center"></i>
                Launch Sabotage
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOperations.map((op) => (
              <div key={op.id} className="bg-[#080b0f] rounded-xl border border-[#1e2a36] p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-2xl font-bold text-white">{op.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        op.status === 'in_progress' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-orange-400/20 text-orange-400'
                      }`}>
                        {op.status === 'in_progress' ? 'In Progress' : 'Executing'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-white/60">
                      <span>
                        <i className="ri-map-pin-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                        Target: {op.target} ({op.targetPlayer})
                      </span>
                      <span>
                        <i className="ri-time-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                        Arrival: {op.arrival.toLocaleTimeString()}
                      </span>
                      <span>
                        <i className="ri-user-search-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                        Probes: {op.probes}
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all whitespace-nowrap cursor-pointer font-semibold">
                    <i className="ri-close-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>
                    Abort Mission
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/60">
                    <span>Progress</span>
                    <span>{op.progress}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#d4a853] to-[#e2c044] transition-all duration-1000"
                      style={{ width: `${op.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

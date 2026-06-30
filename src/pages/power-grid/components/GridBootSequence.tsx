import { useState, useEffect, useRef } from 'react';

interface SubsystemStep {
  id: string;
  label: string;
  icon: string;
  duration: [number, number]; // [min, max] seconds to "scan"
}

const SUBSYSTEMS: SubsystemStep[] = [
  { id: 'grid-topology', label: 'Grid Topology Matrix', icon: 'ri-layout-grid-line', duration: [0.6, 1.2] },
  { id: 'reactor-catalog', label: 'Reactor Definition Catalog', icon: 'ri-archive-line', duration: [0.4, 0.9] },
  { id: 'node-address', label: 'Node Address Resolution', icon: 'ri-node-tree', duration: [0.5, 1.1] },
  { id: 'power-bus', label: 'Power Bus Initialization', icon: 'ri-flashlight-line', duration: [0.7, 1.4] },
  { id: 'thermal-model', label: 'Thermal Load Modeling', icon: 'ri-temp-hot-line', duration: [0.5, 1.0] },
  { id: 'connection-mesh', label: 'Connection Mesh Sync', icon: 'ri-link', duration: [0.6, 1.3] },
  { id: 'safety-interlock', label: 'Safety Interlock Check', icon: 'ri-shield-check-line', duration: [0.3, 0.8] },
  { id: 'load-balance', label: 'Load Balance Calibration', icon: 'ri-scales-line', duration: [0.5, 1.0] },
];

type StageStatus = 'pending' | 'scanning' | 'complete' | 'error';

interface StageState {
  status: StageStatus;
  elapsed: number; // ms
}

export default function GridBootSequence() {
  const [stages, setStages] = useState<Record<string, StageState>>({});
  const [bootTime, setBootTime] = useState(0);
  const [bootPhase, setBootPhase] = useState<'booting' | 'stabilizing' | 'ready'>('booting');
  const [progressPct, setProgressPct] = useState(0);
  const [scanAngle, setScanAngle] = useState(0);
  const startTime = useRef(Date.now());
  const frameRef = useRef<number>(0);

  // Tick elapsed time
  useEffect(() => {
    const tick = () => {
      setBootTime(Date.now() - startTime.current);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Radar scan rotation
  useEffect(() => {
    const rotate = () => {
      setScanAngle(prev => (prev + 1.5) % 360);
    };
    const interval = setInterval(rotate, 30);
    return () => clearInterval(interval);
  }, []);

  // Simulate subsystem scan sequence
  useEffect(() => {
    const init: Record<string, StageState> = {};
    SUBSYSTEMS.forEach(s => { init[s.id] = { status: 'pending', elapsed: 0 }; });
    setStages(init);

    let completedCount = 0;
    const totalSteps = SUBSYSTEMS.length;

    SUBSYSTEMS.forEach((sub, index) => {
      const startDelay = index * 350 + Math.random() * 200;
      const scanDuration = sub.duration[0] * 1000 + Math.random() * ((sub.duration[1] - sub.duration[0]) * 1000);

      // Go from pending → scanning after delay
      setTimeout(() => {
        setStages(prev => ({ ...prev, [sub.id]: { status: 'scanning', elapsed: 0 } }));
      }, startDelay);

      // Go from scanning → complete after scan duration
      setTimeout(() => {
        completedCount += 1;
        setStages(prev => ({ ...prev, [sub.id]: { status: 'complete', elapsed: scanDuration } }));
        setProgressPct((completedCount / totalSteps) * 100);

        if (completedCount === totalSteps) {
          setBootPhase('stabilizing');
          setTimeout(() => setBootPhase('ready'), 800);
        }
      }, startDelay + scanDuration);
    });
  }, []);

  const activeCount = Object.values(stages).filter(s => s.status === 'scanning').length;
  const completeCount = Object.values(stages).filter(s => s.status === 'complete').length;
  const totalCount = SUBSYSTEMS.length;

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="flex items-center justify-center h-full min-h-[600px] relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #070a10 0%, #090c14 50%, #0d131a 100%)' }}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(226,192,68,0.15) 2px, rgba(226,192,68,0.15) 4px)',
      }} />

      {/* Grid dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(226,192,68,0.3) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 flex flex-col items-center" style={{ width: 680 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e2c044, #d4a853)' }}
            >
              <i className="ri-flashlight-fill text-white text-lg" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-widest" style={{ color: '#d4a853', fontFamily: 'Orbitron, sans-serif' }}>
                POWER GRID
              </h1>
              <p className="text-xs tracking-[0.3em]" style={{ color: '#5a6577', fontFamily: 'Orbitron, sans-serif' }}>
                SYSTEM BOOT SEQUENCE
              </p>
            </div>
          </div>
          <div className="text-xs" style={{ color: '#4a5568', fontFamily: 'Orbitron, sans-serif' }}>
            v3.5.1 · Grid Core {String.fromCharCode(65 + Math.floor(Math.random() * 26))}{String.fromCharCode(48 + Math.floor(Math.random() * 10))}-{Math.floor(100 + Math.random() * 900)}
          </div>
        </div>

        {/* Radar scanning display */}
        <div className="mb-8 relative">
          <div className="relative w-48 h-48 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(226,192,68,0.15)' }} />
            <div className="absolute inset-3 rounded-full" style={{ border: '1px solid rgba(226,192,68,0.1)' }} />
            <div className="absolute inset-6 rounded-full" style={{ border: '1px solid rgba(226,192,68,0.07)' }} />

            {/* Crosshairs */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px" style={{ background: 'rgba(226,192,68,0.08)' }} />
            <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: 'rgba(226,192,68,0.08)' }} />

            {/* Radar sweep */}
            <div className="absolute inset-0 rounded-full overflow-hidden" style={{ opacity: 0.35 }}>
              <div className="absolute inset-0" style={{
                background: `conic-gradient(from ${scanAngle}deg, rgba(226,192,68,0.15) 0deg, rgba(226,192,68,0.05) 45deg, transparent 90deg, transparent 360deg)`,
              }} />
            </div>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#e2c044] animate-pulse" style={{ boxShadow: '0 0 12px rgba(226,192,68,0.6)' }} />
            </div>

            {/* Status ring */}
            <div className="absolute inset-[-4px] rounded-full pointer-events-none"
              style={{
                border: '2px solid transparent',
                borderTopColor: bootPhase === 'ready' ? '#34d399' : '#e2c044',
                borderRightColor: bootPhase === 'ready' ? '#34d39930' : '#e2c04430',
                animation: 'spin 3s linear infinite',
              }}
            />

            {/* Elapsed time overlay */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs tracking-wider" style={{ color: '#5a6577', fontFamily: 'Orbitron, sans-serif' }}>
                T+{formatTime(bootTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Subsystem scan list */}
        <div className="w-full mb-6 rounded-xl overflow-hidden" style={{ border: '1px solid #1e2a36', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: '1px solid #1e2a36', background: 'rgba(0,0,0,0.2)' }}>
            <i className="ri-terminal-box-line text-xs" style={{ color: '#5a6577' }} />
            <span className="text-xs font-bold tracking-wider" style={{ color: '#5a6577' }}>SUBSYSTEM DIAGNOSTICS</span>
            <span className="ml-auto text-xs" style={{ color: '#4a5568', fontFamily: 'Orbitron, sans-serif' }}>
              {completeCount}/{totalCount} PASSED
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
            {SUBSYSTEMS.map(sub => {
              const stage = stages[sub.id];
              const statusIcon = stage?.status === 'complete' ? 'ri-check-line'
                : stage?.status === 'scanning' ? 'ri-loader-4-line'
                : stage?.status === 'error' ? 'ri-close-line'
                : 'ri-more-line';
              const statusColor = stage?.status === 'complete' ? '#34d399'
                : stage?.status === 'scanning' ? '#e2c044'
                : stage?.status === 'error' ? '#ef4444'
                : '#3a4557';

              return (
                <div key={sub.id} className="flex items-center gap-3 px-4 py-2.5 transition-all"
                  style={{
                    background: stage?.status === 'scanning' ? 'rgba(226,192,68,0.03)' : 'transparent',
                  }}
                >
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: `${statusColor}10`, border: `1px solid ${statusColor}20` }}
                  >
                    <i className={`${sub.icon} text-xs`} style={{ color: statusColor }} />
                  </div>
                  <span className="text-xs flex-1 truncate"
                    style={{
                      color: stage?.status === 'pending' ? '#3a4557' : stage?.status === 'scanning' ? '#e2c044' : '#8892aa',
                    }}
                  >
                    {sub.label}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {stage?.status === 'scanning' && (
                      <span className="text-xs animate-pulse" style={{ color: '#e2c044', fontSize: 9, fontFamily: 'Orbitron, sans-serif' }}>
                        SCANNING
                      </span>
                    )}
                    {stage?.status === 'complete' && (
                      <span className="text-xs" style={{ color: '#4a5568', fontSize: 9, fontFamily: 'Orbitron, sans-serif' }}>
                        {formatTime(stage.elapsed)}
                      </span>
                    )}
                    <i className={`${statusIcon} text-xs`}
                      style={{
                        color: statusColor,
                        animation: stage?.status === 'scanning' ? 'spin 1s linear infinite' : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold tracking-wider" style={{ color: '#5a6577' }}>
              {bootPhase === 'ready' ? 'SYSTEM READY' : bootPhase === 'stabilizing' ? 'STABILIZING' : 'INITIALIZING'}
            </span>
            <span className="text-xs" style={{ color: '#4a5568', fontFamily: 'Orbitron, sans-serif' }}>
              {Math.floor(progressPct)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
              style={{
                width: `${progressPct}%`,
                background: bootPhase === 'ready'
                  ? 'linear-gradient(90deg, #34d399, #5bc0be)'
                  : 'linear-gradient(90deg, #e2c044, #d4a853)',
                boxShadow: bootPhase === 'ready'
                  ? '0 0 8px rgba(52,211,153,0.4)'
                  : '0 0 6px rgba(226,192,68,0.3)',
              }}
            >
              {bootPhase !== 'ready' && (
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                  animation: 'shimmer 1.5s infinite',
                }} />
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-4 text-xs" style={{ color: '#3a4557' }}>
          <span className="flex items-center gap-1">
            <i className="ri-cpu-line" />
            <span>Grid Controller v3.5</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeCount > 0 ? '#e2c044' : '#34d399' }} />
            <span>{activeCount > 0 ? `${activeCount} active scans` : 'Idle'}</span>
          </span>
          {bootPhase === 'ready' && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1" style={{ color: '#34d399' }}>
                <i className="ri-check-double-line" />
                <span>All systems nominal</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Global shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameEventSystem } from '../../hooks/useGameEventSystem';
import { computeCompactArrivalStardate } from '../../hooks/useGameTime';
import type { GameEvent, FleetMovement } from '../../hooks/useGameEventSystem';

/* ─────────────────────────────────────────────
   FLEET CARD
───────────────────────────────────────────── */
function FleetCard({
  fleet,
  getProgress,
  getTimeRemaining,
  formatTime,
  onRecall,
}: {
  fleet: FleetMovement;
  getProgress: (f: FleetMovement) => number;
  getTimeRemaining: (f: FleetMovement) => number;
  formatTime: (ms: number) => string;
  onRecall: (id: string) => void;
}) {
  const [progress, setProgress] = useState(() => getProgress(fleet));
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(fleet));

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(getProgress(fleet));
      setTimeLeft(getTimeRemaining(fleet));
    }, 1000);
    return () => clearInterval(id);
  }, [fleet, getProgress, getTimeRemaining]);

  const statusLabel = {
    traveling: 'En Route',
    arrived: 'Arrived',
    returning: 'Returning',
    recalled: 'Recalled',
  }[fleet.status];

  return (
    <div
      className="p-3 rounded-lg"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${fleet.missionColor}25`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs font-bold text-white">{fleet.name}</p>
          <p className="text-xs" style={{ color: fleet.missionColor }}>{fleet.mission}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold" style={{ color: fleet.missionColor }}>{statusLabel}</p>
          {fleet.status !== 'arrived' && fleet.status !== 'recalled' && (
            <>
              <p className="text-xs text-gray-400">{formatTime(timeLeft)}</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#d4a853', fontSize: 9 }}>
                {computeCompactArrivalStardate(timeLeft)}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span>{fleet.origin}</span>
        <i className="ri-arrow-right-line text-xs"></i>
        <span>{fleet.destination}</span>
        <span className="ml-auto">{fleet.ships} ships</span>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full h-1.5 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${progress}%`, background: fleet.missionColor }}
        />
      </div>

      {/* Cargo */}
      {fleet.cargo && (
        <div className="flex gap-3 text-xs mb-2">
          <span className="text-yellow-400">{(fleet.cargo.metal / 1000).toFixed(0)}K M</span>
          <span className="text-cyan-400">{(fleet.cargo.crystal / 1000).toFixed(0)}K C</span>
          <span className="text-green-400">{(fleet.cargo.deuterium / 1000).toFixed(0)}K D</span>
        </div>
      )}

      {/* Recall button */}
      {(fleet.status === 'traveling') && (
        <button
          onClick={() => onRecall(fleet.id)}
          className="w-full py-1 rounded text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
          style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
        >
          <i className="ri-arrow-go-back-line mr-1"></i>Recall
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EVENT ITEM
───────────────────────────────────────────── */
function EventItem({ event, onDismiss, onAction }: {
  event: GameEvent;
  onDismiss: (id: string) => void;
  onAction: (path: string) => void;
}) {
  const timeAgo = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  const priorityBg = {
    low: 'rgba(255,255,255,0.02)',
    medium: 'rgba(251,191,36,0.04)',
    high: 'rgba(248,113,113,0.04)',
    critical: 'rgba(248,113,113,0.08)',
  }[event.priority];

  const priorityBorder = {
    low: 'rgba(255,255,255,0.06)',
    medium: 'rgba(251,191,36,0.15)',
    high: 'rgba(248,113,113,0.2)',
    critical: 'rgba(248,113,113,0.4)',
  }[event.priority];

  return (
    <div
      className="p-3 rounded-lg"
      style={{ background: priorityBg, border: `1px solid ${priorityBorder}` }}
    >
      <div className="flex items-start gap-2">
        <div
          className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
          style={{ background: `${event.color}15` }}
        >
          <i className={`${event.icon} text-sm`} style={{ color: event.color }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <p className="text-xs font-bold text-white leading-tight">{event.title}</p>
            <button
              onClick={() => onDismiss(event.id)}
              className="text-gray-600 hover:text-gray-400 cursor-pointer flex-shrink-0"
            >
              <i className="ri-close-line text-xs"></i>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{event.description}</p>
          {event.coordinates && (
            <p className="text-xs font-mono mt-0.5" style={{ color: event.color }}>{event.coordinates}</p>
          )}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-xs text-gray-600">{timeAgo(event.timestamp)}</span>
            {event.actionLabel && event.actionPath && (
              <button
                onClick={() => onAction(event.actionPath!)}
                className="text-xs font-semibold cursor-pointer whitespace-nowrap"
                style={{ color: event.color }}
              >
                {event.actionLabel} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
interface GameEventCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function GameEventCenter({ open, onClose }: GameEventCenterProps) {
  // Only mount the heavy hook content when actually opened
  if (!open) return null;

  return <GameEventCenterContent open={open} onClose={onClose} />;
}

function GameEventCenterContent({ open, onClose }: GameEventCenterProps) {
  const navigate = useNavigate();
  const {
    activeEvents,
    criticalEvents,
    fleets,
    clock,
    dismissEvent,
    dismissAll,
    markAllRead,
    recallFleet,
    getFleetProgress,
    getTimeRemaining,
    formatTime,
    setSpeed,
    setPaused,
  } = useGameEventSystem();

  const [activeTab, setActiveTab] = useState<'events' | 'fleets' | 'clock'>('events');

  useEffect(() => {
    if (open) markAllRead();
  }, [open, markAllRead]);

  const speedColors = ['', '#6b7a95', '#34d399', '#fbbf24', '#f87171'];
  const speedLabels = ['', 'SLOW', 'NORMAL', 'FAST', 'MAX'];

  return (
    <div
      className="fixed z-40 flex flex-col overflow-hidden"
      style={{
        top: 56,
        right: 0,
        bottom: 0,
        width: 340,
        background: 'rgba(2,4,12,0.98)',
        borderLeft: '1px solid rgba(0,212,255,0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="flex items-center gap-2">
          <i className="ri-notification-3-line text-cyan-400 text-sm"></i>
          <span className="text-sm font-bold text-white">Event Center</span>
          {criticalEvents.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#f87171' }}>
              {criticalEvents.length}
            </span>
          )}
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      {/* Game Clock */}
      <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Game Speed</span>
          <span className="text-xs font-bold" style={{ color: clock.paused ? '#f87171' : speedColors[clock.speed] }}>
            {clock.paused ? 'PAUSED' : speedLabels[clock.speed]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(!clock.paused)}
            className="w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-all hover:bg-white/10"
            style={{ color: clock.paused ? '#f87171' : '#34d399', border: `1px solid ${clock.paused ? '#f8717140' : '#34d39940'}` }}
          >
            <i className={`${clock.paused ? 'ri-play-line' : 'ri-pause-line'} text-sm`}></i>
          </button>
          <div className="flex gap-1 flex-1">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className="flex-1 h-8 flex items-center justify-center rounded cursor-pointer transition-all"
                style={{
                  background: clock.speed === s ? `${speedColors[s]}20` : 'transparent',
                  border: `1px solid ${clock.speed === s ? speedColors[s] + '60' : 'rgba(255,255,255,0.08)'}`,
                  color: clock.speed === s ? speedColors[s] : '#4a5568',
                }}
              >
                <span className="text-xs font-bold">{s}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
          <span>Tick #{clock.tick}</span>
          <span>Game time: {Math.floor(clock.gameTime / 3600)}h {Math.floor((clock.gameTime % 3600) / 60)}m</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-2 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        {[
          { id: 'events', label: 'Events', count: activeEvents.length },
          { id: 'fleets', label: 'Fleets', count: fleets.filter((f) => f.status === 'traveling' || f.status === 'returning').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
            style={activeTab === tab.id ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff' } : { color: '#6b7a95' }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{ background: activeTab === tab.id ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)', color: activeTab === tab.id ? '#00d4ff' : '#6b7a95' }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'events' && (
          <div className="p-3 space-y-2">
            {activeEvents.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={dismissAll}
                  className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Dismiss all
                </button>
              </div>
            )}

            {/* Critical events first */}
            {criticalEvents.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-red-400 uppercase tracking-wider font-bold mb-1.5">Critical</p>
                {criticalEvents.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    onDismiss={dismissEvent}
                    onAction={(path) => { navigate(path); onClose(); }}
                  />
                ))}
              </div>
            )}

            {/* Other events */}
            {activeEvents.filter((e) => e.priority !== 'critical').map((event) => (
              <EventItem
                key={event.id}
                event={event}
                onDismiss={dismissEvent}
                onAction={(path) => { navigate(path); onClose(); }}
              />
            ))}

            {activeEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full mb-3" style={{ background: 'rgba(0,212,255,0.08)' }}>
                  <i className="ri-notification-off-line text-2xl text-gray-600"></i>
                </div>
                <p className="text-sm text-gray-500">No active events</p>
                <p className="text-xs text-gray-600 mt-1">Events will appear here as they occur</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fleets' && (
          <div className="p-3 space-y-2">
            {fleets.map((fleet) => (
              <FleetCard
                key={fleet.id}
                fleet={fleet}
                getProgress={getFleetProgress}
                getTimeRemaining={getTimeRemaining}
                formatTime={formatTime}
                onRecall={recallFleet}
              />
            ))}
            {fleets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <i className="ri-rocket-2-line text-4xl text-gray-600 mb-3"></i>
                <p className="text-sm text-gray-500">No active fleets</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';

const TABS = ['Alerts', 'Notifications', 'Log'];

const ALERTS = [
  { id: 1, type: 'critical', title: 'War Declared!', desc: 'Vorlon Extinction has declared war on your empire', time: '0:12 ago', icon: 'ri-alarm-warning-line', color: '#ff4444', read: false },
  { id: 2, type: 'warning', title: 'Fleet Attrition', desc: 'Horde Fleet Alpha has low Horta Buff, supply 1km', time: '2:45 ago', icon: 'ri-rocket-2-line', color: '#e87a5a', read: false },
  { id: 3, type: 'warning', title: 'Construction Complete', desc: 'Supersolids Components: Gene Circuit Drone', time: '8:00 ago', icon: 'ri-tools-line', color: '#c9a227', read: false },
  { id: 4, type: 'info', title: 'Research Complete', desc: 'Research Complete: New Worms Rift Sector', time: '15:30 ago', icon: 'ri-flask-line', color: '#4a9dd4', read: true },
  { id: 5, type: 'warning', title: 'Planet Needs Attention', desc: 'Huge-hub of Anomaly: +48 Medium', time: '22:15 ago', icon: 'ri-planet-line', color: '#c9a227', read: true },
  { id: 6, type: 'warning', title: 'Technology Breakthrough', desc: 'Affects Component: Gene Circuit Sector', time: '1h ago', icon: 'ri-cpu-line', color: '#3aaa5e', read: true },
  { id: 7, type: 'info', title: 'Anomaly Found', desc: 'Science ship discovered anomaly in Vega system', time: '2h ago', icon: 'ri-star-line', color: '#a78bfa', read: true },
];

const LOG_ENTRIES = [
  { text: 'Declared Rival: Zircon Hegemony', date: '2370.04.15', type: 'diplomatic', icon: 'ri-sword-line', color: '#e87a5a' },
  { text: 'Research completed: Artificial Intelligence', date: '2370.03.28', type: 'research', icon: 'ri-cpu-line', color: '#a78bfa' },
  { text: 'Planet colonized: Promise (Vega)', date: '2370.02.11', type: 'colonize', icon: 'ri-planet-line', color: '#3aaa5e' },
  { text: 'War declared by Vorlon Extinction', date: '2370.06.01', type: 'war', icon: 'ri-alarm-warning-line', color: '#ff4444' },
  { text: 'Starbase upgraded: Sol Citadel', date: '2370.01.05', type: 'construction', icon: 'ri-building-4-line', color: '#4a9dd4' },
  { text: 'Federation formed with Salfing Starclave', date: '2369.12.30', type: 'diplomatic', icon: 'ri-shield-star-line', color: '#3aaa5e' },
];

export default function AlertsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Alerts');
  const [alerts, setAlerts] = useState(ALERTS);

  const unread = alerts.filter(a => !a.read).length;

  const markAllRead = () => setAlerts(a => a.map(x => ({ ...x, read: true })));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="flex flex-col rounded-lg overflow-hidden" style={{ width: 500, height: 620, background: '#0e1520', border: '1px solid #1d2d40', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40', background: 'rgba(0,0,0,0.3)' }}>
          <div className="flex items-center gap-2">
            <i className="ri-notification-3-line text-lg" style={{ color: '#e87a5a' }}></i>
            <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Alerts & Notifications</span>
            {unread > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#e87a5a', color: '#fff' }}>{unread}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={markAllRead} className="text-xs px-2 py-1 rounded cursor-pointer" style={{ color: '#6b8aaa', border: '1px solid #1d2d40' }}>Mark All Read</button>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
              <i className="ri-close-line text-sm"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="px-4 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer" style={{ color: tab === t ? '#e87a5a' : '#6b8aaa', borderBottom: tab === t ? '2px solid #e87a5a' : '2px solid transparent' }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
          {tab === 'Alerts' && (
            <div>
              {alerts.map(a => (
                <div key={a.id} onClick={() => setAlerts(prev => prev.map(x => x.id === a.id ? { ...x, read: true } : x))} className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1d2d40', background: a.read ? 'transparent' : `${a.color}06` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${a.color}15` }}>
                    <i className={`${a.icon} text-sm`} style={{ color: a.color }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold" style={{ color: a.read ? '#c8d8e8' : a.color }}>{a.title}</span>
                      {!a.read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: a.color }}></div>}
                    </div>
                    <div className="text-xs" style={{ color: '#6b8aaa' }}>{a.desc}</div>
                    <div className="text-xs mt-1" style={{ color: '#4a5a6a' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Notifications' && (
            <div className="p-4 space-y-3">
              {[
                { cat: 'Military', icon: 'ri-sword-line', color: '#e87a5a', enabled: true },
                { cat: 'Research', icon: 'ri-flask-line', color: '#a78bfa', enabled: true },
                { cat: 'Colonization', icon: 'ri-planet-line', color: '#3aaa5e', enabled: true },
                { cat: 'Diplomacy', icon: 'ri-handshake-line', color: '#4a9dd4', enabled: true },
                { cat: 'Economy', icon: 'ri-exchange-line', color: '#c9a227', enabled: false },
                { cat: 'Fleet Arrivals', icon: 'ri-rocket-2-line', color: '#3aaa5e', enabled: true },
              ].map(n => (
                <div key={n.cat} className="flex items-center justify-between rounded p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid #1d2d40' }}>
                  <div className="flex items-center gap-2">
                    <i className={`${n.icon} text-sm`} style={{ color: n.color }}></i>
                    <span className="text-sm" style={{ color: '#c8d8e8' }}>{n.cat}</span>
                  </div>
                  <div className="w-10 h-5 rounded-full cursor-pointer relative" style={{ background: n.enabled ? '#3aaa5e' : '#1d2d40' }}>
                    <div className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all" style={{ left: n.enabled ? '24px' : '2px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Log' && (
            <div>
              {LOG_ENTRIES.map((l, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid #1d2d40' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: l.color }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs" style={{ color: '#c8d8e8' }}>{l.text}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#4a5a6a' }}>{l.date}</div>
                  </div>
                  <i className={`${l.icon} text-sm flex-shrink-0`} style={{ color: l.color }}></i>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 flex justify-end flex-shrink-0" style={{ borderTop: '1px solid #1d2d40' }}>
          <button onClick={onClose} className="px-4 py-1.5 rounded text-xs font-semibold cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #1d2d40', color: '#6b8aaa' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

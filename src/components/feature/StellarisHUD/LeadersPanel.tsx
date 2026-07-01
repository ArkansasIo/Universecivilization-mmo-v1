import { useState } from 'react';

const TABS = ['Governors', 'Scientists', 'Admirals', 'Generals'];

const LEADERS = {
  Governors: [
    { name: 'Tarla Pyx', level: 6, location: 'Aetherion Prime', title: 'Sector Governor', trait: 'Agrarian', bonus: '+10% Food Output', age: 52, color: '#3aaa5e' },
    { name: 'Dr. Defense Jay', level: 4, location: 'Researching', title: 'Governor', trait: 'Organizational', bonus: '+5% Stability', age: 44, color: '#4a9dd4' },
    { name: 'Adhira', level: 5, location: 'Sol Strike Force', title: 'War Advisor', trait: 'Tactician', bonus: '+8% Army Damage', age: 38, color: '#e87a5a' },
    { name: 'Gordon Vax', level: 3, location: 'Outer Rim Sector', title: 'Governor', trait: 'Expansionist', bonus: '+10% Growth Speed', age: 61, color: '#c9a227' },
    { name: 'Kuthan Ar\'Kel', level: 7, location: 'Defense Army', title: 'Grand Governor', trait: 'Defender', bonus: '+15% Defense', age: 48, color: '#e87a5a' },
  ],
  Scientists: [
    { name: 'Dr. Aelindra Voss', level: 8, location: 'Beta Centauri', title: 'Chief Scientist', trait: 'Archaeologist', bonus: '+20% Research Speed', age: 67, color: '#a78bfa' },
    { name: 'Prof. Tarren', level: 5, location: 'Sol', title: 'Researcher', trait: 'Curator', bonus: '+15% Survey Speed', age: 45, color: '#a78bfa' },
    { name: 'Dr. Nara Elise', level: 6, location: 'Tau Ceti', title: 'Anomaly Expert', trait: 'Specialization: Biology', bonus: '+10% Society Research', age: 38, color: '#3aaa5e' },
  ],
  Admirals: [
    { name: 'Fleet Adm. Sevara', level: 8, location: '1st Strike Force', title: 'Fleet Admiral', trait: 'Aggressive', bonus: '+15% Fire Rate', age: 54, color: '#c9a227' },
    { name: 'Adm. Rykos Khan', level: 6, location: '2nd Strike Force', title: 'Admiral', trait: 'Defender', bonus: '+20% Armor', age: 42, color: '#4a9dd4' },
    { name: 'Adm. Lyanna', level: 5, location: '3rd Strike Force', title: 'Fleet Commander', trait: 'Navigator', bonus: '+25% Speed', age: 36, color: '#a78bfa' },
    { name: 'Adm. Taranis', level: 4, location: 'Unassigned', title: 'Admiral', trait: 'Logistician', bonus: '-10% Upkeep', age: 59, color: '#3aaa5e' },
  ],
  Generals: [
    { name: 'Gen. Vorn', level: 7, location: 'Aetherion Prime', title: 'General', trait: 'Commandant', bonus: '+20% Army Damage', age: 61, color: '#e87a5a' },
    { name: 'Col. Mira Dex', level: 5, location: 'New Dawn', title: 'Commander', trait: 'Cautious', bonus: '+15% Defense', age: 39, color: '#4a9dd4' },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  Governors: '#3aaa5e',
  Scientists: '#a78bfa',
  Admirals: '#c9a227',
  Generals: '#e87a5a',
};

const ROLE_ICONS: Record<string, string> = {
  Governors: 'ri-government-line',
  Scientists: 'ri-microscope-line',
  Admirals: 'ri-rocket-2-line',
  Generals: 'ri-sword-line',
};

export default function LeadersPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Governors');
  const currentLeaders = LEADERS[tab as keyof typeof LEADERS];
  const roleColor = ROLE_COLORS[tab];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        <div className="flex items-center gap-2">
          <i className="ri-user-star-line text-lg" style={{ color: '#c9a227' }}></i>
          <span className="text-sm font-bold" style={{ color: '#c8d8e8' }}>Leaders</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}>
            {Object.values(LEADERS).reduce((s, arr) => s + arr.length, 0)} total
          </span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 cursor-pointer" style={{ color: '#6b8aaa' }}>
          <i className="ri-close-line text-sm"></i>
        </button>
      </div>

      <div className="flex flex-shrink-0" style={{ borderBottom: '1px solid #1d2d40' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-3 py-2 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors flex-shrink-0" style={{ color: tab === t ? ROLE_COLORS[t] : '#6b8aaa', borderBottom: tab === t ? `2px solid ${ROLE_COLORS[t]}` : '2px solid transparent' }}>
            <i className={`${ROLE_ICONS[t]} mr-1`}></i>{t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1d2d40 transparent' }}>
        {currentLeaders.map(l => (
          <div key={l.name} className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid #1d2d40' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${roleColor}12`, border: `1px solid ${roleColor}25` }}>
                <i className={`${ROLE_ICONS[tab]} text-sm`} style={{ color: roleColor }}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold truncate" style={{ color: '#c8d8e8' }}>{l.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${roleColor}15`, color: roleColor }}>Lv.{l.level}</span>
                </div>
                <div className="text-xs truncate" style={{ color: '#6b8aaa' }}>{l.title} · Age {l.age}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold" style={{ color: roleColor }}>{l.trait}</div>
                <div className="text-xs" style={{ color: '#3aaa5e' }}>{l.bonus}</div>
              </div>
            </div>
            <div className="mt-2 text-xs flex items-center gap-2" style={{ color: '#6b8aaa' }}>
              <i className="ri-map-pin-line"></i>
              <span>{l.location}</span>
              <div className="ml-auto flex gap-1">
                {[...Array(Math.min(l.level, 6))].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < l.level ? roleColor : '#1d2d40' }}></div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="p-4">
          <button className="w-full py-2 rounded text-xs font-semibold cursor-pointer" style={{ background: `${roleColor}10`, border: `1px solid ${roleColor}25`, color: roleColor }}>
            <i className="ri-user-add-line mr-1"></i>Recruit {tab.slice(0, -1)}
          </button>
        </div>
      </div>
    </div>
  );
}

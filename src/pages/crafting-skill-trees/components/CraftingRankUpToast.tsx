import { useEffect, useState } from 'react';
import { CraftingTitle } from '@/hooks/useCraftingRank';

interface Props {
  title: CraftingTitle | null;
}

export default function CraftingRankUpToast({ title }: Props) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (title) {
      setLeaving(false);
      setVisible(true);
      const leaveTimer = setTimeout(() => setLeaving(true), 5000);
      const hideTimer = setTimeout(() => setVisible(false), 5600);
      return () => { clearTimeout(leaveTimer); clearTimeout(hideTimer); };
    } else {
      setVisible(false);
    }
  }, [title]);

  if (!visible || !title) return null;

  return (
    <div
      className="fixed top-24 right-6 z-50 rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        width: 340,
        background: `linear-gradient(135deg, #0d1526, #0b1020)`,
        border: `1px solid ${title.color}60`,
        boxShadow: `0 0 40px ${title.glowColor}, 0 8px 32px rgba(0,0,0,0.6)`,
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateX(120%)' : 'translateX(0)',
      }}
    >
      {/* Glow bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${title.color}, transparent)` }}></div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-3">
          <i className="ri-sparkling-2-fill text-xs" style={{ color: title.color }}></i>
          <span className="text-xs font-black tracking-widest uppercase" style={{ color: title.color }}>
            Crafting Rank Up!
          </span>
        </div>

        {/* Main content */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${title.color}20`,
              border: `2px solid ${title.color}60`,
              boxShadow: `0 0 16px ${title.glowColor}`,
            }}
          >
            <i className={`${title.icon} text-xl`} style={{ color: title.color }}></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-0.5" style={{ color: '#6b7a95' }}>You are now a</p>
            <p className="text-base font-black leading-tight" style={{ color: title.color }}>{title.title}</p>
            <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>{title.subtitle}</p>
          </div>
        </div>

        {/* Bonus */}
        <div
          className="mt-3 rounded-lg px-3 py-2 flex items-center gap-2"
          style={{ background: `${title.color}10`, border: `1px solid ${title.color}25` }}
        >
          <i className="ri-gift-line text-sm flex-shrink-0" style={{ color: title.color }}></i>
          <span className="text-xs font-semibold" style={{ color: '#c8d4e8' }}>{title.bonusDesc}</span>
        </div>
      </div>

      {/* Progress bar (countdown) */}
      <div className="h-0.5 w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="h-full"
          style={{
            width: '100%',
            background: title.color,
            animation: 'drain 5s linear forwards',
            transformOrigin: 'left',
          }}
        ></div>
      </div>

      <style>{`
        @keyframes drain {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
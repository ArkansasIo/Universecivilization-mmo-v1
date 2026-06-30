import { useEffect, useRef } from 'react';
import { useAchievementSystem, UnlockToast } from '@/hooks/useAchievementSystem';
import { ACHIEVEMENT_MAP } from '@/config/achievementDefinitions';

const CATEGORY_COLORS: Record<string, string> = {
  building:    '#34d399',
  research:    '#a78bfa',
  combat:      '#f87171',
  fleet:       '#00d4ff',
  economy:     '#fbbf24',
  exploration: '#fb923c',
};

function SingleToast({ toast, onDismiss }: { toast: UnlockToast; onDismiss: () => void }) {
  const def = ACHIEVEMENT_MAP[toast.achievementId];
  const color = CATEGORY_COLORS[toast.category] ?? '#00d4ff';
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(), 5800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 pointer-events-auto"
      style={{
        background: `linear-gradient(135deg, ${color}18, ${color}0a)`,
        border: `1px solid ${color}45`,
        minWidth: 300,
        maxWidth: 380,
        animation: 'slideInRight 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Glow icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}22`, border: `1px solid ${color}40`, boxShadow: `0 0 16px ${color}40` }}
      >
        <i className={`${def?.icon ?? 'ri-trophy-line'} text-2xl`} style={{ color }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color }}>
          Achievement Unlocked!
        </p>
        <p className="text-sm font-bold text-white truncate">{toast.achievementName}</p>
        {def?.description && (
          <p className="text-xs text-gray-400 leading-tight mt-0.5 truncate">{def.description}</p>
        )}
        <span
          className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
          style={{ background: `${color}18`, color }}
        >
          {toast.category}
        </span>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 cursor-pointer hover:bg-white/10 transition-all"
        style={{ color: '#6b7280' }}
      >
        <i className="ri-close-line text-sm" />
      </button>
    </div>
  );
}

export default function AchievementToastContainer() {
  const { toasts, dismissToast } = useAchievementSystem();

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: 400 }}
      >
        {toasts.map(toast => (
          <SingleToast
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
}
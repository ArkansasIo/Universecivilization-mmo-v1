import { CRAFTING_TITLES } from '@/hooks/useCraftingRank';

interface RecipeUnlockBadgeProps {
  minRank: number;
  unlocked: boolean;
  compact?: boolean;
}

/** A small badge shown on recipe cards indicating which rank unlocks them */
export default function RecipeUnlockBadge({ minRank, unlocked, compact = false }: RecipeUnlockBadgeProps) {
  const rankDef = CRAFTING_TITLES[minRank - 1];
  if (!rankDef) return null;

  if (unlocked) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${compact ? 'text-[10px]' : ''}`}
        style={{
          color: rankDef.color,
          borderColor: `${rankDef.color}40`,
          background: `${rankDef.color}15`,
        }}
      >
        <i className="ri-lock-unlock-line"></i>
        {compact ? rankDef.badge : rankDef.title}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border border-slate-600/50 bg-slate-800/80 text-slate-400 ${compact ? 'text-[10px]' : ''}`}
    >
      <i className="ri-lock-line"></i>
      {compact ? `R${minRank}` : `Rank ${minRank}: ${rankDef.badge}`}
    </span>
  );
}
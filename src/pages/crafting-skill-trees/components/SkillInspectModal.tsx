import { SkillNode } from './SkillTreeNode';

interface Props {
  node: SkillNode | null;
  allNodes: SkillNode[];
  onClose: () => void;
  onUpgrade: (id: string) => void;
  availablePoints: number;
}

function isNodeUnlocked(node: SkillNode, allNodes: SkillNode[]): boolean {
  if (!node.requires || node.requires.length === 0) return true;
  return node.requires.every((reqId) => {
    const req = allNodes.find((n) => n.id === reqId);
    return req && req.currentLevel >= 1;
  });
}

const TIER_LABELS: Record<number, string> = {
  1: 'Apprentice',
  2: 'Journeyman',
  3: 'Expert',
  4: 'Master',
  5: 'Grandmaster',
};

const TIER_COLORS: Record<number, string> = {
  1: '#9ca3af',
  2: '#4ade80',
  3: '#60a5fa',
  4: '#c084fc',
  5: '#fbbf24',
};

export default function SkillInspectModal({ node, allNodes, onClose, onUpgrade, availablePoints }: Props) {
  if (!node) return null;

  const unlocked = isNodeUnlocked(node, allNodes);
  const isMaxed = node.currentLevel >= node.maxLevel;
  const canUpgrade = unlocked && !isMaxed && availablePoints >= node.cost.skillPoints;

  const requiresNodes = (node.requires || []).map((id) => allNodes.find((n) => n.id === id)).filter(Boolean) as SkillNode[];

  // Calculate current bonus value
  const getBonusValue = (level: number) => {
    const match = node.bonusPerLevel.match(/([\d.]+)/);
    if (!match) return node.bonusPerLevel;
    const perLevel = parseFloat(match[1]);
    const unit = node.bonusPerLevel.replace(/([\d.]+)/, '').trim();
    return `+${(perLevel * level).toFixed(1).replace('.0', '')}${unit}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)' }}></div>
      <div
        className="relative w-full max-w-lg rounded-xl overflow-hidden z-10"
        style={{
          background: 'linear-gradient(135deg, #0a0f1e, #0d1526)',
          border: `2px solid ${node.color}50`,
          boxShadow: `0 0 40px ${node.color}20`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-4 px-6 py-4"
          style={{ borderBottom: `1px solid ${node.color}25`, background: `${node.color}10` }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${node.color}20`, border: `2px solid ${node.color}50` }}
          >
            <i className={`${node.icon} text-2xl`} style={{ color: node.color }}></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-white">{node.name}</h2>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: `${TIER_COLORS[node.tier]}20`,
                  color: TIER_COLORS[node.tier],
                  border: `1px solid ${TIER_COLORS[node.tier]}40`,
                }}
              >
                Tier {node.tier} · {TIER_LABELS[node.tier]}
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: '#8892aa' }}>{node.description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer hover:bg-white/10 flex-shrink-0"
            style={{ color: '#6b7a95' }}
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Level progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: '#8892aa' }}>SKILL LEVEL</span>
              <span className="text-sm font-bold" style={{ color: node.color }}>
                {node.currentLevel} / {node.maxLevel}
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: node.maxLevel }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-2.5 rounded-full transition-all"
                  style={{
                    background: i < node.currentLevel ? node.color : '#1e2a3a',
                    boxShadow: i < node.currentLevel ? `0 0 6px ${node.color}60` : 'none',
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Passive bonus */}
          <div
            className="rounded-lg p-4"
            style={{ background: `${node.color}10`, border: `1px solid ${node.color}25` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <i className="ri-pulse-line text-sm" style={{ color: node.color }}></i>
              <span className="text-xs font-bold tracking-wider" style={{ color: node.color }}>PASSIVE BONUS</span>
            </div>
            <p className="text-sm font-semibold text-white mb-1">{node.passiveBonus}</p>
            <div className="flex items-center gap-3 flex-wrap mt-2">
              {node.currentLevel > 0 && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${node.color}20`, color: node.color }}
                >
                  <i className="ri-arrow-up-line text-xs"></i>
                  Current: {getBonusValue(node.currentLevel)}
                </div>
              )}
              {!isMaxed && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#8892aa' }}
                >
                  <i className="ri-arrow-right-up-line text-xs"></i>
                  Next: {getBonusValue(node.currentLevel + 1)}
                </div>
              )}
              {isMaxed && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: `${node.color}20`, color: node.color }}
                >
                  <i className="ri-check-line text-xs"></i>
                  MAX: {getBonusValue(node.maxLevel)}
                </div>
              )}
            </div>
            <p className="text-xs mt-2" style={{ color: '#6b7a95' }}>
              {node.bonusPerLevel} per level
            </p>
          </div>

          {/* Unlocks */}
          {node.unlocks && (
            <div
              className="rounded-lg p-3 flex items-start gap-3"
              style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)' }}
            >
              <i className="ri-lock-unlock-line text-sm mt-0.5" style={{ color: '#fbbf24' }}></i>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color: '#fbbf24' }}>UNLOCKS</p>
                <p className="text-xs" style={{ color: '#c0a84d' }}>{node.unlocks}</p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {requiresNodes.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: '#6b7a95' }}>REQUIRES</p>
              <div className="flex flex-wrap gap-2">
                {requiresNodes.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                    style={{
                      background: req.currentLevel >= 1 ? `${req.color}15` : 'rgba(30,42,58,0.5)',
                      border: `1px solid ${req.currentLevel >= 1 ? req.color + '40' : '#2d3748'}`,
                      color: req.currentLevel >= 1 ? req.color : '#4a5568',
                    }}
                  >
                    <i className={`${req.icon} text-xs`}></i>
                    {req.name}
                    {req.currentLevel >= 1 ? (
                      <i className="ri-check-line text-xs" style={{ color: '#4ade80' }}></i>
                    ) : (
                      <i className="ri-close-line text-xs" style={{ color: '#f87171' }}></i>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upgrade cost */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(168,139,250,0.1)', border: '1px solid rgba(168,139,250,0.3)', color: '#a78bfa' }}
              >
                <i className="ri-sparkling-line text-xs"></i>
                {node.cost.skillPoints} Skill Points
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}
              >
                <i className="ri-coin-line text-xs"></i>
                {node.cost.credits.toLocaleString()} Credits
              </div>
            </div>
            <button
              onClick={() => { if (canUpgrade) { onUpgrade(node.id); onClose(); } }}
              disabled={!canUpgrade}
              className="px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: canUpgrade ? `linear-gradient(135deg, ${node.color}, ${node.color}cc)` : '#1e2a3a',
                color: canUpgrade ? '#000' : '#4a5568',
                border: `1px solid ${canUpgrade ? node.color : '#2d3748'}`,
              }}
            >
              {isMaxed ? 'Maxed Out' : !unlocked ? 'Locked' : !canUpgrade ? 'Insufficient SP' : 'Upgrade Skill'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';

export interface SkillNode {
  id: string;
  name: string;
  icon: string;
  description: string;
  passiveBonus: string;
  bonusPerLevel: string;
  maxLevel: number;
  currentLevel: number;
  requires?: string[];
  tier: number;
  color: string;
  cost: { skillPoints: number; credits: number };
  unlocks?: string;
}

interface SkillTreeNodeProps {
  node: SkillNode;
  allNodes: SkillNode[];
  onUpgrade: (id: string) => void;
  onInspect: (node: SkillNode) => void;
  availablePoints: number;
}

function isNodeUnlocked(node: SkillNode, allNodes: SkillNode[]): boolean {
  if (!node.requires || node.requires.length === 0) return true;
  return node.requires.every((reqId) => {
    const req = allNodes.find((n) => n.id === reqId);
    return req && req.currentLevel >= 1;
  });
}

export default function SkillTreeNode({
  node,
  allNodes,
  onUpgrade,
  onInspect,
  availablePoints,
}: SkillTreeNodeProps) {
  const [hovered, setHovered] = useState(false);
  const unlocked = isNodeUnlocked(node, allNodes);
  const isMaxed = node.currentLevel >= node.maxLevel;
  const canUpgrade = unlocked && !isMaxed && availablePoints >= node.cost.skillPoints;
  const progress = node.maxLevel > 0 ? (node.currentLevel / node.maxLevel) * 100 : 0;

  const tierColors: Record<number, string> = {
    1: '#9ca3af',
    2: '#4ade80',
    3: '#60a5fa',
    4: '#c084fc',
    5: '#fbbf24',
  };
  const borderColor = unlocked ? tierColors[node.tier] || node.color : '#2d3748';

  return (
    <div
      className="relative flex flex-col cursor-pointer select-none"
      style={{ width: 110 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onInspect(node)}
    >
      {/* Node box */}
      <div
        className="rounded-lg p-2.5 flex flex-col items-center gap-1.5 transition-all duration-200"
        style={{
          background: unlocked
            ? node.currentLevel > 0
              ? `linear-gradient(135deg, ${node.color}25, ${node.color}12)`
              : 'rgba(13,21,38,0.9)'
            : 'rgba(10,15,30,0.6)',
          border: `2px solid ${hovered ? borderColor : unlocked ? borderColor + '80' : '#1e2a3a'}`,
          boxShadow: hovered && unlocked ? `0 0 14px ${borderColor}40` : 'none',
          opacity: unlocked ? 1 : 0.45,
        }}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: unlocked
              ? `${node.color}22`
              : 'rgba(30,42,58,0.5)',
            border: `1px solid ${unlocked ? node.color + '50' : '#1e2a3a'}`,
          }}
        >
          <i
            className={`${node.icon} text-lg`}
            style={{ color: unlocked ? node.color : '#3d4e63' }}
          ></i>
        </div>

        {/* Name */}
        <span
          className="text-center font-semibold leading-tight"
          style={{
            color: unlocked ? (node.currentLevel > 0 ? '#e2e8f0' : '#8892aa') : '#3d4e63',
            fontSize: 10,
          }}
        >
          {node.name}
        </span>

        {/* Level display */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: node.maxLevel }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-1.5 rounded-full"
              style={{
                background: i < node.currentLevel
                  ? node.color
                  : unlocked ? '#2d3748' : '#1a2233',
              }}
            ></div>
          ))}
        </div>
        <span
          className="text-xs"
          style={{ color: unlocked ? '#6b7a95' : '#2d3748', fontSize: 9 }}
        >
          {node.currentLevel}/{node.maxLevel}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 mt-1 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, background: node.color }}
        ></div>
      </div>

      {/* Maxed badge */}
      {isMaxed && (
        <div
          className="absolute -top-1.5 -right-1.5 text-xs px-1 py-0.5 rounded font-bold"
          style={{ background: node.color, color: '#000', fontSize: 8 }}
        >
          MAX
        </div>
      )}

      {/* Locked badge */}
      {!unlocked && (
        <div
          className="absolute -top-1.5 -right-1.5 text-xs px-1 py-0.5 rounded"
          style={{ background: '#1e2a3a', color: '#4a5568', fontSize: 8, border: '1px solid #2d3748' }}
        >
          <i className="ri-lock-line text-xs"></i>
        </div>
      )}

      {/* Hover upgrade button */}
      {hovered && unlocked && !isMaxed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (canUpgrade) onUpgrade(node.id);
          }}
          className="mt-1 w-full py-1 rounded text-xs font-bold transition-all whitespace-nowrap"
          style={{
            background: canUpgrade ? node.color : '#1e2a3a',
            color: canUpgrade ? '#000' : '#4a5568',
            fontSize: 9,
            border: `1px solid ${canUpgrade ? node.color : '#2d3748'}`,
          }}
        >
          {canUpgrade ? `+1 (${node.cost.skillPoints} SP)` : 'Need SP'}
        </button>
      )}
    </div>
  );
}
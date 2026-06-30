import { useState, useCallback } from 'react';
import SkillTreeNode, { SkillNode } from './SkillTreeNode';
import SkillInspectModal from './SkillInspectModal';
import CraftingRankUpToast from './CraftingRankUpToast';
import { useCraftingRank } from '@/hooks/useCraftingRank';

interface SkillTreeLayoutProps {
  treeId: string;
  treeName: string;
  treeIcon: string;
  treeColor: string;
  treeDescription: string;
  tiers: SkillNode[][];
  tierLabels?: string[];
  loreText?: string;
}

export default function SkillTreeLayout({
  treeId,
  treeName,
  treeIcon,
  treeColor,
  treeDescription,
  tiers,
  tierLabels,
  loreText,
}: SkillTreeLayoutProps) {
  const [nodes, setNodes] = useState<SkillNode[]>(() => tiers.flat());
  const [skillPoints, setSkillPoints] = useState(25);
  const [spentPoints, setSpentPoints] = useState(0);
  const [inspecting, setInspecting] = useState<SkillNode | null>(null);
  const [lastUpgraded, setLastUpgraded] = useState<string | null>(null);

  const { recordSpend, recentUnlock, currentRank, totalSpent } = useCraftingRank();

  const handleUpgrade = useCallback((id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        if (n.currentLevel >= n.maxLevel) return n;
        return { ...n, currentLevel: n.currentLevel + 1 };
      })
    );
    const node = nodes.find((n) => n.id === id);
    if (node) {
      setSkillPoints((sp) => sp - node.cost.skillPoints);
      setSpentPoints((s) => s + node.cost.skillPoints);
      recordSpend(treeId, node.cost.skillPoints);
    }
    setLastUpgraded(id);
    setTimeout(() => setLastUpgraded(null), 1000);
  }, [nodes, treeId, recordSpend]);

  const handleReset = () => {
    // Refund SP locally only (global rank is not reversed on reset)
    setNodes((prev) => prev.map((n) => ({ ...n, currentLevel: 0 })));
    setSkillPoints(skillPoints + spentPoints);
    setSpentPoints(0);
  };

  // Split nodes back into tiers for display
  const tiersDisplay: SkillNode[][] = tiers.map((tierNodes) =>
    tierNodes.map((origNode) => nodes.find((n) => n.id === origNode.id) || origNode)
  );

  const totalInvested = nodes.reduce((acc, n) => acc + n.currentLevel, 0);
  const totalMaxable = nodes.reduce((acc, n) => acc + n.maxLevel, 0);
  const masteryPct = totalMaxable > 0 ? Math.round((totalInvested / totalMaxable) * 100) : 0;

  const TIER_NAMES = tierLabels || ['Apprentice', 'Journeyman', 'Expert', 'Master', 'Grandmaster'];
  const TIER_COLORS = ['#9ca3af', '#4ade80', '#60a5fa', '#c084fc', '#fbbf24'];

  return (
    <div className="min-h-screen px-6 py-6" style={{ background: 'transparent' }}>
      <CraftingRankUpToast title={recentUnlock} />
      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${treeColor}20`,
            border: `2px solid ${treeColor}50`,
            boxShadow: `0 0 20px ${treeColor}20`,
          }}
        >
          <i className={`${treeIcon} text-3xl`} style={{ color: treeColor }}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-black text-white tracking-wide">{treeName}</h1>
            <span
              className="px-3 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: `${treeColor}20`,
                color: treeColor,
                border: `1px solid ${treeColor}40`,
              }}
            >
              Crafting Skill Tree
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#8892aa' }}>{treeDescription}</p>
          {loreText && (
            <p className="text-xs mt-1.5 italic" style={{ color: '#4a5568' }}>&quot;{loreText}&quot;</p>
          )}
        </div>

        {/* Stats panel */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Global Rank Badge */}
          <div
            className="flex flex-col items-center px-4 py-2.5 rounded-lg"
            style={{ background: `${currentRank.color}10`, border: `1px solid ${currentRank.color}35`, boxShadow: `0 0 10px ${currentRank.glowColor}` }}
          >
            <i className={`${currentRank.icon} text-base`} style={{ color: currentRank.color }}></i>
            <span className="text-xs font-black mt-0.5" style={{ color: currentRank.color }}>{currentRank.badge}</span>
            <span className="text-xs" style={{ color: '#6b7a95' }}>{totalSpent} SP</span>
          </div>
          <div
            className="flex flex-col items-center px-4 py-2.5 rounded-lg"
            style={{ background: 'rgba(168,139,250,0.1)', border: '1px solid rgba(168,139,250,0.3)' }}
          >
            <i className="ri-sparkling-line text-base" style={{ color: '#a78bfa' }}></i>
            <span className="text-lg font-black" style={{ color: '#a78bfa' }}>{skillPoints}</span>
            <span className="text-xs" style={{ color: '#6b7a95' }}>Skill Points</span>
          </div>
          <div
            className="flex flex-col items-center px-4 py-2.5 rounded-lg"
            style={{ background: `${treeColor}10`, border: `1px solid ${treeColor}30` }}
          >
            <i className="ri-bar-chart-line text-base" style={{ color: treeColor }}></i>
            <span className="text-lg font-black" style={{ color: treeColor }}>{masteryPct}%</span>
            <span className="text-xs" style={{ color: '#6b7a95' }}>Mastery</span>
          </div>
          <button
            onClick={handleReset}
            className="flex flex-col items-center px-4 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-red-900/20 whitespace-nowrap"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
          >
            <i className="ri-restart-line text-base"></i>
            <span className="text-xs mt-0.5">Reset</span>
          </button>
        </div>
      </div>

      {/* Mastery bar */}
      <div className="mb-7">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold" style={{ color: '#6b7a95' }}>OVERALL MASTERY — {totalInvested} / {totalMaxable} POINTS</span>
          <span className="text-xs font-bold" style={{ color: treeColor }}>{masteryPct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e2a3a' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${masteryPct}%`,
              background: `linear-gradient(90deg, ${treeColor}80, ${treeColor})`,
              boxShadow: `0 0 8px ${treeColor}60`,
            }}
          ></div>
        </div>
      </div>

      {/* Skill tree tiers */}
      <div className="space-y-8">
        {tiersDisplay.map((tierNodes, ti) => (
          <div key={ti}>
            {/* Tier label */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: `${TIER_COLORS[ti]}15`,
                  color: TIER_COLORS[ti],
                  border: `1px solid ${TIER_COLORS[ti]}40`,
                }}
              >
                Tier {ti + 1} — {TIER_NAMES[ti]}
              </div>
              <div className="flex-1 h-px" style={{ background: `${TIER_COLORS[ti]}20` }}></div>
              <span className="text-xs" style={{ color: '#4a5568' }}>
                {tierNodes.filter((n) => n.currentLevel > 0).length}/{tierNodes.length} active
              </span>
            </div>

            {/* Nodes row */}
            <div className="flex flex-wrap gap-4">
              {tierNodes.map((node) => (
                <div
                  key={node.id}
                  className="relative"
                  style={{
                    animation: lastUpgraded === node.id ? 'none' : undefined,
                    transform: lastUpgraded === node.id ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <SkillTreeNode
                    node={node}
                    allNodes={nodes}
                    onUpgrade={handleUpgrade}
                    onInspect={(n) => setInspecting(nodes.find((x) => x.id === n.id) || n)}
                    availablePoints={skillPoints}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="mt-8 rounded-lg p-4 flex flex-wrap gap-4"
        style={{ background: 'rgba(13,21,38,0.8)', border: '1px solid rgba(0,212,255,0.1)' }}
      >
        <span className="text-xs font-bold mr-2" style={{ color: '#4a5568' }}>LEGEND:</span>
        {[
          { color: '#9ca3af', label: 'Tier 1 · Apprentice' },
          { color: '#4ade80', label: 'Tier 2 · Journeyman' },
          { color: '#60a5fa', label: 'Tier 3 · Expert' },
          { color: '#c084fc', label: 'Tier 4 · Master' },
          { color: '#fbbf24', label: 'Tier 5 · Grandmaster' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color }}></div>
            <span className="text-xs" style={{ color: '#6b7a95' }}>{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2">
          <i className="ri-lock-line text-xs" style={{ color: '#3d4e63' }}></i>
          <span className="text-xs" style={{ color: '#6b7a95' }}>Requires prerequisite</span>
        </div>
      </div>

      {/* Inspect modal */}
      <SkillInspectModal
        node={inspecting}
        allNodes={nodes}
        onClose={() => setInspecting(null)}
        onUpgrade={(id) => {
          handleUpgrade(id);
          setInspecting((prev) => prev ? nodes.find((n) => n.id === id) || prev : null);
        }}
        availablePoints={skillPoints}
      />
    </div>
  );
}
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMaterialWishlist } from '@/hooks/useMaterialWishlist';

const WORKSHOP_COLORS: Record<string, { border: string; bg: string; text: string; icon: string; path: string }> = {
  forge: { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', icon: 'ri-fire-fill', path: '/crafting-forge' },
  laboratory: { border: 'border-fuchsia-500/30', bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', icon: 'ri-flask-line', path: '/crafting-augmentations' },
  artifacts: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', icon: 'ri-ancient-pavilion-line', path: '/crafting-artifacts' },
};

export default function MaterialWishlistPanel() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromWishlist,
    removeRecipeFromWishlist,
    clearWishlist,
    overallProgress,
    readyCount,
    totalCount,
    recipeProgress,
  } = useMaterialWishlist();

  const [filterWorkshop, setFilterWorkshop] = useState<string>('all');
  const [expandRecipes, setExpandRecipes] = useState<Record<string, boolean>>();

  const filteredItems = useMemo(() => {
    if (filterWorkshop === 'all') return items;
    return items.filter(i => i.workshop === filterWorkshop);
  }, [items, filterWorkshop]);

  const filteredRecipes = useMemo(() => {
    if (filterWorkshop === 'all') return recipeProgress;
    return recipeProgress.filter(r => r.workshop === filterWorkshop);
  }, [recipeProgress, filterWorkshop]);

  const toggleRecipe = (recipeId: string) => {
    setExpandRecipes(prev => ({ ...prev, [recipeId]: !prev[recipeId] }));
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700/50 border border-slate-600/50">
            <i className="ri-bookmark-line text-xl text-slate-400"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Materials Wishlist</h3>
            <p className="text-xs text-slate-400">Pin materials from any recipe to track progress</p>
          </div>
        </div>
        <div className="text-center py-6">
          <i className="ri-bookmark-3-line text-4xl text-slate-600 mb-2"></i>
          <p className="text-sm text-slate-500">No materials pinned yet</p>
          <p className="text-xs text-slate-600 mt-1">Open a recipe and click "Pin to Wishlist"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
              <i className="ri-bookmark-fill text-xl text-cyan-400"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Materials Wishlist</h3>
              <p className="text-xs text-slate-400">
                {readyCount} of {totalCount} materials ready · {Math.round(overallProgress * 100)}% overall
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <i className={`text-lg ${isOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
            </button>
            <button
              onClick={clearWishlist}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Clear all"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-slate-700/50 rounded-full h-2.5 mb-3">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 transition-all duration-500"
            style={{ width: `${overallProgress * 100}%` }}
          ></div>
        </div>

        {/* Workshop filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterWorkshop('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterWorkshop === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-700/40 text-slate-400 border border-slate-700 hover:text-white'
            }`}
          >
            All Workshops
          </button>
          {Object.entries(WORKSHOP_COLORS).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterWorkshop(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                filterWorkshop === key
                  ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                  : 'bg-slate-700/40 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <i className={`${cfg.icon} mr-1`}></i>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Groups */}
      {isOpen && (
        <div className="p-5 space-y-4 max-h-[480px] overflow-y-auto">
          {filteredRecipes.length === 0 && (
            <p className="text-center text-sm text-slate-500 py-4">No pinned recipes for this workshop</p>
          )}

          {filteredRecipes.map(recipe => {
            const cfg = WORKSHOP_COLORS[recipe.workshop];
            const isExpanded = expandRecipes[recipe.recipeId] ?? true;
            const recipeItems = filteredItems.filter(i => i.recipeId === recipe.recipeId);

            return (
              <div
                key={recipe.recipeId}
                className={`rounded-xl border ${cfg.border} overflow-hidden`}
              >
                {/* Recipe header */}
                <div
                  className={`${cfg.bg} p-3 cursor-pointer`}
                  onClick={() => toggleRecipe(recipe.recipeId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className={`${cfg.icon} ${cfg.text}`}></i>
                      <span className="text-sm font-bold text-white">{recipe.recipeName}</span>
                      <span className="text-xs text-slate-500">
                        {recipe.readyMaterials}/{recipe.totalMaterials} ready
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700/50 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${cfg.text.replace('text-', 'bg-')}`}
                          style={{ width: `${recipe.progress * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-bold ${cfg.text}`}>
                        {Math.round(recipe.progress * 100)}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecipeFromWishlist(recipe.recipeId);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                      <i className={`text-slate-400 ${isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                    </div>
                  </div>
                </div>

                {/* Materials list */}
                {isExpanded && (
                  <div className="p-3 space-y-2">
                    {recipeItems.map(item => {
                      const pct = Math.min(100, (item.amountOwned / item.amountNeeded) * 100);
                      const isReady = item.amountOwned >= item.amountNeeded;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/40 hover:bg-slate-900/60 transition-all"
                        >
                          <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg border ${isReady ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-700/40 border-slate-600/40'}`}>
                            <i className={`${item.icon} ${isReady ? 'text-green-400' : 'text-slate-400'} text-sm`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-white truncate">{item.materialName}</span>
                              <span className={`text-xs font-bold ${isReady ? 'text-green-400' : 'text-slate-400'}`}>
                                {item.amountOwned.toLocaleString()} / {item.amountNeeded.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-slate-700/40 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                  isReady
                                    ? 'bg-green-400'
                                    : pct > 50
                                    ? 'bg-cyan-400'
                                    : pct > 25
                                    ? 'bg-yellow-400'
                                    : 'bg-red-400'
                                }`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                            title="Remove"
                          >
                            <i className="ri-close-line text-sm"></i>
                          </button>
                        </div>
                      );
                    })}

                    {/* CTA when ready */}
                    {recipe.readyMaterials === recipe.totalMaterials && (
                      <div className="mt-2">
                        <Link
                          to={cfg.path}
                          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-bold hover:bg-green-500/20 transition-all"
                        >
                          <i className="ri-check-double-line"></i>
                          All materials ready — Craft Now
                          <i className="ri-arrow-right-line"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Collapsed summary */}
      {!isOpen && (
        <div className="p-4 flex items-center gap-4">
          {filteredRecipes.slice(0, 3).map(recipe => {
            const cfg = WORKSHOP_COLORS[recipe.workshop];
            return (
              <div key={recipe.recipeId} className={`flex-1 ${cfg.bg} border ${cfg.border} rounded-lg p-2`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <i className={`${cfg.icon} ${cfg.text} text-xs`}></i>
                  <span className="text-xs font-bold text-white truncate">{recipe.recipeName}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${cfg.text.replace('text-', 'bg-')}`}
                    style={{ width: `${recipe.progress * 100}%` }}
                  ></div>
                </div>
                <p className={`text-[10px] ${cfg.text} mt-0.5`}>
                  {recipe.readyMaterials}/{recipe.totalMaterials} ready
                </p>
              </div>
            );
          })}
          {filteredRecipes.length > 3 && (
            <div className="text-xs text-slate-500">+{filteredRecipes.length - 3} more</div>
          )}
        </div>
      )}
    </div>
  );
}
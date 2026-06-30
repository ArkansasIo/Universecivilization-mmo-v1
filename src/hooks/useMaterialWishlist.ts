import { useState, useCallback, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  materialName: string;
  icon: string;
  amountNeeded: number;
  amountOwned: number;
  recipeName: string;
  recipeId: string;
  workshop: 'forge' | 'laboratory' | 'artifacts';
  addedAt: string;
}

const STORAGE_KEY = 'crafting-material-wishlist';

function loadWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useMaterialWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(loadWishlist);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    saveWishlist(items);
  }, [items]);

  const addToWishlist = useCallback((
    materials: { name: string; icon: string; amount: number; owned: number }[],
    recipeName: string,
    recipeId: string,
    workshop: 'forge' | 'laboratory' | 'artifacts'
  ) => {
    setItems(prev => {
      const next = [...prev];
      materials.forEach(mat => {
        const existingIndex = next.findIndex(
          i => i.materialName === mat.name && i.recipeId === recipeId
        );
        if (existingIndex >= 0) {
          next[existingIndex] = {
            ...next[existingIndex],
            amountNeeded: mat.amount,
            amountOwned: mat.owned,
            addedAt: new Date().toISOString(),
          };
        } else {
          next.push({
            id: `${recipeId}-${mat.name}-${Date.now()}`,
            materialName: mat.name,
            icon: mat.icon,
            amountNeeded: mat.amount,
            amountOwned: mat.owned,
            recipeName,
            recipeId,
            workshop,
            addedAt: new Date().toISOString(),
          });
        }
      });
      return next;
    });
    setIsOpen(true);
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const removeRecipeFromWishlist = useCallback((recipeId: string) => {
    setItems(prev => prev.filter(i => i.recipeId !== recipeId));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const updateOwned = useCallback((materialName: string, newOwned: number) => {
    setItems(prev =>
      prev.map(i =>
        i.materialName === materialName ? { ...i, amountOwned: newOwned } : i
      )
    );
  }, []);

  const overallProgress = items.length > 0
    ? items.reduce((sum, i) => sum + Math.min(1, i.amountOwned / i.amountNeeded), 0) / items.length
    : 0;

  const readyCount = items.filter(i => i.amountOwned >= i.amountNeeded).length;

  const byRecipe = items.reduce<Record<string, WishlistItem[]>>((acc, item) => {
    if (!acc[item.recipeId]) acc[item.recipeId] = [];
    acc[item.recipeId].push(item);
    return acc;
  }, {});

  const recipeProgress = Object.entries(byRecipe).map(([recipeId, mats]) => ({
    recipeId,
    recipeName: mats[0]?.recipeName || '',
    workshop: mats[0]?.workshop || 'forge',
    totalMaterials: mats.length,
    readyMaterials: mats.filter(m => m.amountOwned >= m.amountNeeded).length,
    progress: mats.reduce((s, m) => s + Math.min(1, m.amountOwned / m.amountNeeded), 0) / mats.length,
  }));

  return {
    items,
    isOpen,
    setIsOpen,
    addToWishlist,
    removeFromWishlist,
    removeRecipeFromWishlist,
    clearWishlist,
    updateOwned,
    overallProgress,
    readyCount,
    byRecipe,
    recipeProgress,
    totalCount: items.length,
  };
}
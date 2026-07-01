// GameNavigation — re-export the real game layout navigation for backward compatibility
import GameLayout from './GameLayout';

export default function GameNavigation() {
  // This component is deprecated; GameLayout now provides all navigation.
  // Pages should not render this directly — it is kept for import compatibility only.
  return null;
}

// Re-export the full GameLayout for any page that needs to wrap itself
export { GameLayout };
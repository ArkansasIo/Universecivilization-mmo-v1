
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useAuth } from '../../contexts/AuthContext';

export default function GameLoop() {
  const { user } = useAuth();
  const location = useLocation();
  const { calculateProduction, processFleetMovements } = useGameLoop();

  useEffect(() => {
    // Pages where GameLoop should run (only authenticated game pages)
    const gamePages = [
      '/dashboard',
      '/buildings',
      '/research',
      '/fleet',
      '/shipyard',
      '/defense',
      '/empire',
      '/colonies',
      '/galaxy',
      '/marketplace',
      '/alliance',
      '/missions',
      '/officers',
      '/skills',
      '/megastructures',
      '/motherships',
      '/starbases',
      '/moonbases'
    ];

    const isGamePage = gamePages.some(path => 
      location.pathname === path || 
      location.pathname === `${__BASE_PATH__}${path}` ||
      location.pathname.startsWith(path + '/') ||
      location.pathname.startsWith(`${__BASE_PATH__}${path}/`)
    );

    if (!user || !isGamePage) return;

    // Initialize game loop only on game pages
    calculateProduction();
    processFleetMovements();
  }, [user, location.pathname, calculateProduction, processFleetMovements]);

  return null;
}

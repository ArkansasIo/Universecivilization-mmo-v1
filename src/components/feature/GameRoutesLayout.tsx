import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBackgroundProcessor } from '../../hooks/useBackgroundProcessor';
import GameLayout from './GameLayout';
import { useState, useEffect } from 'react';

export default function GameRoutesLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  // Safety: force-dismiss loading after 6s to prevent infinite spinner
  const [forceReady, setForceReady] = useState(false);

  // ── Background universe processor ──────────────────────────
  // Runs every 15s: trade routes, espionage, stargate jumps,
  // planetary events, fleet arrivals, content cleanup
  useBackgroundProcessor();

  useEffect(() => {
    if (!loading) {
      setForceReady(false);
      return;
    }
    const t = setTimeout(() => setForceReady(true), 6000);
    return () => clearTimeout(t);
  }, [loading]);

  // Show loading state only on initial cold boot (first visit, no cached session)
  // Once we have a user (even without full profile) render the game immediately
  if (loading && !forceReady && !user) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D4A017] mb-4"></div>
          <div className="text-[#D4A017] text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>Initializing Systems...</div>
          <p className="text-[#605040] text-sm mt-2">Preparing command interface</p>
        </div>
      </div>
    );
  }

  // Auth guard: redirect to login if not authenticated
  if (!user && !loading) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  return (
    <GameLayout>
      <Outlet />
    </GameLayout>
  );
}
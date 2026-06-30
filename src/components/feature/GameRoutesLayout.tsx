import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBackgroundProcessor } from '../../hooks/useBackgroundProcessor';
import GameLayout from './GameLayout';
import { useState, useEffect } from 'react';
import PageLoading from '../PageLoading';

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
      <PageLoading
        message="Initializing Systems..."
        subtitle="Preparing command interface"
        messageClassName="font-heading"
        className="min-h-screen bg-[#08080F] text-[#D4A017]"
      />
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
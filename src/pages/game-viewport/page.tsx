import { useEffect, useState, Suspense } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import PageLoading from '../../components/PageLoading';
import { useGameLoop } from '../../hooks/useGameLoop';
import { EnginePreloader, EngineProvider } from '../../engine';
import { CameraStateProvider } from './components/camera/CameraStateProvider';
import { SelectionProvider } from './components/selection/SelectionContext';
import { FogOfWarProvider } from './components/fow/FogOfWarProvider';
import ViewportCanvas from './components/ViewportCanvas';
import AudioFeedback from './components/AudioFeedback';
import TopBar from './components/TopBar';
import LeftSidebar from './components/LeftSidebar';
import RightPanel from './components/RightPanel';
import BottomBar from './components/BottomBar';

export default function GameViewportPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [forceReady, setForceReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setForceReady(false);
      return;
    }
    const t = setTimeout(() => setForceReady(true), 6000);
    return () => clearTimeout(t);
  }, [loading]);

  if (loading && !forceReady && !user) {
    return (
      <PageLoading
        message="Initializing Viewport..."
        subtitle="Rendering galactic scene"
        messageClassName="font-heading"
        className="min-h-screen bg-[#05070a] text-[#d4a853]"
      />
    );
  }

  if (!user && !loading) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  // Wire simulation engine (EXP-06)
  useGameLoop();

  return (
    <EngineProvider>
      <EnginePreloader>
        <CameraStateProvider>
          <SelectionProvider>
            <FogOfWarProvider>
              <div className="h-screen w-screen overflow-hidden bg-[#05070a]">
                {/* 3D Viewport Canvas */}
                <div className="fixed inset-0 z-0">
                  <Suspense fallback={null}>
                    <ViewportCanvas />
                  </Suspense>
                </div>

                {/* UI Overlays */}
                <TopBar />
                <LeftSidebar />
                <RightPanel />
                <BottomBar />

                {/* Audio feedback for UI interactions */}
                <AudioFeedback />

                {/* Fallback nav if canvas doesn't load */}
                <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex gap-2">
                  <Link
                    to="/universe-3d"
                    className="px-3 py-1.5 rounded text-xs font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(5,7,10,0.7)', color: '#5a6577', border: '1px solid #1e2a36' }}
                  >
                    Switch to 3D Universe
                  </Link>
                  <Link
                    to="/stellaris-view"
                    className="px-3 py-1.5 rounded text-xs font-bold transition-all hover:bg-white/10"
                    style={{ background: 'rgba(5,7,10,0.7)', color: '#5a6577', border: '1px solid #1e2a36' }}
                  >
                    Switch to Stellaris View
                  </Link>
                </div>
              </div>
            </FogOfWarProvider>
          </SelectionProvider>
        </CameraStateProvider>
      </EnginePreloader>
    </EngineProvider>
  );
}

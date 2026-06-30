import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface EmpireStats {
  planets: number;
  buildings: number;
  ships: number;
  resources: { metal: number; crystal: number; deuterium: number };
  level: number;
}

interface WelcomeBackCelebrationProps {
  username: string;
  onDismiss: () => void;
}

export default function WelcomeBackCelebration({ username, onDismiss }: WelcomeBackCelebrationProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<EmpireStats | null>(null);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number; color: string }>>([]);

  useEffect(() => {
    // Staggered entrance
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Generate sparkle particles
    const p = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      size: 2 + Math.random() * 4,
      color: ['#fbbf24', '#f59e0b', '#fcd34d', '#d97706', '#fde047'][Math.floor(Math.random() * 5)],
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    async function loadStats() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const uid = session.user.id;

      const [planetsRes, buildingsRes, shipsRes, resourcesRes, profileRes] = await Promise.all([
        supabase.from('planets').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('buildings').select('id', { count: 'exact', head: true }).eq('player_id', uid),
        supabase.from('ships').select('id', { count: 'exact', head: true }).eq('user_id', uid),
        supabase.from('player_resources').select('metal,crystal,deuterium').eq('player_id', uid).maybeSingle(),
        supabase.from('profiles').select('level').eq('id', uid).maybeSingle(),
      ]);

      setStats({
        planets: planetsRes.count || 0,
        buildings: buildingsRes.count || 0,
        ships: shipsRes.count || 0,
        resources: {
          metal: resourcesRes.data?.metal || 0,
          crystal: resourcesRes.data?.crystal || 0,
          deuterium: resourcesRes.data?.deuterium || 0,
        },
        level: profileRes.data?.level || 1,
      });
    }
    loadStats();
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 600);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(180,83,9,0.06) 50%, rgba(251,191,36,0.04) 100%)',
        border: '1px solid rgba(251,191,36,0.25)',
      }}
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0,
            animation: `celebratePulse 3s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <div className="relative z-10 px-8 py-7 flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left: Avatar + Greeting */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white border-2"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderColor: 'rgba(251,191,36,0.5)',
                boxShadow: '0 0 24px rgba(251,191,36,0.3)',
              }}
            >
              <i className="ri-vip-crown-line"></i>
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: '#059669', border: '2px solid #064e3b' }}
            >
              <i className="ri-check-line text-white text-xs"></i>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Welcome back,{' '}
              <span style={{ color: '#fbbf24' }}>{username}</span>
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(251,191,36,0.7)' }}>
              Your empire has been preserved. All progress transferred successfully.
            </p>
          </div>
        </div>

        {/* Middle: Preserved Stats */}
        {stats && (
          <div className="flex-1 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <i className="ri-planet-line text-amber-400 text-sm"></i>
              <span className="text-sm font-bold text-white">{stats.planets}</span>
              <span className="text-xs text-gray-400">planets</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <i className="ri-building-line text-amber-400 text-sm"></i>
              <span className="text-sm font-bold text-white">{stats.buildings}</span>
              <span className="text-xs text-gray-400">buildings</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <i className="ri-rocket-line text-amber-400 text-sm"></i>
              <span className="text-sm font-bold text-white">{stats.ships}</span>
              <span className="text-xs text-gray-400">ships</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <i className="ri-copper-coin-line text-amber-400 text-sm"></i>
              <span className="text-sm font-bold text-white">Lv.{stats.level}</span>
              <span className="text-xs text-gray-400">commander</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <i className="ri-stack-line text-amber-400 text-sm"></i>
              <span className="text-xs text-gray-400">
                {(stats.resources.metal + stats.resources.crystal + stats.resources.deuterium).toLocaleString()} resources
              </span>
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/empire')}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 4px 16px rgba(251,191,36,0.25)',
            }}
          >
            <i className="ri-arrow-right-line mr-1.5"></i>
            Continue Command
          </button>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>

      {/* Bottom progress shimmer */}
      <div className="h-0.5 w-full overflow-hidden" style={{ background: 'rgba(251,191,36,0.06)' }}>
        <div
          className="h-full"
          style={{
            width: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)',
            animation: 'celebrateShimmer 3s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes celebratePulse {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes celebrateShimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(500%); }
        }
      `}</style>
    </div>
  );
}
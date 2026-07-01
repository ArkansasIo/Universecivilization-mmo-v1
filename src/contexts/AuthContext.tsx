import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface ProfileData {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  avatar_url: string | null;
  vacation_mode: boolean;
  is_admin: boolean;
  was_guest: boolean;
  converted_at: string | null;
  race: string | null;
  last_race_change: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: ProfileData | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function cleanEnv(value: string | undefined): string {
  if (!value) return '';
  return value.trim().replace(/^["']|["']$/g, '');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  // Track whether we've already ensured player data for the current session
  const dataEnsuredRef = useRef(false);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, level, experience, avatar_url, vacation_mode, is_admin, was_guest, converted_at, race, last_race_change, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();
    if (!error && data) {
      setProfile(data as ProfileData);
    }
  }

  async function ensurePlayerData(userId: string, email: string, username: string) {
    // Prevent duplicate calls within the same session
    if (dataEnsuredRef.current) return;
    
    try {
      // Run ALL existence checks in parallel — no need to wait sequentially
      const [profileResult, resourcesResult, planetResult] = await Promise.all([
        supabase.from('profiles').select('id').eq('id', userId).maybeSingle(),
        supabase.from('player_resources').select('id').eq('user_id', userId).maybeSingle(),
        supabase.from('planets').select('id').eq('user_id', userId).maybeSingle(),
      ]);

      // ── Create profile if needed ──
      if (!profileResult.data) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: userId,
          username,
          email,
          level: 1,
          experience: 0,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
          vacation_mode: false,
          is_admin: false,
        }, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      // Refresh profile after ensuring data
      await fetchProfile(userId);

      // ── Create resources if needed ──
      if (!resourcesResult.data) {
        const { error: resourcesError } = await supabase.from('player_resources').insert({
          user_id: userId,
          player_id: userId,
          metal: 500,
          crystal: 300,
          deuterium: 100,
          energy: 0,
          dark_matter: 0,
          imperial_credits: 10000,
          republic_credits: 5000,
          antimatter: 0,
          nanites: 0,
        });

        if (resourcesError) {
          console.error('Resources creation error:', resourcesError);
        }
      }

      // ── Create planet + buildings if needed ──
      if (!planetResult.data) {
        const { data: planetData, error: planetError } = await supabase
          .from('planets')
          .insert({
            user_id: userId,
            player_id: userId,
            name: 'Homeworld',
            planet_type: 'terran',
            status: 'active',
            coordinates: '1:1:1',
            position_galaxy: 1,
            position_system: 1,
            position_planet: 1,
            temperature: 20,
            diameter: 12800,
            fields_used: 0,
            fields_max: 163,
            population: 0,
            development: 1,
            defense_level: 0,
            is_capital: true,
            is_homeworld: true,
            metal_storage: 10000,
            crystal_storage: 10000,
            deuterium_storage: 10000,
          })
          .select()
          .maybeSingle();

        if (planetError) {
          console.error('Planet creation error:', planetError);
        }

        if (planetData) {
          const { error: buildingsError } = await supabase.from('buildings').insert([
            { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'metal_mine', level: 1, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'crystal_mine', level: 1, is_upgrading: false },
            { user_id: userId, player_id: userId, planet_id: planetData.id, building_type: 'solar_plant', level: 1, is_upgrading: false },
          ]);

          if (buildingsError) {
            console.error('Buildings creation error:', buildingsError);
          }
        }
      }
      
      // Mark as done to prevent re-execution
      dataEnsuredRef.current = true;
    } catch (dbError) {
      console.error('Error ensuring player data:', dbError);
    }
  }

  useEffect(() => {
    // Check active sessions — wrap in try/catch to handle corrupted JWT tokens
    async function initSession() {
      try {
        // If session-only flag exists, clear persisted storage and skip auto-login
        if (sessionStorage.getItem('sessionOnly') === 'true') {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sb-')) {
              localStorage.removeItem(key);
            }
          }
          sessionStorage.removeItem('sessionOnly');
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // RELEASE THE UI IMMEDIATELY — don't wait for DB setup
          setLoading(false);
          // Load profile and ensure player data in background
          fetchProfile(session.user.id).then(() => {
            const metadata = session.user.user_metadata;
            ensurePlayerData(
              session.user!.id,
              session.user!.email ?? '',
              (metadata?.username as string) || session.user!.email?.split('@')[0] || 'Commander'
            );
          });
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        const msg = err?.message || '';
        console.warn('[Auth] Session initialization failed:', msg);
        
        // If it's a JWT corruption error, nuke everything and force sign out
        if (msg.includes('JWT') || msg.includes('token') || msg.includes('segments')) {
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sb-')) {
              localStorage.removeItem(key);
            }
          }
          try { await supabase.auth.signOut({ scope: 'local' }); } catch { /* ignore */ }
        }
        
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    }
    
    initSession();

    // Listen for auth changes — MUST be synchronous callback (no async/await)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fire-and-forget: don't block the callback
        fetchProfile(session.user.id);
      }
      if (event === 'SIGNED_IN' && session?.user) {
        // Reset the flag for new sign-ins so ensurePlayerData can run
        dataEnsuredRef.current = false;
        const metadata = session.user.user_metadata;
        // Fire-and-forget: don't block the callback
        ensurePlayerData(
          session.user.id,
          session.user.email ?? '',
          (metadata?.username as string) || session.user.email?.split('@')[0] || 'Commander'
        );
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        dataEnsuredRef.current = false;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string, rememberMe = true) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    if (!rememberMe && data.session) {
      // Clear localStorage so session does not persist across browser restarts.
      // The in-memory session held by the Supabase client remains valid for the current tab.
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          localStorage.removeItem(key);
        }
      }
      sessionStorage.setItem('sessionOnly', 'true');
    }
    // ensurePlayerData will be called by the onAuthStateChange SIGNED_IN handler
  };

  const signUp = async (email: string, password: string, username: string): Promise<{ needsEmailConfirmation: boolean }> => {
    const supabaseUrl = cleanEnv(import.meta.env.VITE_PUBLIC_SUPABASE_URL).replace(/\/$/, '');
    const anonKey = cleanEnv(import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY);

    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase configuration missing. Please check your environment setup.');
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/create-user-account`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': anonKey,
        },
        body: JSON.stringify({ email, password, username }),
      }
    );

    const result = await response.json().catch(() => ({
      success: false,
      error: 'Server error during registration',
    }));

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || 'Registration failed. Please try again.'
      );
    }

    // Edge function creates a confirmed user, so we can sign in immediately
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      // Account was created but auto-login failed — ask user to sign in manually
      return { needsEmailConfirmation: true };
    }

    // ensurePlayerData will be called by the onAuthStateChange SIGNED_IN handler
    return { needsEmailConfirmation: false };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    dataEnsuredRef.current = false;
    sessionStorage.removeItem('sessionOnly');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL || '').replace(/^["']|["']$/g, '');
const supabaseAnonKey = (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// ── Suppress noisy SDK console.errors from auth fetch failures ──────────────
// The @supabase/auth-js SDK calls console.error(e) directly in its fetch catch
// block (fetch.js:104) for network/CORS errors. These are already handled by
// our AuthContext, so the raw console noise just spams the user's console.
(function suppressAuthSdkNoise() {
  const originalError = console.error.bind(console);
  let suppressCount = 0;
  const MAX_SUPPRESS = 20; // Don't suppress indefinitely — could hide real issues

  console.error = function (...args: any[]) {
    if (suppressCount < MAX_SUPPRESS && args.length === 1) {
      const arg = args[0];
      // SDK passes a TypeError (e.g. "Failed to fetch") to console.error.
      // TypeErrors have no enumerable own properties → JSON.stringify → ""
      // which appears in the console as an empty-object error. This pattern is
      // essentially unique to the supabase/auth-js fetch catch block.
      if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
        try {
          const str = JSON.stringify(arg);
          if (str === '' || str === '') {
            // Also check that this looks like a network error: name should be
            // "TypeError" or message should contain "fetch" or "network"
            const name = (arg as any).name || '';
            const msg = (arg as any).message || '';
            const isNetworkErr =
              name === 'TypeError' ||
              /fetch|network|cors/i.test(msg) ||
              (!name && !msg); // empty object with no name/message = serialized TypeError

            if (isNetworkErr) {
              suppressCount++;
              return; // Silent — AuthContext already handles this
            }
          }
        } catch { /* not JSON-serializable, let it through */ }
      }
    }
    return originalError(...args);
  };
})();

// 🧹 MUST run BEFORE createClient — detect and clean corrupted JWT tokens
// to prevent "invalid JWT: token contains an invalid number of segments" errors.
(function cleanCorruptedSession() {
  try {
    let hasCorruption = false;
    const sbKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('sb-')) {
        sbKeys.push(key);
        // Check if this key holds a corrupted JWT
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          const token = parsed?.access_token || parsed?.token || '';
          if (token && typeof token === 'string' && token.split('.').length !== 3) {
            hasCorruption = true;
          }
        } catch {
          // JSON parse failed = storage is corrupt
          hasCorruption = true;
        }
      }
    }
    
    if (hasCorruption) {
      console.warn('[Supabase] Corrupted auth storage detected — wiping all Supabase keys');
      sbKeys.forEach(key => localStorage.removeItem(key));
    }
  } catch {
    // Best-effort cleanup
  }
})();

// Create a dummy client if not configured to prevent errors
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'placeholder-key';

export const supabase = createClient(
  supabaseUrl || dummyUrl, 
  supabaseAnonKey || dummyKey
);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          level: number;
          experience: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      planets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          coordinates: string;
          metal: number;
          crystal: number;
          deuterium: number;
          energy: number;
          metal_production: number;
          crystal_production: number;
          deuterium_production: number;
          energy_production: number;
          is_main: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      buildings: {
        Row: {
          id: string;
          planet_id: string;
          building_type: string;
          level: number;
          created_at: string;
          updated_at: string;
        };
      };
      research: {
        Row: {
          id: string;
          user_id: string;
          research_type: string;
          level: number;
          created_at: string;
          updated_at: string;
        };
      };
      fleets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          status: string;
          origin_planet_id: string;
          destination_planet_id: string | null;
          mission_type: string | null;
          arrival_time: string | null;
          return_time: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      fleet_ships: {
        Row: {
          id: string;
          fleet_id: string;
          ship_type: string;
          quantity: number;
          created_at: string;
        };
      };
      alliances: {
        Row: {
          id: string;
          name: string;
          tag: string;
          description: string | null;
          leader_id: string;
          member_count: number;
          total_points: number;
          created_at: string;
          updated_at: string;
        };
      };
      alliance_members: {
        Row: {
          id: string;
          alliance_id: string;
          user_id: string;
          rank: string;
          joined_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          subject: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
      };
      combat_logs: {
        Row: {
          id: string;
          attacker_id: string;
          defender_id: string;
          attacker_planet_id: string;
          defender_planet_id: string;
          result: string;
          loot_metal: number;
          loot_crystal: number;
          loot_deuterium: number;
          attacker_losses: number;
          defender_losses: number;
          created_at: string;
        };
      };
      marketplace_listings: {
        Row: {
          id: string;
          seller_id: string;
          resource_type: string;
          quantity: number;
          price_per_unit: number;
          total_price: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_type: string;
          progress: number;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
      };
      events_participation: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          score: number;
          rewards_claimed: boolean;
          created_at: string;
        };
      };
    };
  };
};
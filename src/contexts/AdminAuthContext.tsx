import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_super_admin: boolean;
  last_login: string | null;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  signIn: (usernameOrEmail: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (username: string, email: string, password: string, fullName: string, role: string) => Promise<{ needsEmailConfirmation: boolean }>;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (adminData) {
          setAdminUser(adminData);
        } else {
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (adminData) {
          setAdminUser(adminData);
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (usernameOrEmail: string, password: string) => {
    try {
      // Check if input is email or username
      const isEmail = usernameOrEmail.includes('@');
      let email = usernameOrEmail;

      // If username provided, resolve email via edge function (bypasses RLS)
      if (!isEmail) {
        const supabaseUrl = (import.meta.env.VITE_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '').replace(/^["']|["']$/g, '');
        const anonKey = (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^["']|["']$/g, '');

        const response = await fetch(`${supabaseUrl}/functions/v1/resolve-admin-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
          },
          body: JSON.stringify({ username: usernameOrEmail }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error || 'Admin account not found');
        }

        const data = await response.json();
        if (!data.success || !data.email) {
          throw new Error('Admin account not found');
        }

        email = data.email;
      }

      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Verify user is an admin (RLS allows reading own record)
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', authData.user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          throw new Error('Not authorized as admin');
        }

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', authData.user.id);

        // Log the login
        await supabase
          .from('admin_logs')
          .insert({
            admin_id: authData.user.id,
            action: 'admin_login',
            target_table: 'admin_users',
            target_id: authData.user.id,
            details: { username: adminData.username, email: adminData.email },
          });

        setAdminUser(adminData);
      }
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, fullName: string, role: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (authError) throw authError;

      if (authData.user && authData.session) {
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({
            id: authData.user.id,
            username,
            email,
            full_name: fullName,
            role,
            is_super_admin: role === 'super_admin',
            is_active: true,
          });

        if (insertError) throw insertError;

        await supabase
          .from('admin_logs')
          .insert({
            admin_id: authData.user.id,
            action: 'admin_register',
            target_table: 'admin_users',
            target_id: authData.user.id,
            details: { username, email, role, full_name: fullName },
          });

        setAdminUser({
          id: authData.user.id,
          username,
          email,
          full_name: fullName,
          role,
          is_super_admin: role === 'super_admin',
          last_login: null,
        });

        return { needsEmailConfirmation: false };
      }

      return { needsEmailConfirmation: true };
    } catch (error: any) {
      console.error('Admin registration error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (adminUser) {
        await supabase
          .from('admin_logs')
          .insert({
            admin_id: adminUser.id,
            action: 'admin_logout',
            target_table: 'admin_users',
            target_id: adminUser.id,
            details: { username: adminUser.username },
          });
      }

      await supabase.auth.signOut();
      setAdminUser(null);
    } catch (error) {
      console.error('Admin sign out error:', error);
      throw error;
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        signIn,
        signOut,
        register,
        isAuthenticated: !!adminUser,
        isSuperAdmin: adminUser?.is_super_admin || false,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
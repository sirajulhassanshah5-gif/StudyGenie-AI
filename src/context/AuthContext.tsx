import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email?: string, name?: string) => void;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (data: { fullName?: string; avatarUrl?: string }) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [demoUser, setDemoUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Timeout fallback: if Supabase getSession hangs (e.g. invalid credentials/no network),
    // resolve loading after 5s so the app doesn't show a blank/infinite spinner.
    const timeout = setTimeout(() => setLoading(false), 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      clearTimeout(timeout);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = (email = 'alex.rivera@studygenie.ai', name = 'Alex Rivera') => {
    const newUser: UserProfile = {
      name: name || 'Alex Rivera',
      email: email || 'alex.rivera@studygenie.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Computer Science Major',
    };
    setDemoUser(newUser);
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    setDemoUser(null);
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const logout = async () => {
    await signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updateProfile = async (data: { fullName?: string; avatarUrl?: string }) => {
    const { error } = await supabase.auth.updateUser({
      data: {
        ...(data.fullName && { full_name: data.fullName }),
        ...(data.avatarUrl && { avatar_url: data.avatarUrl }),
      },
    });
    if (!error && demoUser) {
      setDemoUser((prev) => prev ? {
        ...prev,
        ...(data.fullName && { name: data.fullName }),
        ...(data.avatarUrl && { avatar: data.avatarUrl }),
      } : null);
    }
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  };

  // Helper profile fallback for backwards compatibility with UI components
  const profile: UserProfile | null = demoUser || (user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student User',
    email: user.email || '',
    avatar: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Student',
  } : null);

  const isAuthenticated = !!user || !!demoUser;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isAuthenticated,
        login,
        logout,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

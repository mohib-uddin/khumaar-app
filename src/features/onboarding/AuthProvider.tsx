import type { Session, User } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { env } from '@/lib/env';
import { getSupabase } from '@/lib/supabase';
import type { ProfileRow } from '@/lib/database.types';
import { ensureProfile, fetchProfile } from '@/features/onboarding/api';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  configured: boolean;
  refreshProfile: () => Promise<void>;
  setProfile: (profile: ProfileRow | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const supabase = getSupabase();
    const userId = session?.user?.id;
    if (!supabase || !userId) {
      setProfile(null);
      return;
    }
    const next = await ensureProfile(
      userId,
      (session?.user.user_metadata?.full_name as string | undefined) ??
        (session?.user.user_metadata?.name as string | undefined) ??
        null,
    );
    setProfile(next);
  }, [session]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        try {
          const row =
            (await fetchProfile(data.session.user.id)) ??
            (await ensureProfile(data.session.user.id));
          if (mounted) setProfile(row);
        } catch (error) {
          console.warn('Failed to load profile', error);
        }
      }
      if (mounted) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        try {
          const row = await ensureProfile(
            nextSession.user.id,
            (nextSession.user.user_metadata?.full_name as string | undefined) ??
              (nextSession.user.user_metadata?.name as string | undefined) ??
              null,
          );
          setProfile(row);
        } catch (error) {
          console.warn('Failed to ensure profile', error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      configured: env.isSupabaseConfigured,
      refreshProfile,
      setProfile,
    }),
    [session, profile, loading, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

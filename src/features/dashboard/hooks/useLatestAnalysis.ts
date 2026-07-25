import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/onboarding';
import { fetchLatestAnalysis } from '@/features/onboarding/api';
import type { ScanAnalysisRow } from '@/lib/database.types';
import { getSupabase } from '@/lib/supabase';

export function useLatestAnalysis() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ScanAnalysisRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setAnalysis(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await fetchLatestAnalysis(user.id);
      setAnalysis(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user?.id) return;
    const supabase = getSupabase();
    if (!supabase) return;

    // Unique topic per mount — shared names reuse a subscribed channel and throw
    // when another screen (e.g. Routines) also calls useLatestAnalysis.
    const channelName = `scan_analyses:${user.id}:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scan_analyses',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          void refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id, refresh]);

  return { analysis, loading, error, refresh };
}

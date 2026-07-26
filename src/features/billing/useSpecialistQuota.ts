import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/onboarding';
import { getSupabase } from '@/lib/supabase';

import { FREE_SPECIALIST_MESSAGES_PER_DAY } from './planCatalog';
import { usePurchases } from './PurchasesProvider';

function startOfUtcDayIso(): string {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  ).toISOString();
}

export function useSpecialistQuota() {
  const { user } = useAuth();
  const { isPro } = usePurchases();
  const [usedToday, setUsedToday] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id || isPro) {
      setUsedToday(0);
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { count, error } = await supabase
        .from('coach_messages')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('role', 'user')
        .gte('created_at', startOfUtcDayIso());

      if (error) throw error;
      setUsedToday(count ?? 0);
    } catch (error) {
      console.warn('[billing] specialist quota fetch failed', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isPro]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const limit = FREE_SPECIALIST_MESSAGES_PER_DAY;
  const remaining = isPro
    ? Number.POSITIVE_INFINITY
    : Math.max(0, limit - usedToday);
  const canSend = isPro || remaining > 0;

  const recordLocalSend = useCallback(() => {
    if (!isPro) setUsedToday((n) => n + 1);
  }, [isPro]);

  return {
    isPro,
    usedToday,
    limit,
    remaining,
    canSend,
    loading,
    refresh,
    recordLocalSend,
  };
}

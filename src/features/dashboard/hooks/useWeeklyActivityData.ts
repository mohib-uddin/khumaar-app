import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/onboarding';
import { getSupabase } from '@/lib/supabase';

import type { ActivityDay } from '../data';

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function utcDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function startOfWeekSunday(d: Date) {
  const copy = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  copy.setUTCDate(copy.getUTCDate() - copy.getUTCDay());
  return copy;
}

export function useWeeklyActivityData(lastScanAt?: string | null) {
  const { user } = useAuth();
  const [completionDates, setCompletionDates] = useState<string[]>([]);
  const [scanDates, setScanDates] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.id) return;
      const supabase = getSupabase();
      if (!supabase) return;

      const weekStart = startOfWeekSunday(new Date());
      const from = utcDateKey(weekStart);

      const [{ data: completions }, { data: scans }] = await Promise.all([
        supabase
          .from('routine_completions')
          .select('completed_on')
          .eq('user_id', user.id)
          .gte('completed_on', from),
        supabase
          .from('scans')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', `${from}T00:00:00.000Z`),
      ]);

      if (cancelled) return;
      setCompletionDates((completions ?? []).map((c) => c.completed_on));
      setScanDates((scans ?? []).map((s) => s.created_at.slice(0, 10)));
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, lastScanAt]);

  const days: ActivityDay[] = useMemo(() => {
    const weekStart = startOfWeekSunday(new Date());
    const todayKey = utcDateKey(new Date());
    const counts = new Map<string, number>();
    for (const d of completionDates) counts.set(d, (counts.get(d) ?? 0) + 1);
    for (const d of scanDates) counts.set(d, (counts.get(d) ?? 0) + 2);

    return DAY_KEYS.map((key, index) => {
      const date = new Date(weekStart);
      date.setUTCDate(weekStart.getUTCDate() + index);
      const dateKey = utcDateKey(date);
      const count = counts.get(dateKey) ?? 0;
      const height = Math.min(69, 28 + count * 10);
      const isToday = dateKey === todayKey;
      const hasScan = scanDates.includes(dateKey);
      return {
        key,
        label: DAY_LABELS[index],
        height,
        highlighted: isToday,
        marker: hasScan ? ('avatar' as const) : isToday ? ('indicator' as const) : undefined,
      };
    });
  }, [completionDates, scanDates]);

  const nextScanLabel = useMemo(() => {
    if (!lastScanAt) return 'soon';
    const next = new Date(lastScanAt);
    next.setUTCDate(next.getUTCDate() + 7);
    return DAY_LABELS[next.getUTCDay()];
  }, [lastScanAt]);

  return { days, nextScanLabel };
}

export function relativeUpdatedLabel(iso?: string | null): string {
  if (!iso) return 'No scan yet';
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} Min${mins === 1 ? '' : 's'} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} Hr${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} Day${days === 1 ? '' : 's'} ago`;
}

export function scoreStatus(score?: number | null): string {
  if (score == null) return 'Awaiting scan';
  if (score >= 85) return 'Good Progress';
  if (score >= 70) return 'On Track';
  return 'Needs Focus';
}

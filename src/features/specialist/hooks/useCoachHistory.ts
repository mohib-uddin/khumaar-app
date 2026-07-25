import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/onboarding';
import type { CoachMessageRow } from '@/lib/database.types';
import { getSupabase } from '@/lib/supabase';

import type { ConsultationBlock } from '../types';

export type CoachHistoryItem = {
  id: string;
  threadId: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  blocks: ConsultationBlock[];
};

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function truncate(text: string, max = 72): string {
  const t = text.trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** Group flat coach_messages into one hub card per conversation thread. */
function toHistoryItems(rows: CoachMessageRow[]): CoachHistoryItem[] {
  const byThread = new Map<string, CoachMessageRow[]>();

  for (const row of rows) {
    if (!row.thread_id) continue;
    const list = byThread.get(row.thread_id) ?? [];
    list.push(row);
    byThread.set(row.thread_id, list);
  }

  const items: Array<CoachHistoryItem & { lastAt: number }> = [];

  for (const [threadId, threadRows] of byThread) {
    const chronological = [...threadRows].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    const blocks: ConsultationBlock[] = chronological.map((row) =>
      row.role === 'user'
        ? { id: `hist-u-${row.id}`, type: 'user' as const, text: row.content }
        : {
            id: `hist-a-${row.id}`,
            type: 'specialist' as const,
            text: row.content,
          },
    );

    const firstUser = chronological.find((r) => r.role === 'user');
    const lastAssistant = [...chronological].reverse().find((r) => r.role === 'assistant');
    const last = chronological[chronological.length - 1];
    const lastAt = last ? new Date(last.created_at).getTime() : 0;

    items.push({
      id: threadId,
      threadId,
      title: truncate(firstUser?.content ?? 'Conversation', 42),
      subtitle: lastAssistant
        ? truncate(lastAssistant.content, 64)
        : 'Open to continue this chat',
      timeLabel: relativeTime(last?.created_at ?? new Date().toISOString()),
      blocks,
      lastAt,
    });
  }

  return items
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, 12)
    .map(({ lastAt: _lastAt, ...item }) => item);
}

export function useCoachHistory() {
  const { user } = useAuth();
  const [items, setItems] = useState<CoachHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('coach_messages')
      .select('id, user_id, thread_id, role, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(120);

    if (error) {
      setItems([]);
    } else {
      setItems(toHistoryItems((data ?? []) as CoachMessageRow[]));
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, loading, refresh };
}

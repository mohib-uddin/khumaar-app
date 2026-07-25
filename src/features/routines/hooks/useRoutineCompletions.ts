import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/onboarding';
import { getSupabase } from '@/lib/supabase';

import type { StepStatusOverrides } from '../data';
import { overridesFromCompletions, utcToday } from '../mapRoutinePlan';

export function useRoutineCompletions() {
  const { user } = useAuth();
  const [overrides, setOverrides] = useState<Record<string, StepStatusOverrides>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setOverrides({});
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const today = utcToday();
    const { data, error } = await supabase
      .from('routine_completions')
      .select('routine_id, step_id')
      .eq('user_id', user.id)
      .eq('completed_on', today);
    if (error) {
      console.warn('routine_completions load failed', error.message);
      setLoading(false);
      return;
    }
    setOverrides(overridesFromCompletions(data ?? []));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleStep = useCallback(
    async (routineId: string, stepId: string, currentlyCompleted: boolean) => {
      if (!user?.id) return;
      const supabase = getSupabase();
      if (!supabase) return;

      const today = utcToday();
      // Optimistic
      setOverrides((prev) => ({
        ...prev,
        [routineId]: {
          ...prev[routineId],
          [stepId]: currentlyCompleted ? 'pending' : 'completed',
        },
      }));

      if (currentlyCompleted) {
        const { error } = await supabase
          .from('routine_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('routine_id', routineId)
          .eq('step_id', stepId)
          .eq('completed_on', today);
        if (error) {
          console.warn('routine_completions delete failed', error.message);
          void refresh();
        }
        return;
      }

      const { error } = await supabase.from('routine_completions').upsert(
        {
          user_id: user.id,
          routine_id: routineId,
          step_id: stepId,
          completed_on: today,
        },
        { onConflict: 'user_id,routine_id,step_id,completed_on' },
      );
      if (error) {
        console.warn('routine_completions upsert failed', error.message);
        void refresh();
      }
    },
    [user?.id, refresh],
  );

  return { overrides, loading, toggleStep, refresh };
}

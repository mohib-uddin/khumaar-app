import type { RoutinePlan } from '@/lib/database.types';

import {
  facialFitnessRoutine,
  middayRoutine,
  morningRoutine,
  nightRoutine,
  weeklyRoutine,
  type Routine,
  type RoutineStepStatus,
  type StepStatusOverrides,
} from './data';

function blockToRoutine(
  id: 'morning' | 'night',
  block: RoutinePlan['morning'],
  template: Routine,
): Routine {
  return {
    id,
    title: block.title || template.title,
    subtitle: block.subtitle || template.subtitle,
    icon: id,
    steps: block.steps.map((step, index) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      kind: step.kind,
      status: (index === 0 ? 'active' : 'pending') as RoutineStepStatus,
    })),
  };
}

function withTemplateLabel(routine: Routine): Routine {
  return {
    ...routine,
    subtitle: routine.subtitle
      ? `${routine.subtitle} · Starter template`
      : 'Starter template',
  };
}

/** Map persisted LLM plan onto AM/PM + labeled starter templates. No plan → empty. */
export function routinesFromPlan(plan: RoutinePlan | null | undefined): Routine[] {
  if (!plan?.morning?.steps?.length || !plan?.night?.steps?.length) {
    return [];
  }
  return [
    blockToRoutine('morning', plan.morning, morningRoutine),
    blockToRoutine('night', plan.night, nightRoutine),
    withTemplateLabel(facialFitnessRoutine),
    withTemplateLabel(weeklyRoutine),
    withTemplateLabel(middayRoutine),
  ];
}

export function overridesFromCompletions(
  completions: { routine_id: string; step_id: string }[],
): Record<string, StepStatusOverrides> {
  const out: Record<string, StepStatusOverrides> = {};
  for (const row of completions) {
    out[row.routine_id] = {
      ...out[row.routine_id],
      [row.step_id]: 'completed',
    };
  }
  return out;
}

export function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export type RoutineStepStatus = 'completed' | 'active' | 'pending';

/** Skincare product steps vs. facial-exercise steps. */
export type RoutineStepKind = 'skincare' | 'exercise';

export type HowToStep = {
  id: string;
  image: number;
  caption: string;
};

export type FacialExercise = {
  /** e.g. "5 min" or "3 × 15 reps". */
  durationLabel: string;
  /** Plain-language target, e.g. "Jawline". */
  targetArea: string;
  /** Step-by-step, gentle instructions. */
  instructions: string[];
  /** Locked exercises are gated behind consistency milestones. */
  locked?: boolean;
  unlockReason?: string;
};

export type RoutineStep = {
  id: string;
  title: string;
  description: string;
  status: RoutineStepStatus;
  kind?: RoutineStepKind;
  howTo?: {
    label: string;
    steps: HowToStep[];
  };
  exercise?: FacialExercise;
};

export type RoutineIconKey = 'morning' | 'night' | 'facial-fitness' | 'weekly' | 'midday';

export type Routine = {
  id: string;
  title: string;
  subtitle: string;
  icon: RoutineIconKey;
  steps: RoutineStep[];
};

export type Period = 'today' | 'week';

const TONER_1 = require('@/assets/figma/routines/toner-step-1.png');
const TONER_2 = require('@/assets/figma/routines/toner-step-2.png');
const TONER_3 = require('@/assets/figma/routines/toner-step-3.png');

export const morningRoutine: Routine = {
  id: 'morning',
  title: 'Morning Routine',
  subtitle: '3 Steps · Everyday',
  icon: 'morning',
  steps: [
    {
      id: 'cleanser',
      title: 'Cleanser',
      description: 'Washing your face removes excess oil and impurities.',
      status: 'completed',
    },
    {
      id: 'toner',
      title: 'Toner',
      description: 'If you have dry or sensitive skin, look for hydrating toners.',
      status: 'active',
      howTo: {
        label: 'How to do?',
        steps: [
          { id: 'pour', image: TONER_1, caption: 'Pour few drops of tonner on cotton' },
          { id: 'apply', image: TONER_2, caption: 'Gently apply it all over your face' },
          { id: 'wait', image: TONER_3, caption: 'Allow it to absorb' },
        ],
      },
    },
    {
      id: 'spot-treatment',
      title: 'Spot Treatments or Acne Treatm...',
      description: 'Target blemishes with a thin layer of treatment.',
      status: 'pending',
    },
  ],
};

export const nightRoutine: Routine = {
  id: 'night',
  title: 'Night Routine',
  subtitle: '4 Steps · Everyday',
  icon: 'night',
  steps: [
    {
      id: 'makeup-remover',
      title: 'Makeup Remover',
      description: 'Dissolve makeup and sunscreen before cleansing.',
      status: 'completed',
    },
    {
      id: 'cleanser',
      title: 'Cleanser',
      description: 'Double cleanse to remove remaining residue.',
      status: 'completed',
    },
    {
      id: 'serum',
      title: 'Night Serum',
      description: 'Apply retinol or repair serum on clean, dry skin.',
      status: 'pending',
    },
    {
      id: 'moisturizer',
      title: 'Moisturizer',
      description: 'Lock in hydration with a nourishing night cream.',
      status: 'pending',
    },
  ],
};

export const weeklyRoutine: Routine = {
  id: 'weekly',
  title: 'Weekly Treatment',
  subtitle: '2 Steps · Every Sunday',
  icon: 'weekly',
  steps: [
    {
      id: 'exfoliant',
      title: 'Gentle Exfoliant',
      description: 'Slough off dead skin cells once a week, not daily.',
      status: 'pending',
    },
    {
      id: 'mask',
      title: 'Hydrating Face Mask',
      description: 'Leave on for 10–15 minutes to restore moisture.',
      status: 'pending',
    },
  ],
};

export const middayRoutine: Routine = {
  id: 'midday',
  title: 'Midday Refresh',
  subtitle: '2 Steps · As needed',
  icon: 'midday',
  steps: [
    {
      id: 'mist',
      title: 'Facial Mist',
      description: 'Spritz to rehydrate skin throughout the day.',
      status: 'pending',
    },
    {
      id: 'spf-reapply',
      title: 'SPF Reapplication',
      description: 'Reapply sunscreen if spending time outdoors.',
      status: 'pending',
    },
  ],
};

export const facialFitnessRoutine: Routine = {
  id: 'facial-fitness',
  title: 'Facial Fitness',
  subtitle: '3 Exercises · 4× / week',
  icon: 'facial-fitness',
  steps: [
    {
      id: 'jawline',
      kind: 'exercise',
      title: 'Jawline Definition',
      description: 'Gentle resistance to tone the jaw and chin.',
      status: 'active',
      exercise: {
        durationLabel: '5 min',
        targetArea: 'Jawline',
        instructions: [
          'Sit tall and relax your shoulders.',
          'Tilt your chin slightly upward.',
          'Press your tongue to the roof of your mouth.',
          'Hold for 10 seconds, then release. Repeat 10×.',
        ],
      },
    },
    {
      id: 'neck-posture',
      kind: 'exercise',
      title: 'Neck Posture Reset',
      description: 'Realign your neck and ease tech-neck tension.',
      status: 'pending',
      exercise: {
        durationLabel: '3 min',
        targetArea: 'Neck & posture',
        instructions: [
          'Stand or sit with a straight spine.',
          'Gently tuck your chin to lengthen the neck.',
          'Roll shoulders back and down.',
          'Hold 15 seconds, breathe, repeat 6×.',
        ],
      },
    },
    {
      id: 'eye-relax',
      kind: 'exercise',
      title: 'Eye Area Relaxation',
      description: 'Soften tension and reduce puffiness.',
      status: 'pending',
      exercise: {
        durationLabel: '2 min',
        targetArea: 'Eye area',
        instructions: [
          'Warm your palms by rubbing them together.',
          'Cup them gently over closed eyes.',
          'Breathe slowly for 30 seconds.',
          'Lightly tap around the orbital bone.',
        ],
        locked: true,
        unlockReason: 'Complete 3 weekly scans to unlock',
      },
    },
  ],
};

export const allRoutines: Routine[] = [
  morningRoutine,
  nightRoutine,
  facialFitnessRoutine,
  weeklyRoutine,
  middayRoutine,
];

export const periodOptions = [
  { value: 'today' as const, label: 'Today' },
  { value: 'week' as const, label: 'This Week' },
] as const;

/** Routines visible for the selected period filter. */
export function routinesForPeriod(period: Period): Routine[] {
  if (period === 'week') return allRoutines;
  // "Today" hides the weekly-only routine unless it's Sunday — simplified: show all daily routines.
  return allRoutines.filter((r) => r.id !== 'weekly');
}

/** Find an unlocked facial-exercise step by its route id. */
export function exerciseStepById(stepId: string) {
  for (const routine of allRoutines) {
    const step = routine.steps.find((item) => item.id === stepId && item.kind === 'exercise');
    if (step?.exercise) {
      return { routine, step, exercise: step.exercise };
    }
  }
  return null;
}

export type StepStatusOverrides = Partial<Record<string, RoutineStepStatus>>;

/** Merge user toggles onto the static routine template. */
export function applyStepOverrides(routine: Routine, overrides?: StepStatusOverrides): Routine {
  if (!overrides) return routine;
  return {
    ...routine,
    steps: routine.steps.map((step) => ({
      ...step,
      status: overrides[step.id] ?? step.status,
    })),
  };
}

/** Tap cycles unchecked ↔ checked (active steps become completed). */
export function nextStepStatus(current: RoutineStepStatus): RoutineStepStatus {
  return current === 'completed' ? 'pending' : 'completed';
}

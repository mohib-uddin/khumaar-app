export type RoutineStepStatus = 'completed' | 'active' | 'pending';

export type HowToStep = {
  id: string;
  image: number;
  caption: string;
};

export type RoutineStep = {
  id: string;
  title: string;
  description: string;
  status: RoutineStepStatus;
  howTo?: {
    label: string;
    steps: HowToStep[];
  };
};

export type Routine = {
  id: string;
  title: string;
  subtitle: string;
  avatar: number;
  steps: RoutineStep[];
};

export type Period = 'today' | 'week';

const AVATAR = require('@/assets/figma/routines/morning-routine.png');
const TONER_1 = require('@/assets/figma/routines/toner-step-1.png');
const TONER_2 = require('@/assets/figma/routines/toner-step-2.png');
const TONER_3 = require('@/assets/figma/routines/toner-step-3.png');

export const morningRoutine: Routine = {
  id: 'morning',
  title: 'Morning Routine',
  subtitle: '3 Steps · Everyday',
  avatar: AVATAR,
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
  avatar: AVATAR,
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
  avatar: AVATAR,
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
  avatar: AVATAR,
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

export const allRoutines: Routine[] = [
  morningRoutine,
  nightRoutine,
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

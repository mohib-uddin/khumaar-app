import { targetPoints } from '@/features/dashboard/data';
import { awarenessTags, symptomMetrics } from '@/features/skin-analysis/data';
import { allRoutines } from '@/features/routines/data';

/** Aggregated skin profile for mock specialist responses. */
export const skinContext = {
  user: { name: 'Micy' },
  health: {
    score: 86,
    total: 100,
    status: 'Good Progress',
    updatedMinutesAgo: 15,
  },
  progress: {
    delta: '+2.3%',
    ring: 52,
    narrative: '3X improved from last 5 days',
  },
  concerns: targetPoints,
  environment: {
    location: 'LA, California',
    uv: 'High UV',
  },
  symptoms: symptomMetrics,
  triggers: [...awarenessTags],
  routines: allRoutines.map((r) => ({ id: r.id, title: r.title, subtitle: r.subtitle })),
} as const;

export type SkinContext = typeof skinContext;

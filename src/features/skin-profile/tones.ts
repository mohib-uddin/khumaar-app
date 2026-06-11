import { palette } from '@/theme';

/**
 * Score tone — how a single metric is doing relative to the AI's healthy range.
 * Used by ratio bars, skin metrics and the strengths / improvements lists.
 *  - `good`     — at or above the target band
 *  - `average`  — within range but with room to improve
 *  - `improve`  — a focus area the roadmap is targeting
 */
export type Tone = 'good' | 'average' | 'improve';

/** Solid accent per tone — green / amber / coral. */
export const toneColor: Record<Tone, string> = {
  good: palette.accent.success,
  average: '#E0A100',
  improve: '#F0564B',
};

/** Soft (10–12% alpha) backgrounds for tone tags. */
export const toneSoft: Record<Tone, string> = {
  good: 'rgba(29, 149, 110, 0.10)',
  average: 'rgba(224, 161, 0, 0.12)',
  improve: 'rgba(240, 86, 75, 0.10)',
};

export const toneLabel: Record<Tone, string> = {
  good: 'Good',
  average: 'Average',
  improve: 'Improve',
};

/**
 * Left→right red-to-green gradient for the ratio/score track. A small knob is
 * positioned along it to show where a metric falls — the same metaphor as the
 * reference report, softened to read as guidance rather than judgement.
 */
export const ratioTrackGradient = {
  colors: ['#F0564B', '#FD6D2C', '#F2C200', '#9CCB3B', palette.accent.success] as const,
  locations: [0, 0.28, 0.52, 0.78, 1] as const,
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
} as const;

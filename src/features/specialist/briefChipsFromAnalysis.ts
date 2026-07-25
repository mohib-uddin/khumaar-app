import type { ScanAnalysisRow } from '@/lib/database.types';
import { palette } from '@/theme';

import type { BriefChip } from './types';

/** Live metrics chips for Specialist hub — empty when no analysis. */
export function briefChipsFromAnalysis(
  analysis: ScanAnalysisRow | null | undefined,
): BriefChip[] {
  if (!analysis) return [];

  const focus =
    analysis.routine_plan?.focus_points?.find((p) => p.status === 'active')?.label ??
    analysis.top_focus;
  const metric = analysis.metrics?.[0];

  const chips: BriefChip[] = [
    {
      id: 'score',
      label: 'Score',
      value: `${analysis.overall_score}/100`,
      prompt: `My skin score is ${analysis.overall_score}. What should I focus on?`,
      tintBg: palette.brand[50],
      borderColor: palette.brand[100],
      labelColor: palette.brand[700],
      valueColor: palette.ink[900],
    },
    {
      id: 'focus',
      label: 'Focus',
      value: focus || 'General',
      prompt: `Why is ${focus || 'my top focus'} still my main concern?`,
      tintBg: palette.accent.warningSoft,
      borderColor: 'rgba(253, 109, 44, 0.22)',
      labelColor: palette.accent.warning,
      valueColor: palette.ink[900],
    },
  ];

  if (metric) {
    chips.push({
      id: `metric-${metric.id}`,
      label: metric.label,
      value: metric.value,
      prompt: `Tell me more about my ${metric.label} reading (${metric.value}).`,
      tintBg: 'rgba(84, 113, 255, 0.1)',
      borderColor: 'rgba(84, 113, 255, 0.22)',
      labelColor: palette.accent.info,
      valueColor: palette.ink[900],
    });
  }

  return chips.slice(0, 4);
}

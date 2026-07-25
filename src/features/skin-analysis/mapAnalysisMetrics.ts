import type { AnalysisMetric, ScanAnalysisRow } from '@/lib/database.types';
import type { ScanSummary, SkinMetric } from '@/features/skin-profile';

import type { SymptomMetric } from './data';

function toneToSeverity(tone: AnalysisMetric['tone']): { label: string; color: string } {
  if (tone === 'good') return { label: 'Ease', color: '#1D956E' };
  if (tone === 'improve') return { label: 'Focus', color: '#FD6D2C' };
  return { label: 'Gentle', color: '#5471FF' };
}

function positionToSegments(position: number): SymptomMetric['segments'] {
  const filledWeight = Math.max(20, Math.round(position * 160));
  const emptyWeight = Math.max(1, 180 - filledWeight);
  return [
    { flex: filledWeight, filled: true },
    { flex: emptyWeight, filled: false },
  ];
}

export function analysisToSymptomMetrics(
  metrics: AnalysisMetric[] | null | undefined,
): SymptomMetric[] {
  if (!metrics?.length) return [];
  return metrics.map((m) => {
    const sev = toneToSeverity(m.tone);
    return {
      id: m.id,
      label: m.label,
      severityLabel: sev.label,
      severityColor: sev.color,
      segments: positionToSegments(m.position),
    };
  });
}

export function analysisToSkinMetrics(metrics: AnalysisMetric[] | null | undefined): SkinMetric[] {
  if (!metrics?.length) return [];
  return metrics.map((m) => ({
    id: m.id,
    label: m.label,
    value: m.value,
    position: m.position,
    tone: m.tone,
  }));
}

export function analysisToScanSummary(analysis: ScanAnalysisRow | null): ScanSummary | null {
  if (!analysis) return null;
  const active =
    analysis.routine_plan?.focus_points?.find((p) => p.status === 'active')?.label ??
    analysis.top_focus;
  return {
    score: analysis.overall_score,
    total: 100,
    deltaLabel: 'Latest',
    capturedLabel: new Date(analysis.created_at).toLocaleDateString(),
    statusLabel: analysis.top_focus,
    topImprovement: analysis.metrics.find((m) => m.tone === 'good')?.label ?? 'Clarity',
    topConcern: active,
    headline: analysis.headline,
  };
}

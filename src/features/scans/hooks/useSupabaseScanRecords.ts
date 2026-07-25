import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/features/onboarding';
import type { AnalysisMetric } from '@/lib/database.types';
import { getSupabase } from '@/lib/supabase';
import type { SkinMetric } from '@/features/skin-profile';

import type { ScanComparison, ScanRecord } from '../types';

function metricsToSkin(metrics: AnalysisMetric[]): SkinMetric[] {
  return metrics.map((m) => ({
    id: m.id,
    label: m.label,
    value: m.value,
    position: m.position,
    tone: m.tone,
  }));
}

export function useSupabaseScanRecords() {
  const { user } = useAuth();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setScans([]);
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: analyses } = await supabase
      .from('scan_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const rows = analyses ?? [];
    const records: ScanRecord[] = [];

    for (const analysis of rows) {
      const { data: front } = await supabase
        .from('scans')
        .select('storage_path')
        .eq('user_id', user.id)
        .eq('batch_id', analysis.batch_id)
        .eq('view', 'front')
        .maybeSingle();

      let imageUri = '';
      if (front?.storage_path) {
        const { data: signed } = await supabase.storage
          .from('scan-photos')
          .createSignedUrl(front.storage_path, 60 * 60);
        imageUri = signed?.signedUrl ?? '';
      }

      const metrics = (analysis.metrics ?? []) as AnalysisMetric[];
      const active =
        analysis.routine_plan?.focus_points?.find((p) => p.status === 'active')?.label ??
        analysis.top_focus;
      records.push({
        id: analysis.batch_id,
        capturedAt: analysis.created_at,
        imageUri,
        view: 'front',
        summary: {
          score: analysis.overall_score,
          total: 100,
          deltaLabel: 'Latest',
          capturedLabel: new Date(analysis.created_at).toLocaleDateString(),
          statusLabel: analysis.top_focus,
          topImprovement: metrics.find((m) => m.tone === 'good')?.label ?? 'Clarity',
          topConcern: active,
          headline: analysis.headline,
        },
        skinMetrics: metricsToSkin(metrics),
      });
    }

    setScans(records);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const latestComparison: ScanComparison | null = useMemo(() => {
    if (scans.length < 2) return null;
    return { before: scans[1], after: scans[0] };
  }, [scans]);

  return { scans, latestComparison, loading, refresh };
}

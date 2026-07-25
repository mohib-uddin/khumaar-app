import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnalysisSheet,
  AnalyzeHeader,
  ScanHero,
  analysisTabs,
  type AnalysisTab,
} from '@/features/skin-analysis';
import {
  analysisToScanSummary,
  analysisToSkinMetrics,
  analysisToSymptomMetrics,
} from '@/features/skin-analysis/mapAnalysisMetrics';
import { useFrontScanAvatar } from '@/features/dashboard/hooks/useFrontScanAvatar';
import { useLatestAnalysis } from '@/features/dashboard/hooks/useLatestAnalysis';
import { fetchAnalysisByBatchId, useAuth } from '@/features/onboarding';
import type { ScanAnalysisRow } from '@/lib/database.types';

const isAnalysisTab = (value: unknown): value is AnalysisTab =>
  typeof value === 'string' && analysisTabs.some((t) => t.value === value);

export default function AnalyzeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { tab: initialTab, batchId } = useLocalSearchParams<{
    tab?: string;
    batchId?: string;
  }>();
  const targetBatchId = typeof batchId === 'string' && batchId.length > 0 ? batchId : null;

  const [tab, setTab] = useState<AnalysisTab>(
    isAnalysisTab(initialTab) &&
      (initialTab === 'overview' || initialTab === 'symptoms')
      ? initialTab
      : 'overview',
  );

  const { analysis: latestAnalysis } = useLatestAnalysis();
  const [batchAnalysis, setBatchAnalysis] = useState<ScanAnalysisRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!targetBatchId || !user?.id) {
      setBatchAnalysis(null);
      return;
    }
    void (async () => {
      try {
        const row = await fetchAnalysisByBatchId(user.id, targetBatchId);
        if (!cancelled) setBatchAnalysis(row);
      } catch {
        if (!cancelled) setBatchAnalysis(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [targetBatchId, user?.id]);

  const analysis = targetBatchId ? batchAnalysis : latestAnalysis;
  const imageUri = useFrontScanAvatar(analysis?.batch_id);

  const summary = useMemo(() => analysisToScanSummary(analysis), [analysis]);
  const skinMetrics = useMemo(
    () => analysisToSkinMetrics(analysis?.metrics),
    [analysis?.metrics],
  );
  const symptomMetrics = useMemo(
    () => analysisToSymptomMetrics(analysis?.metrics),
    [analysis?.metrics],
  );

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <ScanHero imageUri={imageUri} />
      <AnalyzeHeader />
      <AnalysisSheet
        tab={tab}
        onTabChange={setTab}
        summary={summary}
        skinMetrics={skinMetrics.length ? skinMetrics : undefined}
        symptomMetrics={symptomMetrics.length ? symptomMetrics : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

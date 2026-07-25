import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
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

const isAnalysisTab = (value: unknown): value is AnalysisTab =>
  typeof value === 'string' && analysisTabs.some((t) => t.value === value);

export default function AnalyzeScreen() {
  const insets = useSafeAreaInsets();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<AnalysisTab>(
    isAnalysisTab(initialTab) ? initialTab : 'symptoms',
  );
  const { analysis } = useLatestAnalysis();
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

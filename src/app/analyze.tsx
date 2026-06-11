import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    AnalysisSheet,
    AnalyzeHeader,
    ScanHero,
    analysisTabs,
    type AnalysisTab,
} from '@/features/skin-analysis';

const isAnalysisTab = (value: unknown): value is AnalysisTab =>
  typeof value === 'string' && analysisTabs.some((t) => t.value === value);

export default function AnalyzeScreen() {
  const insets = useSafeAreaInsets();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<AnalysisTab>(
    isAnalysisTab(initialTab) ? initialTab : 'symptoms',
  );

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <ScanHero />
      <AnalyzeHeader />
      <AnalysisSheet tab={tab} onTabChange={setTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

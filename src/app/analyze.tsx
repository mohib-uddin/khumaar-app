import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    AnalysisSheet,
    AnalyzeHeader,
    ScanHero,
    type AnalysisTab,
} from '@/features/skin-analysis';

export default function AnalyzeScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<AnalysisTab>('symptoms');

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

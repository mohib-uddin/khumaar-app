import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ChipTabs } from '@/components/ui';
import type { ScanSummary, SkinMetric } from '@/features/skin-profile';
import { layout, palette, radii, spacing } from '@/theme';

import { analysisTabs, type AnalysisTab, type SymptomMetric } from './data';
import { OverviewPanel } from './OverviewPanel';
import { RatiosPanel } from './RatiosPanel';
import { SpecialPanel } from './SpecialPanel';
import { SymptomsPanel } from './SymptomsPanel';
import { TreatmentsPanel } from './TreatmentsPanel';

type Props = {
  tab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
  summary?: ScanSummary | null;
  skinMetrics?: SkinMetric[];
  symptomMetrics?: SymptomMetric[];
};

function ActivePanel({
  tab,
  summary,
  skinMetrics,
  symptomMetrics,
}: {
  tab: AnalysisTab;
  summary?: ScanSummary | null;
  skinMetrics?: SkinMetric[];
  symptomMetrics?: SymptomMetric[];
}) {
  switch (tab) {
    case 'overview':
      return <OverviewPanel summary={summary} metrics={skinMetrics} />;
    case 'symptoms':
      return <SymptomsPanel metrics={symptomMetrics} />;
    case 'ratios':
      return <RatiosPanel />;
    case 'treatments':
      return <TreatmentsPanel />;
    case 'special':
      return <SpecialPanel />;
    default:
      return null;
  }
}

/** Figma node 0:123 — bottom sheet with tabs and per-tab analysis content. */
export function AnalysisSheet({
  tab,
  onTabChange,
  summary,
  skinMetrics,
  symptomMetrics,
}: Props) {
  return (
    <Animated.View entering={FadeInUp.duration(420).springify()} style={styles.sheet}>
      <View style={styles.handle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces={false}>
        <ChipTabs options={analysisTabs} value={tab} onChange={onTabChange} />

        <Animated.View key={tab} entering={FadeInDown.duration(280).springify()}>
          <ActivePanel
            tab={tab}
            summary={summary}
            skinMetrics={skinMetrics}
            symptomMetrics={symptomMetrics}
          />
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: palette.white,
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    marginTop: -66,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 29,
    height: 2,
    borderRadius: 1,
    backgroundColor: palette.ink[200],
    marginTop: spacing.base,
  },
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing['7xl'],
    gap: spacing['4xl'],
  },
});

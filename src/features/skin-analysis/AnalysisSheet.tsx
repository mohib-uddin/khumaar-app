import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { AwarenessTag, ChipTabs, Text } from '@/components/ui';
import { layout, palette, radii, spacing } from '@/theme';

import {
    analysisTabs,
    awarenessTags,
    symptomMetrics,
    type AnalysisTab,
} from './data';
import { SymptomMetricRow } from './SymptomMetricRow';

type Props = {
  tab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
};

/** Figma node 0:123 — bottom sheet panel with tabs and analysis content. */
export function AnalysisSheet({ tab, onTabChange }: Props) {
  return (
    <Animated.View entering={FadeInUp.duration(420).springify()} style={styles.sheet}>
      <View style={styles.handle} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces={false}>
        <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.section}>
          <ChipTabs options={analysisTabs} value={tab} onChange={onTabChange} />

          <View style={styles.heading}>
            <Text variant="sectionTitle" color="textPrimary">
              Detailed Analysis
            </Text>
            <Text variant="body" color="textTertiary">
              Based on AI skin detection
            </Text>
          </View>

          {tab === 'symptoms' ? (
            <View style={styles.metrics}>
              {symptomMetrics.map((metric, index) => (
                <SymptomMetricRow key={metric.id} metric={metric} index={index} />
              ))}
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Text variant="body" color="textTertiary">
                {tab === 'overview'
                  ? 'Your overall skin health summary will appear here.'
                  : tab === 'treatments'
                    ? 'Recommended treatments based on your scan.'
                    : 'Specialist recommendations for your skin type.'}
              </Text>
            </View>
          )}
        </Animated.View>

        {tab === 'symptoms' ? (
          <Animated.View entering={FadeInDown.delay(320).springify()} style={styles.awareSection}>
            <Text variant="stepTitle" color="textPrimary">
              Be aware
            </Text>
            <View style={styles.tags}>
              {awarenessTags.map((tag) => (
                <AwarenessTag key={tag} label={tag} />
              ))}
            </View>
          </Animated.View>
        ) : null}
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
    paddingBottom: spacing['6xl'],
    gap: spacing['5xl'],
  },
  section: {
    gap: spacing['4xl'],
  },
  heading: {
    gap: spacing.base,
  },
  metrics: {
    gap: spacing.xxl,
  },
  placeholder: {
    paddingVertical: spacing.xxxl,
  },
  awareSection: {
    gap: spacing.base,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
});

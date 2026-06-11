import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { Card, SegmentedToggle, Text } from '@/components/ui';
import { palette, spacing } from '@/theme';

import type { FacialRatios as FacialRatiosData } from '../data';
import { FacialScoreCard } from './FacialScoreCard';
import { HighlightRow } from './HighlightRow';
import { MetricGroup } from './MetricGroup';
import { SummaryCounts } from './SummaryCounts';

type RatioView = 'front' | 'side';

const VIEW_OPTIONS = [
  { value: 'front' as const, label: 'Front' },
  { value: 'side' as const, label: 'Side' },
] as const;

type Props = {
  data: FacialRatiosData;
};

/**
 * Full facial-ratio report — harmony score, strengths/average/improve counts,
 * a front/side ratio explorer, and the key strengths & focus areas.
 */
export function FacialRatios({ data }: Props) {
  const [view, setView] = useState<RatioView>('front');
  const groups = view === 'front' ? data.front : data.side;

  return (
    <View style={styles.wrap}>
      <FacialScoreCard score={data.score} />

      <SummaryCounts counts={data.counts} />

      <View style={styles.toggleRow}>
        <SegmentedToggle
          options={VIEW_OPTIONS}
          value={view}
          onChange={setView}
          accessibilityLabel="Front or side ratios"
        />
      </View>

      <Card style={styles.groupsCard}>
        {groups.map((group, index) => (
          <Animated.View
            key={`${view}-${group.id}`}
            entering={FadeIn.duration(220)}
            layout={LinearTransition.springify()}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <MetricGroup group={group} defaultOpen={index === 0} />
          </Animated.View>
        ))}
      </Card>

      <Section title="Key strengths">
        {data.strengths.map((item, index) => (
          <HighlightRow key={item.id} highlight={item} index={index} />
        ))}
      </Section>

      <Section title="Focus areas">
        {data.improvements.map((item, index) => (
          <HighlightRow key={item.id} highlight={item} index={index} />
        ))}
      </Section>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="stepTitle" color="textPrimary">
        {title}
      </Text>
      <Card style={styles.sectionCard}>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xxl,
  },
  toggleRow: {
    alignSelf: 'flex-start',
  },
  groupsCard: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginVertical: spacing.lg,
  },
  section: {
    gap: spacing.lg,
  },
  sectionCard: {
    padding: spacing.xxl,
    gap: spacing.xxl,
  },
});

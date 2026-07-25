import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyStateCard, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

import type { CoachHistoryItem } from '../../hooks/useCoachHistory';
import type { BriefChip } from '../../types';
import { SPECIALIST_COMPOSER_HEIGHT } from '../SpecialistComposer';
import { SpecialistOrbHero } from '../SpecialistOrbHero';
import { BriefMetricsStrip } from './BriefMetricsStrip';
import { CoachHistoryRow } from './CoachHistoryRow';
import { SpecialistHubHeader } from './SpecialistHubHeader';

type Props = {
  onBack: () => void;
  chips: BriefChip[];
  history: CoachHistoryItem[];
  onBriefMetric: (prompt: string) => void;
  onOpenHistory: (item: CoachHistoryItem) => void;
};

export function SpecialistHub({
  onBack,
  chips,
  history,
  onBriefMetric,
  onOpenHistory,
}: Props) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + SPECIALIST_COMPOSER_HEIGHT + spacing.xxxl;

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: bottomPad }}>
      <SpecialistHubHeader onBack={onBack} />
      <SpecialistOrbHero />

      <View style={styles.body}>
        <BriefMetricsStrip onMetricPress={onBriefMetric} chips={chips} />

        <View style={styles.recent}>
          <Text variant="sectionTitle" color="textPrimary">
            Chat history
          </Text>
          {history.length ? (
            history.map((item) => (
              <CoachHistoryRow
                key={item.id}
                item={item}
                onPress={() => onOpenHistory(item)}
              />
            ))
          ) : (
            <EmptyStateCard
              title="Start a conversation"
              caption="Ask Khumaar anything about your skin."
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    paddingHorizontal: layout.screenPaddingX,
    gap: spacing.xxxl,
    marginTop: spacing.lg,
  },
  recent: {
    gap: spacing.base,
  },
});

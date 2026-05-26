import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MagicWand, ScanFace } from '@/components/icons';
import { Text } from '@/components/ui';
import { layout, palette, spacing } from '@/theme';

import { recentActivities } from '../../recentActivities';
import { SPECIALIST_COMPOSER_HEIGHT } from '../SpecialistComposer';
import { SpecialistOrbHero } from '../SpecialistOrbHero';
import { BriefMetricsStrip } from './BriefMetricsStrip';
import { FeatureActionCard } from './FeatureActionCard';
import { RecentActivityRow } from './RecentActivityRow';
import { SpecialistHubHeader } from './SpecialistHubHeader';

type Props = {
  onBack: () => void;
  onFeatureScan: () => void;
  onFeatureRoutine: () => void;
  onRecentActivity: (id: string) => void;
  onBriefMetric: (prompt: string) => void;
};

export function SpecialistHub({
  onBack,
  onFeatureScan,
  onFeatureRoutine,
  onRecentActivity,
  onBriefMetric,
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
        <BriefMetricsStrip onMetricPress={onBriefMetric} />

        <View style={styles.featureRow}>
          <FeatureActionCard
            title="Skin photo scan"
            subtitle="AI detection & symptom map"
            icon={<ScanFace size={22} color={palette.ink[900]} />}
            onPress={onFeatureScan}
          />
          <FeatureActionCard
            title="Routine advisor"
            subtitle="Adjust steps for today"
            icon={<MagicWand size={22} color={palette.ink[900]} />}
            onPress={onFeatureRoutine}
          />
        </View>

        <View style={styles.recent}>
          <Text variant="sectionTitle" color="textPrimary">
            Recent activity
          </Text>
          {recentActivities.map((activity) => (
            <RecentActivityRow
              key={activity.id}
              activity={activity}
              onPress={() => onRecentActivity(activity.id)}
            />
          ))}
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
  featureRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  recent: {
    gap: spacing.lg,
  },
});

import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeft, ChevronRight, Lightning } from '@/components/icons';
import { Card, IconButton, PressableScale, Screen, Text } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import { layout, palette, spacing } from '@/theme';

import { ScanHistoryRow } from './ScanHistoryRow';
import { useScanRecords } from './store';
import type { ScanRecord } from './types';

const STAGGER = 80;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

function formatRange(before: ScanRecord, after: ScanRecord) {
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
  return `${formatter.format(new Date(before.capturedAt))} -> ${formatter.format(new Date(after.capturedAt))}`;
}

/** Scan history with quick access to latest before/after comparison. */
export function ScanHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scans, latestComparison } = useScanRecords();

  const openCompare = (before: ScanRecord, after: ScanRecord) => {
    router.push({
      pathname: '/scans/compare',
      params: { beforeId: before.id, afterId: after.id },
    });
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <HeaderBlur />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + layout.tabBarHeight + spacing.xxxl },
        ]}>
        <Animated.View entering={enter(0)} style={styles.header}>
          <IconButton accessibilityLabel="Go back" onPress={() => router.back()}>
            <ArrowLeft size={22} color={palette.ink[900]} />
          </IconButton>
          <Text variant="sectionTitle" color="textPrimary">
            Scan history
          </Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <View style={styles.body}>
          <Animated.View entering={enter(1)} style={styles.heroCopy}>
            <Text variant="displayLg" color="textPrimary">
              Your progress
            </Text>
            <Text variant="body" color="textTertiary">
              Compare skin scores, photos, and key metrics across scans.
            </Text>
          </Animated.View>

          {latestComparison ? (
            <Animated.View entering={enter(2)}>
              <PressableScale
                onPress={() => openCompare(latestComparison.before, latestComparison.after)}
                dim={false}
                pressedScale={0.98}
                accessibilityRole="button"
                accessibilityLabel="Compare latest progress">
                <Card style={styles.featureCard}>
                  <View style={styles.featureHeader}>
                    <View style={styles.featureIcon}>
                      <Lightning size={18} color={palette.ink[900]} />
                    </View>
                    <View style={styles.featureCopy}>
                      <Text variant="cardTitle" color="textPrimary">
                        Latest before / after
                      </Text>
                      <Text variant="caption" color="textTertiary">
                        {formatRange(latestComparison.before, latestComparison.after)}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={palette.brand[700]} />
                  </View>

                  <View style={styles.scoreStrip}>
                    <ScoreCell
                      label="Before"
                      value={latestComparison.before.summary.score}
                    />
                    <View style={styles.divider} />
                    <ScoreCell
                      label="After"
                      value={latestComparison.after.summary.score}
                      emphasis
                    />
                    <View style={styles.divider} />
                    <ScoreCell
                      label="Change"
                      value={latestComparison.after.summary.score - latestComparison.before.summary.score}
                      prefix="+"
                      emphasis
                    />
                  </View>
                </Card>
              </PressableScale>
            </Animated.View>
          ) : null}

          <Animated.View entering={enter(3)} style={styles.listSection}>
            <Text variant="sectionTitle" color="textPrimary">
              All scans
            </Text>
            <View style={styles.list}>
              {scans.map((scan, index) => (
                <ScanHistoryRow
                  key={scan.id}
                  scan={scan}
                  compareTo={scans[index + 1]}
                  latest={index === 0}
                  onCompare={openCompare}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function ScoreCell({
  label,
  value,
  prefix = '',
  emphasis,
}: {
  label: string;
  value: number;
  prefix?: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.scoreCell}>
      <Text variant="metricLg" color={emphasis ? palette.brand[700] : 'textPrimary'}>
        {`${prefix}${value}`}
      </Text>
      <Text variant="caption" color="textTertiary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 56,
  },
  body: {
    marginTop: spacing['5xl'],
    gap: spacing['4xl'],
  },
  heroCopy: {
    gap: spacing.base,
  },
  featureCard: {
    padding: spacing.xxl,
    gap: spacing.xl,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.brand[300],
  },
  featureCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  scoreStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surface.sunken,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  scoreCell: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: palette.ink[100],
  },
  listSection: {
    gap: spacing.lg,
  },
  list: {
    gap: spacing.base,
  },
});

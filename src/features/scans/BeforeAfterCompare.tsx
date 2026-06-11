import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeft, Lightning } from '@/components/icons';
import { Card, IconButton, Pill, Screen, Text } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import { layout, palette, radii, spacing } from '@/theme';

import { MetricDeltaRow, metricDeltas } from './MetricDeltaRow';
import { findScanComparison, useScanRecords } from './store';
import type { ScanRecord } from './types';

const STAGGER = 80;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function scoreDelta(before: number, after: number) {
  const delta = after - before;
  if (delta === 0) return 'Stable';
  return `${delta > 0 ? '+' : ''}${delta}`;
}

/** Side-by-side before/after comparison for two stored scan records. */
export function BeforeAfterCompare() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { beforeId, afterId } = useLocalSearchParams<{
    beforeId?: string;
    afterId?: string;
  }>();
  const { scans } = useScanRecords();

  const comparison = useMemo(
    () => findScanComparison(scans, beforeId, afterId),
    [afterId, beforeId, scans],
  );

  const deltas = useMemo(() => {
    if (!comparison) return [];
    return metricDeltas(comparison.before, comparison.after).slice(0, 6);
  }, [comparison]);

  if (!comparison) {
    return (
      <Screen edges={['top', 'left', 'right']}>
        <HeaderBlur />
        <View style={styles.empty}>
          <Text variant="sectionTitle" color="textPrimary">
            Not enough scans yet
          </Text>
          <Text variant="body" color="textTertiary" style={styles.emptyText}>
            Complete another scan to compare your before and after progress.
          </Text>
        </View>
      </Screen>
    );
  }

  const { before, after } = comparison;
  const harmonyBefore = before.facialRatios?.score.overall;
  const harmonyAfter = after.facialRatios?.score.overall;

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
            Before / After
          </Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <View style={styles.body}>
          <Animated.View entering={enter(1)} style={styles.heroCopy}>
            <Text variant="displayLg" color="textPrimary">
              Your progress
            </Text>
            <Text variant="body" color="textTertiary">
              {`${formatDate(before.capturedAt)} -> ${formatDate(after.capturedAt)}`}
            </Text>
          </Animated.View>

          <Animated.View entering={enter(2)} style={styles.photoRow}>
            <PhotoCard label="Before" scan={before} />
            <PhotoCard label="After" scan={after} highlight />
          </Animated.View>

          <Animated.View entering={enter(3)}>
            <Card style={styles.scoreCard}>
              <View style={styles.scoreHeader}>
                <View style={styles.scoreIcon}>
                  <Lightning size={18} color={palette.ink[900]} />
                </View>
                <View style={styles.scoreCopy}>
                  <Text variant="cardTitle" color="textPrimary">
                    Progress summary
                  </Text>
                  <Text variant="caption" color="textTertiary">
                    {after.summary.headline}
                  </Text>
                </View>
              </View>

              <View style={styles.scoreStrip}>
                <ScoreCell
                  label="Skin score"
                  before={before.summary.score}
                  after={after.summary.score}
                />
                {typeof harmonyBefore === 'number' && typeof harmonyAfter === 'number' ? (
                  <>
                    <View style={styles.divider} />
                    <ScoreCell
                      label="Harmony"
                      before={harmonyBefore}
                      after={harmonyAfter}
                      decimals={1}
                    />
                  </>
                ) : null}
              </View>
            </Card>
          </Animated.View>

          <Animated.View entering={enter(4)} style={styles.section}>
            <Text variant="sectionTitle" color="textPrimary">
              Metric changes
            </Text>
            <Card style={styles.metricsCard}>
              {deltas.map((metric, index) => (
                <View key={metric.id}>
                  {index > 0 ? <View style={styles.metricDivider} /> : null}
                  <MetricDeltaRow
                    label={metric.label}
                    beforeValue={metric.beforeValue}
                    afterValue={metric.afterValue}
                    delta={metric.delta}
                  />
                </View>
              ))}
            </Card>
          </Animated.View>

          <Animated.View entering={enter(5)}>
            <Card style={styles.noteCard} background={palette.surface.sunken}>
              <Text variant="caption" color="textSecondary" style={styles.noteText}>
                Lighting and angles affect how skin appears in photos. Use comparisons as a
                guide alongside how your skin feels.
              </Text>
            </Card>
          </Animated.View>
        </View>
      </ScrollView>
    </Screen>
  );
}

function PhotoCard({
  label,
  scan,
  highlight,
}: {
  label: string;
  scan: ScanRecord;
  highlight?: boolean;
}) {
  return (
    <Card style={[styles.photoCard, highlight && styles.photoCardHighlight]}>
      <View style={styles.photoFrame}>
        <Image
          source={scan.imageSource ?? { uri: scan.imageUri }}
          style={styles.photo}
          contentFit="cover"
          contentPosition="center"
          transition={200}
        />
        <View style={styles.photoShade} />
        <View style={styles.photoMeta}>
          <Pill paddingX={10} paddingY={5} background="rgba(255, 255, 255, 0.92)">
            <Text variant="captionMedium" color={palette.ink[700]}>
              {label}
            </Text>
          </Pill>
          <Text variant="caption" color={palette.white}>
            {formatDate(scan.capturedAt)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

function ScoreCell({
  label,
  before,
  after,
  decimals = 0,
}: {
  label: string;
  before: number;
  after: number;
  decimals?: number;
}) {
  const delta = after - before;
  const deltaColor = delta >= 0 ? palette.accent.success : palette.accent.warning;

  return (
    <View style={styles.scoreCell}>
      <Text variant="metricLg" color="textPrimary">
        {after.toFixed(decimals)}
      </Text>
      <Text variant="caption" color="textTertiary">
        {label}
      </Text>
      <Text variant="captionMedium" color={deltaColor}>
        {scoreDelta(Number(before.toFixed(decimals)), Number(after.toFixed(decimals)))}
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
  photoRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  photoCard: {
    flex: 1,
    padding: spacing.sm,
  },
  photoCardHighlight: {
    borderWidth: 1,
    borderColor: palette.brand[300],
  },
  photoFrame: {
    height: 184,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: palette.surface.sunken,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '44%',
    backgroundColor: 'rgba(16, 16, 16, 0.25)',
  },
  photoMeta: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    gap: spacing.xs,
  },
  scoreCard: {
    padding: spacing.xxl,
    gap: spacing.xl,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  scoreIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.brand[300],
  },
  scoreCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  scoreStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    height: 44,
    backgroundColor: palette.ink[100],
  },
  section: {
    gap: spacing.lg,
  },
  metricsCard: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  metricDivider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginVertical: spacing.lg,
  },
  noteCard: {
    padding: spacing.xl,
  },
  noteText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPaddingX,
    gap: spacing.base,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

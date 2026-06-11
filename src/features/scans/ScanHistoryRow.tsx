import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ChevronRight } from '@/components/icons';
import { Card, Pill, PressableScale, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

import type { ScanRecord } from './types';

type Props = {
  scan: ScanRecord;
  compareTo?: ScanRecord;
  latest?: boolean;
  onCompare?: (before: ScanRecord, after: ScanRecord) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

/** Single scan-history row with thumbnail, score, and one-tap comparison. */
export function ScanHistoryRow({ scan, compareTo, latest = false, onCompare }: Props) {
  const canCompare = Boolean(compareTo && onCompare);

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.thumbWrap}>
          <Image
            source={scan.imageSource ?? { uri: scan.imageUri }}
            style={styles.thumb}
            contentFit="cover"
            contentPosition="center"
          />
        </View>

        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text variant="stepTitle" color="textPrimary">
              {latest ? 'Latest scan' : 'Skin scan'}
            </Text>
            {latest ? (
              <Pill paddingX={8} paddingY={4} background={palette.brand[50]}>
                <Text variant="metricSm" color={palette.brand[700]}>
                  Latest
                </Text>
              </Pill>
            ) : null}
          </View>
          <Text variant="caption" color="textTertiary">
            {formatDate(scan.capturedAt)}
          </Text>
          <Text variant="captionMedium" color={palette.accent.success}>
            {scan.summary.statusLabel}
          </Text>
        </View>

        <View style={styles.scoreCol}>
          <Text variant="metricLg" color="textPrimary">
            {scan.summary.score}
          </Text>
          <Text variant="caption" color="textTertiary">
            / {scan.summary.total}
          </Text>
        </View>
      </View>

      {canCompare && compareTo ? (
        <PressableScale
          onPress={() => onCompare?.(compareTo, scan)}
          dim={false}
          pressedScale={0.98}
          accessibilityRole="button"
          accessibilityLabel={`Compare ${formatDate(compareTo.capturedAt)} to ${formatDate(scan.capturedAt)}`}
          style={styles.compareRow}>
          <Text variant="captionMedium" color={palette.brand[700]}>
            Compare with previous scan
          </Text>
          <ChevronRight size={16} color={palette.brand[700]} />
        </PressableScale>
      ) : (
        <View style={styles.baselineRow}>
          <Text variant="caption" color="textTertiary">
            Baseline scan
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.base,
    gap: spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: palette.surface.sunken,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scoreCol: {
    alignItems: 'flex-end',
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.pill,
    paddingVertical: spacing.base,
  },
  baselineRow: {
    alignItems: 'center',
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.pill,
    paddingVertical: spacing.base,
  },
});

import { StyleSheet, View } from 'react-native';

import { Clock, ScanFace } from '@/components/icons';
import { Button, Card, Pill, Text } from '@/components/ui';
import { scanStreak, upcomingScans } from '@/features/skin-profile';
import { palette, radii, spacing } from '@/theme';

type Props = {
  onStartScan?: () => void;
};

/** Dashboard card: the next required scan, a CTA, and what's coming up. */
export function UpcomingScansCard({ onStartScan }: Props) {
  const next = upcomingScans.find((scan) => scan.emphasis) ?? upcomingScans[0];
  const rest = upcomingScans.filter((scan) => scan.id !== next.id);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="cardTitle" color="textPrimary">
          Upcoming Scans
        </Text>
        <Pill paddingX={10} paddingY={5} background={palette.surface.sunken}>
          <Text variant="metricSm" color={palette.ink[500]}>
            {`${scanStreak.current}/${scanStreak.goal} ${scanStreak.label}`}
          </Text>
        </Pill>
      </View>

      <View style={styles.nextBlock}>
        <View style={styles.nextRow}>
          <View style={styles.iconTile}>
            <ScanFace size={22} color={palette.ink[900]} />
          </View>
          <View style={styles.nextCopy}>
            <Text variant="stepTitle" color="textPrimary">
              {next.title}
            </Text>
            <Text variant="caption" color="textTertiary">
              {next.subtitle}
            </Text>
          </View>
          <Pill paddingX={10} paddingY={5} background={palette.white}>
            <Text variant="metricSm" color={palette.brand[700]}>
              {next.dueLabel}
            </Text>
          </Pill>
        </View>

        <Button
          label="Scan now"
          icon={<ScanFace size={18} color={palette.ink[900]} />}
          onPress={onStartScan}
          accessibilityLabel="Start your skin scan"
        />
      </View>

      <View style={styles.list}>
        {rest.map((scan) => (
          <View key={scan.id} style={styles.listRow}>
            <Clock size={16} color={palette.ink[400]} />
            <Text variant="body" color="textSecondary" style={styles.listTitle} numberOfLines={1}>
              {scan.title}
            </Text>
            <Text variant="captionMedium" color={palette.ink[400]}>
              {scan.dueLabel}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    gap: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextBlock: {
    backgroundColor: palette.brand[50],
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  nextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  list: {
    gap: spacing.lg,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  listTitle: {
    flex: 1,
  },
});

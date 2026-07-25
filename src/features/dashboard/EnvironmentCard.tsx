import { StyleSheet, View } from 'react-native';

import { Sun } from '@/components/icons';
import { Card, Text } from '@/components/ui';
import { palette, spacing } from '@/theme';

import type { EnvironmentReading } from './data';
import { EnvironmentChart } from './EnvironmentChart';

type Props = {
  location: string;
  status: string;
  readings: EnvironmentReading[];
  /** When false, chart is omitted and caption explains why. */
  available?: boolean;
  emptyCaption?: string;
};

export function EnvironmentCard({
  location,
  status,
  readings,
  available = true,
  emptyCaption = 'Allow location to see local UV.',
}: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <Text variant="cardTitle" color="textPrimary">
          Environment
        </Text>
        <Text variant="caption" color={palette.ink[300]}>
          {location}
        </Text>
      </View>

      {available ? (
        <EnvironmentChart readings={readings} />
      ) : (
        <View style={styles.emptyBody}>
          <Text variant="caption" color={palette.ink[300]} style={styles.emptyCaption}>
            {emptyCaption}
          </Text>
        </View>
      )}

      <View style={styles.statusRow}>
        <Sun size={14} color={available ? palette.accent.warning : palette.ink[300]} />
        <Text
          variant="captionMedium"
          color={available ? palette.accent.warning : palette.ink[300]}>
          {status}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.5%',
    height: 160,
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  heading: {
    gap: spacing.xs,
  },
  emptyBody: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  emptyCaption: {
    lineHeight: 16,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

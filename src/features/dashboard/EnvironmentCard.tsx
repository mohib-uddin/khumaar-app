import { StyleSheet, View } from 'react-native';

import { Sun } from '@/components/icons';
import { Card, Text } from '@/components/ui';
import { palette, spacing } from '@/theme';

import { EnvironmentChart } from './EnvironmentChart';

type Props = {
  location?: string;
  status?: string;
};

export function EnvironmentCard({ location = 'LA, California', status = 'High UV' }: Props) {
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

      <EnvironmentChart />

      <View style={styles.statusRow}>
        <Sun size={14} color={palette.accent.warning} />
        <Text variant="captionMedium" color={palette.accent.warning}>
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
  statusRow: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

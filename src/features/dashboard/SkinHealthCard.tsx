import { StyleSheet, View } from 'react-native';

import { Lightning } from '@/components/icons';
import { Card, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

type Props = {
  score: number;
  total?: number;
  updatedAt: string;
  status: string;
};

/**
 * Card showing the user's current skin health score, last update timestamp,
 * and an inline status pill at the bottom. Callers must supply live values —
 * no mock defaults.
 */
export function SkinHealthCard({ score, total = 100, updatedAt, status }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <Text variant="cardTitle" color="textPrimary">
          Skin Health Score
        </Text>
        <Text variant="caption" color={palette.ink[300]}>
          {updatedAt}
        </Text>
      </View>

      <View style={styles.scoreWrap}>
        <View style={styles.scoreOuter}>
          <View style={styles.scoreInner}>
            <Text variant="metricLg" color="textPrimary">
              {`${score}/${total}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statusRow}>
        <Lightning size={14} color={palette.accent.success} />
        <Text variant="captionMedium" color={palette.accent.success}>
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
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  heading: {
    gap: spacing.xs,
  },
  scoreWrap: {
    alignItems: 'center',
  },
  scoreOuter: {
    width: 111,
    height: 49,
    backgroundColor: palette.surface.sunkenAlt,
    borderRadius: radii.pill,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 7,
  },
  scoreInner: {
    flex: 1,
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.pill,
    borderWidth: 3,
    borderColor: palette.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

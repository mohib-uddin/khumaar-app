import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

type Props = {
  score?: number;
  total?: number;
  updatedAt?: string;
  status?: string;
};

/**
 * Compact harmony score widget — mirrors the dashboard Skin Health card layout.
 */
export function HarmonyScoreCard({
  score = 7.2,
  total = 10,
  updatedAt = 'Front & side',
  status = 'Top 25%',
}: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <Text variant="cardTitle" color="textPrimary">
          Facial Harmony
        </Text>
        <Text variant="caption" color={palette.ink[300]}>
          {updatedAt}
        </Text>
      </View>

      <View style={styles.scoreWrap}>
        <View style={styles.scoreOuter}>
          <View style={styles.scoreInner}>
            <Text variant="metricLg" color="textPrimary">
              {`${score.toFixed(1)}/${total}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statusRow}>
        <Text variant="captionMedium" color={palette.brand[700]}>
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
    borderColor: palette.ink[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    alignItems: 'center',
    alignSelf: 'center',
  },
});

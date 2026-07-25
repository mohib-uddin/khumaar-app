import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ChevronEnter } from '@/components/icons';
import { Card, PressableScale, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

import type { CoachHistoryItem } from '../../hooks/useCoachHistory';

const agentOrb = require('../../../../../assets/figma/tab-bar/agent-orb.png');

type Props = {
  item: CoachHistoryItem;
  onPress: () => void;
};

/** Chat history card — same shell language as RecentActivity / ScanHistory rows. */
export function CoachHistoryRow({ item, onPress }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      dim={false}
      pressedScale={0.98}
      accessibilityRole="button"
      accessibilityLabel={item.title}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}>
            <Image source={agentOrb} style={styles.orb} contentFit="contain" />
          </View>

          <View style={styles.copy}>
            <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
              {item.title}
            </Text>
            <Text variant="caption" color="textTertiary" numberOfLines={2}>
              {item.subtitle}
            </Text>
            {item.timeLabel ? (
              <Text variant="metricSm" color={palette.ink[300]}>
                {item.timeLabel}
              </Text>
            ) : null}
          </View>

          <ChevronEnter size={20} color={palette.ink[300]} />
        </View>
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 28,
    height: 28,
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
    minWidth: 0,
  },
});

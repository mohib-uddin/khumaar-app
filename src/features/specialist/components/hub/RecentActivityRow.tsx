import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronEnter } from '@/components/icons';
import { Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

import type { RecentActivity } from '../../recentActivities';

type Props = {
  activity: RecentActivity;
  onPress: () => void;
};

const KIND_LABEL: Record<RecentActivity['kind'], string> = {
  scan: 'Scan',
  routine: 'Routine',
  insight: 'Insight',
};

export function RecentActivityRow({ activity, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <Text variant="captionMedium" color={palette.ink[900]}>
          {KIND_LABEL[activity.kind].charAt(0)}
        </Text>
      </View>
      <View style={styles.copy}>
        <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
          {activity.title}
        </Text>
        <Text variant="caption" color="textTertiary" numberOfLines={1}>
          {activity.subtitle}
        </Text>
      </View>
      <ChevronEnter size={20} color={palette.ink[300]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.white,
    borderRadius: radii['2xl'],
    padding: spacing.lg,
    ...{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  },
  pressed: {
    opacity: 0.9,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xxs,
  },
});

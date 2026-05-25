import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ChevronEnter } from '@/components/icons';
import { Avatar, PressableScale, Text } from '@/components/ui';
import { palette, spacing, springs } from '@/theme';

import type { ImageSource } from 'expo-image';

type Props = {
  title: string;
  subtitle: string;
  avatar: ImageSource | number;
  expanded: boolean;
  onPress?: () => void;
};

/**
 * Routine summary row — header inside expandable cards.
 * Chevron animates between collapsed (180°) and expanded (−90°) states.
 */
export function RoutineSummaryRow({
  title,
  subtitle,
  avatar,
  expanded,
  onPress,
}: Props) {
  const rotation = useSharedValue(expanded ? -90 : 180);

  useEffect(() => {
    rotation.value = withSpring(expanded ? -90 : 180, springs.enter);
  }, [expanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}. ${expanded ? 'Collapse' : 'Expand'}`}
      style={styles.row}>
      <View style={styles.leading}>
        <Avatar source={avatar} size={64} ringWidth={0} />
        <View style={styles.copy}>
          <Text variant="routineTitle" color="textPrimary" numberOfLines={1}>
            {title}
          </Text>
          <Text variant="caption" color="textTertiary" numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.action}>
        <Animated.View style={chevronStyle}>
          <ChevronEnter size={22} />
        </Animated.View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  },
  copy: {
    gap: spacing.xs,
    flexShrink: 1,
  },
  action: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    backgroundColor: palette.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

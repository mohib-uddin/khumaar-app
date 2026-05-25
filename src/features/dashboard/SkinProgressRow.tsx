import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Text } from '@/components/ui';
import { durations, easings, palette, radii, spacing } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 50;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  label?: string;
  delta?: string;
  percent?: number;
};

export function SkinProgressRow({ label = 'Skin', delta = '+2.3%', percent = 52 }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      400,
      withTiming(percent / 100, { duration: durations.slower, easing: easings.emphasized }),
    );
  }, [percent, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text variant="cardTitle" color="textPrimary">
          {label}
        </Text>
        <Text variant="captionMedium" color={palette.accent.success}>
          {delta}
        </Text>
      </View>

      <View style={styles.dial}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={palette.surface.sunken}
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={palette.brand[500]}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={animatedProps}
            fill="none"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        <View style={styles.dialLabel}>
          <Text variant="metric" color="textPrimary">
            {`${percent}%`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 57,
    paddingLeft: 17,
    paddingRight: 3,
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.pill,
  },
  text: {
    gap: spacing.xs,
  },
  dial: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialLabel: {
    position: 'absolute',
  },
});

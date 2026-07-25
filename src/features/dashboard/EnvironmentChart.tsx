import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { DotMarker } from '@/components/icons';
import { Text } from '@/components/ui';
import { durations, easings, palette } from '@/theme';

import { environmentReadings, type EnvironmentReading } from './data';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const CHART_W = 152;
const CHART_H = 50;

const PATH_DATA =
  'M1 45.5C1 45.5 11.757 37.139 22 37.139C39.5 37.139 40.425 48.735 54.5 49C73.289 49.354 70.892 25.07 83.5 25.07C96.108 25.07 98.759 37.139 107.5 37.139C119.401 37.139 119.269 0.718 141 4C148.516 5.661 150 8.282 150 8.282';

type Props = {
  readings?: EnvironmentReading[];
};

/**
 * The environment line chart — animates the path stroke on mount.
 */
export function EnvironmentChart({ readings = environmentReadings }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(280, withTiming(1, { duration: durations.slower, easing: easings.emphasized }));
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const total = 320;
    return {
      strokeDasharray: total,
      strokeDashoffset: total * (1 - progress.value),
    };
  });

  return (
    <View style={styles.wrap}>
      <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
        <Defs>
          <LinearGradient id="env-stroke" x1={149.5} y1={13} x2={128.62} y2={75.88} gradientUnits="userSpaceOnUse">
            <Stop stopColor={palette.brand[500]} />
            <Stop offset={0.534} stopColor={palette.ink[100]} />
          </LinearGradient>
        </Defs>
        <AnimatedPath
          animatedProps={animatedProps}
          d={PATH_DATA}
          stroke="url(#env-stroke)"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {readings.map((reading, index) => (
        <View
          key={index}
          style={[
            styles.tick,
            {
              left: reading.x * CHART_W - 12,
              bottom: reading.emphasis ? CHART_H - 18 : CHART_H - 38,
            },
          ]}>
          <View style={styles.tickStem} />
          <Text
            variant={reading.emphasis ? 'metric' : 'metricSm'}
            color={reading.emphasis ? palette.ink[900] : palette.ink[300]}>
            {reading.value}
          </Text>
        </View>
      ))}

      <View style={styles.endpoint}>
        <DotMarker size={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: CHART_W,
    height: CHART_H + 14,
    alignSelf: 'center',
    position: 'relative',
  },
  tick: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  tickStem: {
    width: 1,
    height: 14,
    backgroundColor: palette.ink[200],
  },
  endpoint: {
    position: 'absolute',
    right: -2,
    top: -2,
  },
});

import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { palette, radii, shadows } from '@/theme';

import { ratioTrackGradient, toneColor, type Tone } from '../tones';

type Props = {
  /** 0–1 position of the knob along the red→green track. */
  position: number;
  tone: Tone;
  /** Stagger index for the entrance animation. */
  index?: number;
};

const TRACK_HEIGHT = 6;
const KNOB = 14;

/**
 * Red-to-green guidance track with a knob marking where a metric falls.
 * Mirrors the reference report's ratio gauge, softened to read as coaching.
 */
export function ScoreBar({ position, tone, index = 0 }: Props) {
  const clamped = Math.max(0.04, Math.min(0.96, position));
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(index * 60, withSpring(1, { damping: 16, stiffness: 160 }));
  }, [index, progress]);

  const knobStyle = useAnimatedStyle(() => ({
    left: `${clamped * 100 * progress.value}%`,
    opacity: progress.value,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <LinearGradient
          colors={[...ratioTrackGradient.colors]}
          locations={[...ratioTrackGradient.locations]}
          start={ratioTrackGradient.start}
          end={ratioTrackGradient.end}
          style={styles.fill}
        />
      </View>
      <Animated.View style={[styles.knob, knobStyle, { borderColor: toneColor[tone] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    justifyContent: 'center',
    height: KNOB,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
  knob: {
    position: 'absolute',
    width: KNOB,
    height: KNOB,
    marginLeft: -KNOB / 2,
    borderRadius: radii.pill,
    borderWidth: 3,
    backgroundColor: palette.white,
    ...shadows.soft,
  },
});

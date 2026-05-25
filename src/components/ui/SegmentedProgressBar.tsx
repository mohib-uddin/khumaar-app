import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { palette } from '@/theme';

export type ProgressSegment = {
  /** Relative flex weight — mirrors Figma segment widths. */
  flex: number;
  filled: boolean;
};

type Props = {
  segments: ProgressSegment[];
  color: string;
  /** Stagger index for entrance animation. */
  index?: number;
};

const SEGMENT_HEIGHT = 6;
const SEGMENT_GAP = 2;

/**
 * Variable-width segmented progress bar from the Skin Analysis screen.
 * Filled segments spring in sequentially on mount.
 */
export function SegmentedProgressBar({ segments, color, index = 0 }: Props) {
  return (
    <View style={styles.row}>
      {segments.map((segment, i) => (
        <ProgressSegmentView
          key={i}
          segment={segment}
          color={color}
          delay={index * 60 + i * 40}
        />
      ))}
    </View>
  );
}

type SegmentProps = {
  segment: ProgressSegment;
  color: string;
  delay: number;
};

function ProgressSegmentView({ segment, color, delay }: SegmentProps) {
  const progress = useSharedValue(segment.filled ? 0 : 1);

  useEffect(() => {
    if (segment.filled) {
      progress.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 200 }));
    }
  }, [delay, progress, segment.filled]);

  const fillStyle = useAnimatedStyle(() => ({
    opacity: segment.filled ? progress.value : 0,
  }));

  return (
    <View
      style={[
        styles.segment,
        { flex: segment.flex, backgroundColor: palette.track.muted },
      ]}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SEGMENT_GAP,
    width: '100%',
  },
  segment: {
    height: SEGMENT_HEIGHT,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
});

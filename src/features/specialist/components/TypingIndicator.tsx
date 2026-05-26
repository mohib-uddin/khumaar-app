import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { palette, radii, spacing } from '@/theme';

const agentOrb = require('../../../../assets/figma/tab-bar/agent-orb.png');

function Dot({ delay }: { delay: number }) {
  const o = useSharedValue(0.35);
  useEffect(() => {
    o.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(0.35, { duration: 300, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.dot, style]} />;
}

export function TypingIndicator() {
  return (
    <View style={styles.row}>
      <Image source={agentOrb} style={styles.avatar} contentFit="contain" />
      <View style={styles.bubble}>
        <Dot delay={0} />
        <Dot delay={120} />
        <Dot delay={240} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingRight: spacing['5xl'],
  },
  avatar: {
    width: 36,
    height: 36,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: palette.white,
    borderRadius: radii['2xl'],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    ...{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.brand[500],
  },
});

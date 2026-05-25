import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { brandGradient, palette, shadows, springs } from '@/theme';
import { tabBarDock } from '@/theme/tabBar';

const agentOrb = require('../../../assets/figma/tab-bar/agent-orb.png');

const SIZE = tabBarDock.agentSize;
const GLOW_OUTER = SIZE * 1.42;
const GLOW_INNER = SIZE * 1.18;

const IDLE_FLOAT_MS = 2800;
const IDLE_BREATHE_MS = 2400;
const IDLE_GLOW_MS = 2000;

type Props = {
  onPress: () => void;
};

/**
 * AI agent orb — idle float, breathe, brand glow pulse, and tactile tap.
 * All motion runs on the UI thread via transform/opacity only.
 */
export function AgentOrb({ onPress }: Props) {
  const reducedMotion = useReducedMotion();

  const float = useSharedValue(0);
  const breathe = useSharedValue(0);
  const glow = useSharedValue(0);
  const press = useSharedValue(0);
  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = withSpring(1, springs.bounce);

    if (reducedMotion) {
      float.value = 0;
      breathe.value = 0;
      glow.value = 0.5;
      return () => {
        cancelAnimation(enter);
      };
    }

    float.value = withRepeat(
      withTiming(1, { duration: IDLE_FLOAT_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    breathe.value = withRepeat(
      withTiming(1, { duration: IDLE_BREATHE_MS, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: IDLE_GLOW_MS, easing: Easing.out(Easing.cubic) }),
        withTiming(0.3, { duration: IDLE_GLOW_MS, easing: Easing.in(Easing.cubic) }),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(float);
      cancelAnimation(breathe);
      cancelAnimation(glow);
      cancelAnimation(enter);
      cancelAnimation(press);
    };
  }, [reducedMotion, breathe, enter, float, glow, press]);

  const outerGlowStyle = useAnimatedStyle(() => {
    const breatheScale = interpolate(breathe.value, [0, 1], [0.9, 1.06]);
    const glowScale = interpolate(glow.value, [0, 1], [0.95, 1.1]);
    const opacity = interpolate(glow.value, [0, 1], [0.22, 0.5]) * enter.value;
    return {
      transform: [{ scale: breatheScale * glowScale }],
      opacity,
    };
  });

  const innerGlowStyle = useAnimatedStyle(() => {
    const scale = interpolate(glow.value, [0, 1], [0.88, 1.04]);
    const opacity = interpolate(glow.value, [0, 1], [0.45, 0.85]) * enter.value;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const orbStyle = useAnimatedStyle(() => {
    const floatY = interpolate(float.value, [0, 1], [2, -5]);
    const breatheScale = interpolate(breathe.value, [0, 1], [1, 1.04]);
    const pressScale = interpolate(press.value, [0, 1], [1, 0.88]);
    const pressRotate = interpolate(press.value, [0, 1], [0, -4]);
    const enterScale = interpolate(enter.value, [0, 1], [0.55, 1]);
    return {
      transform: [
        { translateY: floatY },
        { scale: breatheScale * pressScale * enterScale },
        { rotate: `${pressRotate}deg` },
      ],
      opacity: enter.value,
    };
  });

  const tap = Gesture.Tap()
    .onBegin(() => {
      press.value = withSpring(1, springs.press);
    })
    .onFinalize(() => {
      press.value = withSpring(0, springs.bounce);
    })
    .onEnd(() => {
      runOnJS(onPress)();
    });

  return (
    <View
      style={styles.root}
      accessibilityRole="button"
      accessibilityLabel="AI assistant">
      <Animated.View pointerEvents="none" style={[styles.glowOuter, outerGlowStyle]}>
        <LinearGradient
          colors={['rgba(192, 255, 0, 0.55)', 'rgba(226, 245, 163, 0.2)', 'rgba(255, 255, 255, 0)']}
          locations={[0, 0.45, 1]}
          start={brandGradient.start}
          end={brandGradient.end}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.glowInner, innerGlowStyle]}>
        <LinearGradient
          colors={[palette.brand[300], palette.brand[100], 'rgba(255, 255, 255, 0)']}
          locations={[0, 0.35, 1]}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.85, y: 0.95 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.orb, orbStyle, shadows.avatar]}>
          <Image
            source={agentOrb}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowOuter: {
    position: 'absolute',
    width: GLOW_OUTER,
    height: GLOW_OUTER,
    borderRadius: GLOW_OUTER / 2,
    overflow: 'hidden',
  },
  glowInner: {
    position: 'absolute',
    width: GLOW_INNER,
    height: GLOW_INNER,
    borderRadius: GLOW_INNER / 2,
    overflow: 'hidden',
  },
  orb: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
});

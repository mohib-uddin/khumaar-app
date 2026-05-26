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

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

const agentOrb = require('../../../../assets/figma/tab-bar/agent-orb.png');

export function SpecialistOrbHero() {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [float]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value * -6 }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.orbWrap, orbStyle]}>
        <Image source={agentOrb} style={styles.orb} contentFit="contain" />
      </Animated.View>
      <Text variant="displaySm" color="textPrimary" style={styles.title}>
        Your{' '}
        <Text variant="emphasizedItalic" color="textPrimary">
          Khumaar Specialist
        </Text>
        {' '}is here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing['4xl'],
    paddingHorizontal: spacing.xl,
  },
  orbWrap: {
    marginBottom: spacing.lg,
  },
  orb: {
    width: 120,
    height: 120,
  },
  title: {
    textAlign: 'center',
  },
});

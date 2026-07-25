import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Screen, Text } from '@/components/ui';
import { OnboardingShell } from '@/features/onboarding';
import { layout, palette, radii, spacing } from '@/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      <OnboardingShell
        title="Khumaar"
        subtitle="Daily skin rituals, coached from your photo — not a medical diagnosis."
        footer={
          <Button label="Get started" onPress={() => router.push('/onboarding/auth')} />
        }>
        <Animated.View entering={FadeInDown.duration(420).springify().damping(16)} style={styles.hero}>
          <View style={styles.mark}>
            <Text variant="displayLg" color={palette.ink[900]}>
              K
            </Text>
          </View>
          <Text variant="body" color="textSecondary" style={styles.line}>
            One focus. One ritual. Built to stick.
          </Text>
        </Animated.View>
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing['4xl'],
    paddingHorizontal: layout.screenPaddingX,
  },
  mark: {
    width: 96,
    height: 96,
    borderRadius: radii['3xl'],
    backgroundColor: palette.brand[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    textAlign: 'center',
    maxWidth: 260,
  },
});

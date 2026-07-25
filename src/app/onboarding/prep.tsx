import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Screen, Text } from '@/components/ui';
import { OnboardingProgress, OnboardingShell, updateOnboardingStep, useAuth } from '@/features/onboarding';
import { spacing } from '@/theme';

const TIPS = [
  { title: 'Face the light', body: 'Stand facing a window or soft lamp — avoid harsh backlight.' },
  { title: 'Clear face', body: 'Remove glasses and pull hair away from your forehead and cheeks.' },
  { title: 'Hold steady', body: 'We’ll guide front, left, and right — take your time on each pose.' },
];

export default function PrepScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const start = async () => {
    if (user) {
      await updateOnboardingStep(user.id, 'scan');
      await refreshProfile();
    }
    router.push('/onboarding/scan');
  };

  return (
    <Screen>
      <OnboardingShell
        title="Ready to scan"
        subtitle="Three quick photos. Cosmetic coaching only — not a diagnosis."
        progress={<OnboardingProgress step={5} total={7} label="Scan" />}
        footer={<Button label="Start scan" onPress={() => void start()} />}>
        <View style={styles.list}>
          {TIPS.map((tip) => (
            <Card key={tip.title} style={styles.card}>
              <Text variant="sectionTitle" color="textPrimary">
                {tip.title}
              </Text>
              <Text variant="body" color="textSecondary" style={styles.body}>
                {tip.body}
              </Text>
            </Card>
          ))}
        </View>
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.lg,
  },
  card: {
    padding: spacing['4xl'],
    gap: spacing.sm,
  },
  body: {
    marginTop: spacing.xs,
  },
});

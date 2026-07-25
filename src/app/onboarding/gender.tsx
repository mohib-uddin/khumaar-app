import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import {
  GENDER_OPTIONS,
  OnboardingProgress,
  OnboardingShell,
  SelectableCard,
  saveGender,
  useAuth,
} from '@/features/onboarding';
import type { GenderPresentation } from '@/lib/database.types';
import { palette } from '@/theme';

export default function GenderScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [gender, setGender] = useState<GenderPresentation | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const continueNext = async () => {
    if (!user || !gender) return;
    setBusy(true);
    setError(null);
    try {
      await saveGender(user.id, gender, { advanceStep: true });
      await refreshProfile();
      router.replace('/onboarding/concerns');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <OnboardingShell
        title="How do you present?"
        subtitle="Helps your color edit match your wardrobe."
        progress={<OnboardingProgress step={2} total={7} label="About you" />}
        footer={
          <>
            <Button
              label={busy ? 'Saving…' : 'Continue'}
              onPress={() => {
                if (gender) void continueNext();
              }}
            />
            {error ? (
              <Text variant="caption" color={palette.accent.warning} style={styles.hint}>
                {error}
              </Text>
            ) : null}
          </>
        }>
        {GENDER_OPTIONS.map((option) => (
          <SelectableCard
            key={option.id}
            label={option.label}
            helper={option.helper}
            selected={gender === option.id}
            onPress={() => setGender(option.id)}
          />
        ))}
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: {
    textAlign: 'center',
  },
});

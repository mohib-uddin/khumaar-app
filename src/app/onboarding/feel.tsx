import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import {
  OnboardingProgress,
  OnboardingShell,
  SKIN_FEEL_OPTIONS,
  SelectableCard,
  saveSkinFeel,
  useAuth,
} from '@/features/onboarding';
import type { SkinFeel } from '@/lib/database.types';
import { palette } from '@/theme';

export default function FeelScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [feel, setFeel] = useState<SkinFeel | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const continueNext = async () => {
    if (!user || !feel) return;
    setBusy(true);
    setError(null);
    try {
      await saveSkinFeel(user.id, feel);
      await refreshProfile();
      router.replace('/onboarding/prep');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <OnboardingShell
        title="How does your skin feel?"
        subtitle="One tap — helps tailor your starter ritual."
        progress={<OnboardingProgress step={4} total={7} label="About you" />}
        footer={
          <>
            <Button
              label={busy ? 'Saving…' : 'Continue'}
              onPress={() => {
                if (feel) void continueNext();
              }}
            />
            {error ? (
              <Text variant="caption" color={palette.accent.warning} style={styles.hint}>
                {error}
              </Text>
            ) : null}
          </>
        }>
        {SKIN_FEEL_OPTIONS.map((option) => (
          <SelectableCard
            key={option.id}
            label={option.label}
            helper={option.helper}
            selected={feel === option.id}
            onPress={() => setFeel(option.id)}
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

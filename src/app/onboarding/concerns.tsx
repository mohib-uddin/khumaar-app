import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import {
  CONCERN_OPTIONS,
  ConcernChip,
  MAX_CONCERNS,
  OnboardingProgress,
  OnboardingShell,
  saveConcerns,
  useAuth,
} from '@/features/onboarding';
import { palette, spacing } from '@/theme';

export default function ConcernsScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_CONCERNS) return prev;
      return [...prev, id];
    });
  };

  const continueNext = async () => {
    if (!user || selected.length === 0) return;
    setBusy(true);
    setError(null);
    try {
      await saveConcerns(user.id, selected);
      await refreshProfile();
      router.replace('/onboarding/feel');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save concerns');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <OnboardingShell
        title="What should we focus on?"
        subtitle={`Pick up to ${MAX_CONCERNS}. We’ll coach one primary focus after your scan.`}
        progress={<OnboardingProgress step={3} total={7} label="About you" />}
        footer={
          <>
            <Button
              label={busy ? 'Saving…' : 'Continue'}
              onPress={() => {
                if (selected.length > 0) void continueNext();
              }}
            />
            {error ? (
              <Text variant="caption" color={palette.accent.warning} style={styles.hint}>
                {error}
              </Text>
            ) : null}
          </>
        }>
        <View style={styles.chips}>
          {CONCERN_OPTIONS.map((option) => {
            const isOn = selected.includes(option.id);
            const atCap = selected.length >= MAX_CONCERNS && !isOn;
            return (
              <ConcernChip
                key={option.id}
                label={option.label}
                selected={isOn}
                disabled={atCap}
                onPress={() => toggle(option.id)}
              />
            );
          })}
        </View>
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  hint: {
    textAlign: 'center',
  },
});

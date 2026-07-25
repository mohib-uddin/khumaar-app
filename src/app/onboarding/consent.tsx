import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Button, PressableScale, Screen, Text } from '@/components/ui';
import {
  OnboardingProgress,
  OnboardingShell,
  WELLNESS_DISCLAIMER,
  saveConsents,
  useAuth,
} from '@/features/onboarding';
import { palette, radii, spacing } from '@/theme';

type Checks = {
  terms: boolean;
  privacy: boolean;
  wellness: boolean;
  photoAi: boolean;
};

function CheckRow({
  label,
  checked,
  onToggle,
  linkLabel,
  onLink,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  linkLabel?: string;
  onLink?: () => void;
}) {
  return (
    <PressableScale onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View style={styles.row}>
        <View style={[styles.box, checked && styles.boxOn]}>
          {checked ? (
            <Text variant="captionMedium" color={palette.ink[900]}>
              ✓
            </Text>
          ) : null}
        </View>
        <View style={styles.rowText}>
          <Text variant="body" color="textPrimary">
            {label}{' '}
            {linkLabel && onLink ? (
              <Text
                variant="body"
                color={palette.brand[700]}
                onPress={(e) => {
                  e.stopPropagation?.();
                  onLink();
                }}>
                {linkLabel}
              </Text>
            ) : null}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
}

export default function ConsentScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checks, setChecks] = useState<Checks>({
    terms: false,
    privacy: false,
    wellness: false,
    photoAi: false,
  });

  const allChecked = checks.terms && checks.privacy && checks.wellness && checks.photoAi;

  const toggle = (key: keyof Checks) =>
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const continueNext = async () => {
    if (!user || !allChecked) return;
    setBusy(true);
    setError(null);
    try {
      await saveConsents(user.id);
      await refreshProfile();
      router.replace('/onboarding/concerns');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save consent');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <OnboardingShell
        title="Before we scan"
        subtitle="Required for App Store–safe wellness coaching."
        progress={<OnboardingProgress step={1} total={6} label="Consent" />}
        footer={
          <>
            <Button
              label={busy ? 'Saving…' : 'Agree and continue'}
              onPress={() => {
                if (allChecked) void continueNext();
              }}
            />
            {!allChecked ? (
              <Text variant="caption" color="textSecondary" style={styles.hint}>
                Check all boxes to continue
              </Text>
            ) : null}
            {error ? (
              <Text variant="caption" color={palette.accent.warning} style={styles.hint}>
                {error}
              </Text>
            ) : null}
          </>
        }>
        <View style={styles.list}>
          <CheckRow
            label="I agree to the"
            linkLabel="Terms of Use"
            onLink={() => void Linking.openURL('https://khumaar.app/terms')}
            checked={checks.terms}
            onToggle={() => toggle('terms')}
          />
          <CheckRow
            label="I agree to the"
            linkLabel="Privacy Policy"
            onLink={() => void Linking.openURL('https://khumaar.app/privacy')}
            checked={checks.privacy}
            onToggle={() => toggle('privacy')}
          />
          <CheckRow
            label={WELLNESS_DISCLAIMER}
            checked={checks.wellness}
            onToggle={() => toggle('wellness')}
          />
          <CheckRow
            label="I consent to processing my face photos for cosmetic skin coaching AI."
            checked={checks.photoAi}
            onToggle={() => toggle('photoAi')}
          />
        </View>
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: palette.ink[200],
    backgroundColor: palette.surface.raised,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxOn: {
    backgroundColor: palette.brand[300],
    borderColor: palette.brand[500],
  },
  rowText: {
    flex: 1,
  },
  hint: {
    textAlign: 'center',
  },
});

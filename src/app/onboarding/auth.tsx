import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { Button, Screen, Text } from '@/components/ui';
import {
  OnboardingProgress,
  OnboardingShell,
  signInDevAnonymous,
  signInWithApple,
  signInWithGoogle,
  useAuth,
} from '@/features/onboarding';
import { updateOnboardingStep } from '@/features/onboarding/api';
import { palette, spacing } from '@/theme';

export default function AuthScreen() {
  const router = useRouter();
  const { configured, refreshProfile, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'apple' | 'google' | 'dev' | null>(null);

  const afterSignIn = async (userId: string) => {
    await updateOnboardingStep(userId, 'consent');
    await refreshProfile();
    router.replace('/onboarding/consent');
  };

  const run = async (kind: 'apple' | 'google' | 'dev', action: () => Promise<unknown>) => {
    setError(null);
    setBusy(kind);
    try {
      if (!configured) {
        setError('Backend is not configured. Add Supabase keys to your .env file.');
        return;
      }
      await action();
      const id = user?.id;
      // Session may update async via onAuthStateChange — read from getSession path via refresh
      const { getSupabase } = await import('@/lib/supabase');
      const supabase = getSupabase();
      const session = (await supabase?.auth.getSession())?.data.session;
      const userId = session?.user?.id ?? id;
      if (!userId) throw new Error('Signed in but no user id');
      await afterSignIn(userId);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Sign-in failed';
      if (!message.toLowerCase().includes('cancel')) {
        setError(message);
      }
    } finally {
      setBusy(null);
    }
  };

  return (
    <Screen>
      <OnboardingShell
        title="Sign in"
        subtitle="Save your scan and ritual. Apple is recommended on iPhone."
        progress={<OnboardingProgress step={0} total={7} label="Account" />}
        footer={
          <View style={styles.footer}>
            {Platform.OS === 'ios' ? (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={999}
                style={styles.apple}
                onPress={() => void run('apple', () => signInWithApple())}
              />
            ) : (
              <Button
                label={busy === 'apple' ? 'Signing in…' : 'Continue with Apple'}
                onPress={() => void run('apple', () => signInWithApple())}
              />
            )}
            <Button
              label={busy === 'google' ? 'Signing in…' : 'Continue with Google'}
              variant="secondary"
              onPress={() => void run('google', () => signInWithGoogle())}
            />
            {__DEV__ ? (
              <Button
                label={busy === 'dev' ? 'Continuing…' : 'Dev continue (anonymous)'}
                variant="secondary"
                onPress={() => void run('dev', () => signInDevAnonymous())}
              />
            ) : null}
            {busy ? <ActivityIndicator color={palette.brand[700]} /> : null}
            {error ? (
              <Text variant="caption" color={palette.accent.warning} style={styles.error}>
                {error}
              </Text>
            ) : null}
            {!configured ? (
              <Text variant="caption" color="textSecondary" style={styles.error}>
                Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable auth.
              </Text>
            ) : null}
          </View>
        }>
        <Text variant="body" color="textSecondary">
          By continuing you agree we may process face photos for cosmetic coaching after you consent
          on the next screen.
        </Text>
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: spacing.lg,
  },
  apple: {
    width: '100%',
    height: 52,
  },
  error: {
    textAlign: 'center',
  },
});

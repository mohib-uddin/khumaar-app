import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, PressableScale, Screen, Text } from '@/components/ui';
import {
  OnboardingProgress,
  OnboardingShell,
  WELLNESS_DISCLAIMER,
  completeOnboarding,
  fetchLatestAnalysis,
  useAuth,
} from '@/features/onboarding';
import type { ScanAnalysisRow } from '@/lib/database.types';
import { toneColor, toneSoft } from '@/features/skin-profile/tones';
import { palette, radii, spacing } from '@/theme';

export default function ResultsScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [analysis, setAnalysis] = useState<ScanAnalysisRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchLatestAnalysis(user.id)
      .then(setAnalysis)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load results'));
  }, [user]);

  const startRitual = async () => {
    if (!user || !analysis) return;
    setBusy(true);
    try {
      await completeOnboarding(user.id, analysis.ritual_id);
      await refreshProfile();
      router.replace('/(tabs)/rituals');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not finish onboarding');
      setBusy(false);
    }
  };

  const continueApp = async () => {
    if (!user || !analysis) return;
    setBusy(true);
    try {
      await completeOnboarding(user.id, analysis.ritual_id);
      await refreshProfile();
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not finish onboarding');
      setBusy(false);
    }
  };

  const metrics = (analysis?.metrics ?? []).slice(0, 4);

  return (
    <Screen>
      <OnboardingShell
        title="Your coaching score"
        subtitle={analysis?.headline ?? 'Loading your coaching estimate…'}
        progress={<OnboardingProgress step={6} total={7} label="Results" />}
        footer={
          analysis ? (
            <>
              <Button
                label={busy ? 'Opening…' : 'Start my ritual'}
                onPress={() => void startRitual()}
              />
              <PressableScale onPress={() => void continueApp()} accessibilityRole="button">
                <Text variant="bodyEmphasis" color="textSecondary" style={styles.secondary}>
                  Continue to app
                </Text>
              </PressableScale>
            </>
          ) : null
        }>
        {analysis ? (
          <View style={styles.content}>
            <Text variant="displayLg" color="textPrimary" style={styles.score}>
              {analysis.overall_score}
              <Text variant="sectionTitle" color="textSecondary">
                {' '}
                / 100
              </Text>
            </Text>

            <View style={styles.metrics}>
              {metrics.map((metric) => (
                <View
                  key={metric.id}
                  style={[styles.metricPill, { backgroundColor: toneSoft[metric.tone] }]}>
                  <Text variant="captionMedium" color={toneColor[metric.tone]}>
                    {metric.label}
                  </Text>
                  <Text variant="body" color="textPrimary">
                    {metric.value}
                  </Text>
                </View>
              ))}
            </View>

            <Card style={styles.focusCard}>
              <Text variant="overline" color="textSecondary">
                This week’s focus
              </Text>
              <Text variant="emphasizedItalic" color="textPrimary" style={styles.focusTitle}>
                {analysis.top_focus}
              </Text>
              <Text variant="body" color="textSecondary">
                Your starter ritual is built around this — products stay inside the steps when you
                need them.
              </Text>
            </Card>

            <Text variant="caption" color="textTertiary" style={styles.disclaimer}>
              {analysis.disclaimer || WELLNESS_DISCLAIMER}
            </Text>
          </View>
        ) : (
          <Text variant="body" color="textSecondary">
            {error ?? 'Loading…'}
          </Text>
        )}
      </OnboardingShell>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxxl,
  },
  score: {
    marginTop: -spacing.lg,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricPill: {
    borderRadius: radii.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxs,
    minWidth: '45%',
    flexGrow: 1,
  },
  focusCard: {
    padding: spacing['4xl'],
    gap: spacing.md,
  },
  focusTitle: {
    textTransform: 'capitalize',
  },
  disclaimer: {
    textAlign: 'center',
  },
  secondary: {
    textAlign: 'center',
  },
});

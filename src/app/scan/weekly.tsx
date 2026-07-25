import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import {
  invokeOnboardingAnalyze,
  type ScanPose,
  uploadScanPose,
  useAuth,
} from '@/features/onboarding';
import { GuidedScanner } from '@/features/onboarding/components/GuidedScanner';
import { palette, spacing } from '@/theme';

function createBatchId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function WeeklyScanScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'scan' | 'upload' | 'analyze'>('scan');

  const onComplete = async (captures: Record<ScanPose, string>) => {
    if (!user) {
      setError('You need to be signed in to upload scans.');
      return;
    }
    setPhase('upload');
    setError(null);
    const batchId = createBatchId();
    try {
      for (const pose of ['front', 'left', 'right'] as ScanPose[]) {
        await uploadScanPose({
          userId: user.id,
          batchId,
          pose,
          localUri: captures[pose],
        });
      }
      setPhase('analyze');
      await invokeOnboardingAnalyze(batchId);
      await refreshProfile();
      router.replace('/analyze');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed');
      setPhase('scan');
    }
  };

  if (phase !== 'scan') {
    return (
      <Screen edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.center}>
          <ActivityIndicator color={palette.brand[500]} />
          <Text variant="sectionTitle" color="textPrimary">
            {phase === 'upload' ? 'Uploading securely…' : 'Analyzing your scan…'}
          </Text>
          <Text variant="body" color="textSecondary">
            Your photos stay private to your account.
          </Text>
          {error ? (
            <Text variant="caption" color={palette.accent.warning}>
              {error}
            </Text>
          ) : null}
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <GuidedScanner onComplete={(c) => void onComplete(c)} />
      {error ? (
        <Text variant="caption" color={palette.accent.warning} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing['4xl'],
  },
  error: {
    textAlign: 'center',
    padding: spacing.xxl,
  },
});

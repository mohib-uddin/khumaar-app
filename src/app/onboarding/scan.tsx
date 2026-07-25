import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import {
  type ScanPose,
  updateOnboardingStep,
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

export default function ScanScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onComplete = async (captures: Record<ScanPose, string>) => {
    if (!user) {
      setError('You need to be signed in to upload scans.');
      return;
    }
    setUploading(true);
    setError(null);
    const batchId = createBatchId();
    try {
      await updateOnboardingStep(user.id, 'analyzing');
      for (const pose of ['front', 'left', 'right'] as ScanPose[]) {
        await uploadScanPose({
          userId: user.id,
          batchId,
          pose,
          localUri: captures[pose],
        });
      }
      await refreshProfile();
      router.replace({
        pathname: '/onboarding/analyzing',
        params: { batchId },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      {uploading ? (
        <View style={styles.uploading}>
          <Text variant="sectionTitle" color="textPrimary">
            Uploading securely…
          </Text>
          <Text variant="body" color="textSecondary">
            Your photos are private to your account.
          </Text>
        </View>
      ) : (
        <GuidedScanner onComplete={(c) => void onComplete(c)} />
      )}
      {error ? (
        <Text variant="caption" color={palette.accent.warning} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  uploading: {
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

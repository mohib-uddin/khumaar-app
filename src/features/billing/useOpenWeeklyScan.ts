import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { openProPaywall } from './openProPaywall';
import { useFeatureAccess } from './useFeatureAccess';

/** Navigate to weekly scan, or Pro paywall when the free scan is already used. */
export function useOpenWeeklyScan() {
  const router = useRouter();
  const { canWeeklyScan, ready } = useFeatureAccess();

  return useCallback(() => {
    if (!ready) {
      router.push('/scan/weekly');
      return;
    }
    if (!canWeeklyScan) {
      openProPaywall('scan');
      return;
    }
    router.push('/scan/weekly');
  }, [canWeeklyScan, ready, router]);
}

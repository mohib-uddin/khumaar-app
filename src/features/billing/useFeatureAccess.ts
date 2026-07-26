import { useLatestAnalysis } from '@/features/dashboard/hooks/useLatestAnalysis';

import { FREE_SPECIALIST_MESSAGES_PER_DAY } from './planCatalog';
import { usePurchases } from './PurchasesProvider';

export function useFeatureAccess() {
  const { isPro, ready } = usePurchases();
  const { analysis, loading: analysisLoading } = useLatestAnalysis();

  const hasCompletedFirstScan = Boolean(analysis);
  /** Free users get the onboarding/first scan; later weekly scans require Pro. */
  const canWeeklyScan = isPro || !hasCompletedFirstScan;
  const canColorEdit = isPro;
  const specialistDailyLimit = isPro ? Number.POSITIVE_INFINITY : FREE_SPECIALIST_MESSAGES_PER_DAY;

  return {
    ready: ready && !analysisLoading,
    isPro,
    hasCompletedFirstScan,
    canWeeklyScan,
    canColorEdit,
    specialistDailyLimit,
  };
}

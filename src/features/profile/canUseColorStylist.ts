import { useFeatureAccess } from '@/features/billing';

/** Color Edit requires Khumaar Pro. */
export function useCanUseColorStylist(): boolean {
  const { canColorEdit } = useFeatureAccess();
  return canColorEdit;
}

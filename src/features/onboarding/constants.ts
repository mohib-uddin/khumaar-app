import type { GenderPresentation, OnboardingStep, SkinFeel } from '@/lib/database.types';

export const CONCERN_OPTIONS = [
  { id: 'acne', label: 'Acne' },
  { id: 'hydration', label: 'Hydration' },
  { id: 'texture', label: 'Texture' },
  { id: 'dark-spots', label: 'Dark spots' },
  { id: 'redness', label: 'Redness' },
  { id: 'pores', label: 'Pores' },
  { id: 'under-eye', label: 'Under-eye' },
  { id: 'oiliness', label: 'Oiliness' },
] as const;

export type ConcernId = (typeof CONCERN_OPTIONS)[number]['id'];

export const GENDER_OPTIONS: {
  id: GenderPresentation;
  label: string;
  helper: string;
}[] = [
  { id: 'woman', label: 'Woman', helper: 'Feminine wardrobe guidance' },
  { id: 'man', label: 'Man', helper: 'Masculine wardrobe guidance' },
  { id: 'nonbinary', label: 'Nonbinary', helper: 'Gender-fluid wardrobe guidance' },
  {
    id: 'prefer_not_to_say',
    label: 'Prefer not to say',
    helper: 'Neutral wardrobe guidance',
  },
];

export const SKIN_FEEL_OPTIONS: { id: SkinFeel; label: string; helper: string }[] = [
  { id: 'dry', label: 'Dry', helper: 'Tight or flaky after cleansing' },
  { id: 'oily', label: 'Oily', helper: 'Shine through the day' },
  { id: 'combo', label: 'Combination', helper: 'Oily T-zone, drier cheeks' },
  { id: 'sensitive', label: 'Sensitive', helper: 'Easily reactive or irritated' },
];

export const SCAN_POSES = ['front', 'left', 'right'] as const;
export type ScanPose = (typeof SCAN_POSES)[number];

export const SCAN_POSE_COPY: Record<
  ScanPose,
  { title: string; hint: string; guide: string }
> = {
  front: {
    title: 'Front',
    hint: 'Fit your face in the oval',
    guide: 'Look straight ahead · fill the oval',
  },
  left: {
    title: 'Left',
    hint: 'Keep your face in the oval · show your left cheek',
    guide: 'Turn your head so your left cheek faces the camera',
  },
  right: {
    title: 'Right',
    hint: 'Keep your face in the oval · show your right cheek',
    guide: 'Turn your head so your right cheek faces the camera',
  },
};

export const WELLNESS_DISCLAIMER =
  'Cosmetic skin coaching estimate — not a medical diagnosis. Consult a clinician for medical concerns.';

/** Maps onboarding_step → route inside /onboarding */
export function routeForStep(step: OnboardingStep): string {
  switch (step) {
    case 'welcome':
      return '/onboarding';
    case 'auth':
      return '/onboarding/auth';
    case 'consent':
      return '/onboarding/consent';
    case 'gender':
      return '/onboarding/gender';
    case 'concerns':
      return '/onboarding/concerns';
    case 'feel':
      return '/onboarding/feel';
    case 'prep':
      return '/onboarding/prep';
    case 'scan':
      return '/onboarding/scan';
    case 'analyzing':
      return '/onboarding/analyzing';
    case 'results':
      return '/onboarding/results';
    case 'done':
      return '/(tabs)';
    default:
      return '/onboarding';
  }
}

export const MAX_CONCERNS = 3;

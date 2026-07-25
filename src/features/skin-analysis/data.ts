import type { ProgressSegment } from '@/components/ui/SegmentedProgressBar';

export type AnalysisTab = 'overview' | 'symptoms' | 'ratios' | 'treatments' | 'special';

export type SymptomMetric = {
  id: string;
  label: string;
  severityLabel: string;
  severityColor: string;
  segments: ProgressSegment[];
};

/** Live tabs only — Face / Treatments / Special stay in type for deep links but are gated. */
export const analysisTabs = [
  { value: 'overview' as const, label: 'Overview' },
  { value: 'symptoms' as const, label: 'Symptoms' },
] as const;

export const comingSoonTabs: AnalysisTab[] = ['ratios', 'treatments', 'special'];

/** Figma node 0:142 — symptom rows with exact segment weight ratios. */
export const symptomMetrics: SymptomMetric[] = [
  {
    id: 'crusting',
    label: 'Crusting of skin bumps',
    severityLabel: 'Ease',
    severityColor: '#5471FF',
    segments: [
      { flex: 122, filled: true },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 69, filled: false },
    ],
  },
  {
    id: 'cysts',
    label: 'Cysts',
    severityLabel: 'Gentle',
    severityColor: '#1D956E',
    segments: [
      { flex: 65, filled: true },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 15, filled: false },
      { flex: 1, filled: false },
    ],
  },
  {
    id: 'papules',
    label: 'Papules',
    severityLabel: 'Strong',
    severityColor: '#FD6D2C',
    segments: [
      { flex: 142, filled: true },
      { flex: 8, filled: true },
      { flex: 17, filled: true },
      { flex: 17, filled: true },
      { flex: 17, filled: true },
      { flex: 17, filled: true },
      { flex: 8, filled: true },
      { flex: 1, filled: false },
    ],
  },
];

export const awarenessTags = [
  'Dust',
  'Dehydration',
  'Stress',
  'Hair Products',
  'Touching Face',
] as const;

export { FACE_SCAN, FIGMA_FRAME_WIDTH, FIGMA_HERO_HEIGHT } from './heroLayout';
export { HERO_LAYOUT } from './heroLayout';

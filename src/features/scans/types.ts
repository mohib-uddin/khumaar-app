import type { ImageSourcePropType } from 'react-native';

import type {
  FacialRatiosData,
  ScanSummary,
  SkinMetric,
} from '@/features/skin-profile';

export type ScanView = 'front' | 'side';

export type ScanRecord = {
  id: string;
  capturedAt: string;
  imageUri: string;
  imageSource?: ImageSourcePropType;
  view: ScanView;
  summary: ScanSummary;
  skinMetrics: SkinMetric[];
  facialRatios?: FacialRatiosData;
};

export type ScanComparison = {
  before: ScanRecord;
  after: ScanRecord;
};

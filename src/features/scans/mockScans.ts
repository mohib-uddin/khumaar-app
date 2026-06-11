import {
  facialRatios,
  scanSummary,
  skinMetrics,
  type FacialRatiosData,
  type SkinMetric,
} from '@/features/skin-profile';

import type { ScanRecord } from './types';

const FACE_SCAN = require('@/assets/figma/skin-analysis/face-scan.png');

function shiftMetric(metric: SkinMetric, shift: number, value: string): SkinMetric {
  return {
    ...metric,
    value,
    position: Math.max(0.08, Math.min(0.94, metric.position + shift)),
  };
}

function shiftRatios(shift: number): FacialRatiosData {
  return {
    ...facialRatios,
    score: {
      ...facialRatios.score,
      overall: facialRatios.score.overall + shift,
      front: facialRatios.score.front + shift,
      side: facialRatios.score.side + shift,
      combined: facialRatios.score.combined + shift,
    },
  };
}

const olderMetrics = skinMetrics.map((metric) => {
  switch (metric.id) {
    case 'clarity':
      return shiftMetric(metric, -0.22, 'Congested');
    case 'hydration':
      return shiftMetric(metric, -0.16, 'Very low');
    case 'texture':
      return shiftMetric(metric, -0.14, 'Uneven');
    case 'redness':
      return shiftMetric(metric, -0.18, 'Active');
    case 'pigmentation':
      return shiftMetric(metric, -0.12, 'Uneven');
    case 'dark-circles':
      return shiftMetric(metric, -0.08, 'Strong');
    default:
      return shiftMetric(metric, -0.1, metric.value);
  }
});

const previousMetrics = skinMetrics.map((metric) => {
  switch (metric.id) {
    case 'clarity':
      return shiftMetric(metric, -0.1, 'Improving');
    case 'hydration':
      return shiftMetric(metric, -0.08, 'Low');
    case 'texture':
      return shiftMetric(metric, -0.06, 'Slight');
    case 'redness':
      return shiftMetric(metric, -0.07, 'Mild');
    case 'pigmentation':
      return shiftMetric(metric, -0.05, 'Good');
    default:
      return shiftMetric(metric, -0.04, metric.value);
  }
});

export const mockScanRecords: ScanRecord[] = [
  {
    id: 'scan-2026-06-10',
    capturedAt: '2026-06-10T11:15:00.000Z',
    imageUri: 'asset://skin-analysis/face-scan.png',
    imageSource: FACE_SCAN,
    view: 'front',
    summary: scanSummary,
    skinMetrics,
    facialRatios,
  },
  {
    id: 'scan-2026-05-28',
    capturedAt: '2026-05-28T10:10:00.000Z',
    imageUri: 'asset://skin-analysis/face-scan.png',
    imageSource: FACE_SCAN,
    view: 'front',
    summary: {
      ...scanSummary,
      score: 79,
      capturedLabel: '2 weeks ago',
      deltaLabel: '+4.2%',
      statusLabel: 'On track',
      topImprovement: 'Redness cooling',
      topConcern: 'Hydration',
      headline: 'Redness is calming, but your barrier still needs consistent hydration.',
    },
    skinMetrics: previousMetrics,
    facialRatios: shiftRatios(-0.3),
  },
  {
    id: 'scan-2026-05-07',
    capturedAt: '2026-05-07T09:35:00.000Z',
    imageUri: 'asset://skin-analysis/face-scan.png',
    imageSource: FACE_SCAN,
    view: 'front',
    summary: {
      ...scanSummary,
      score: 68,
      capturedLabel: '1 month ago',
      deltaLabel: 'Baseline',
      statusLabel: 'Starting point',
      topImprovement: 'Baseline set',
      topConcern: 'Breakouts',
      headline: 'This scan set your baseline with visible congestion and low hydration.',
    },
    skinMetrics: olderMetrics,
    facialRatios: shiftRatios(-0.7),
  },
];

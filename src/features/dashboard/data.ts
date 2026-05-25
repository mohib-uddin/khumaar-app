/**
 * Static dashboard data. In a real app this would come from a query layer —
 * keeping it co-located keeps the composition demo self-contained.
 */
export type ActivityDay = {
  key: string;
  label: string;
  /** Bar height in points (max ≈ 75). */
  height: number;
  highlighted?: boolean;
  /** Optional avatar marker placed above the bar. */
  marker?: 'avatar' | 'indicator';
};

export const weeklyActivity: ActivityDay[] = [
  { key: 'sun', label: 'Sun', height: 36, marker: 'avatar' },
  { key: 'mon', label: 'Mon', height: 43 },
  { key: 'tue', label: 'Tue', height: 52 },
  { key: 'wed', label: 'Wed', height: 43 },
  { key: 'thu', label: 'Thu', height: 49 },
  { key: 'fri', label: 'Fri', height: 52 },
  { key: 'sat', label: 'Sat', height: 69, highlighted: true, marker: 'indicator' },
];

export type EnvironmentReading = {
  /** Fractional position 0–1 along the chart. */
  x: number;
  /** UV-ish value used as the label. */
  value: number;
  emphasis?: boolean;
};

export const environmentReadings: EnvironmentReading[] = [
  { x: 0.13, value: 2.9 },
  { x: 0.4, value: 2.1 },
  { x: 0.58, value: 6.5 },
  { x: 0.9, value: 9.2, emphasis: true },
];

export type TargetPoint = {
  key: string;
  label: string;
  status: 'done' | 'active' | 'pending';
};

export const targetPoints: TargetPoint[] = [
  { key: 'acne', label: 'Acne', status: 'done' },
  { key: 'oiliness', label: 'Oiliness', status: 'active' },
  { key: 'double-chin', label: 'Double Chin', status: 'pending' },
];

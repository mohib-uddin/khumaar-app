import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { mockScanRecords } from './mockScans';
import type { ScanComparison, ScanRecord } from './types';

const STORAGE_KEY = 'khumaar.scan-records.v1';

function sortScans(scans: ScanRecord[]) {
  return [...scans].sort(
    (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime(),
  );
}

export async function loadScanRecords(): Promise<ScanRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return sortScans(mockScanRecords);

    const parsed = JSON.parse(raw) as ScanRecord[];
    return sortScans(parsed.length > 0 ? parsed : mockScanRecords);
  } catch {
    return sortScans(mockScanRecords);
  }
}

export async function saveScanRecords(scans: ScanRecord[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sortScans(scans)));
}

export function getLatestComparison(scans: ScanRecord[]): ScanComparison | null {
  const frontScans = sortScans(scans).filter((scan) => scan.view === 'front');
  if (frontScans.length < 2) return null;

  return {
    after: frontScans[0],
    before: frontScans[1],
  };
}

export function findScanComparison(
  scans: ScanRecord[],
  beforeId?: string,
  afterId?: string,
): ScanComparison | null {
  if (beforeId && afterId) {
    const before = scans.find((scan) => scan.id === beforeId);
    const after = scans.find((scan) => scan.id === afterId);
    if (before && after) return { before, after };
  }

  return getLatestComparison(scans);
}

export function useScanRecords() {
  const [scans, setScans] = useState<ScanRecord[]>(mockScanRecords);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const records = await loadScanRecords();
    setScans(records);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const latestComparison = useMemo(() => getLatestComparison(scans), [scans]);

  return {
    scans,
    loading,
    refresh,
    latestComparison,
  };
}

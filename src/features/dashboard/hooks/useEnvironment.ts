import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import type { EnvironmentReading } from '../data';

type EnvironmentState = {
  locationLabel: string;
  status: string;
  readings: EnvironmentReading[];
  loading: boolean;
};

const FALLBACK: EnvironmentState = {
  locationLabel: 'Your area',
  status: 'UV unknown',
  readings: [
    { x: 0.13, value: 2.9 },
    { x: 0.4, value: 2.1 },
    { x: 0.58, value: 6.5 },
    { x: 0.9, value: 9.2, emphasis: true },
  ],
  loading: false,
};

function uvStatus(uv: number): string {
  if (uv >= 8) return 'Very high UV';
  if (uv >= 6) return 'High UV';
  if (uv >= 3) return 'Moderate UV';
  return 'Low UV';
}

function buildReadings(hourly: number[]): EnvironmentReading[] {
  const pick = (idx: number, emphasis?: boolean): EnvironmentReading => ({
    x: [0.13, 0.4, 0.58, 0.9][idx] ?? 0.5,
    value: Math.round((hourly[idx] ?? 0) * 10) / 10,
    emphasis,
  });
  const idxs = [
    Math.floor(hourly.length * 0.2),
    Math.floor(hourly.length * 0.45),
    Math.floor(hourly.length * 0.65),
    Math.max(0, hourly.length - 1),
  ];
  return idxs.map((i, n) => pick(Math.min(i, Math.max(0, hourly.length - 1)), n === 3));
}

export function useEnvironment() {
  const [state, setState] = useState<EnvironmentState>({ ...FALLBACK, loading: true });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!cancelled) setState(FALLBACK);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const { latitude, longitude } = pos.coords;

        let locationLabel = 'Your area';
        try {
          const places = await Location.reverseGeocodeAsync({ latitude, longitude });
          const place = places[0];
          if (place) {
            locationLabel = [place.city ?? place.subregion, place.region ?? place.country]
              .filter(Boolean)
              .join(', ');
          }
        } catch {
          // keep default label
        }

        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
          `&hourly=uv_index&timezone=auto&forecast_days=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
        const json = (await res.json()) as { hourly?: { uv_index?: number[] } };
        const uvSeries = json.hourly?.uv_index?.filter((n) => typeof n === 'number') ?? [];
        const currentUv = uvSeries[Math.min(uvSeries.length - 1, new Date().getHours())] ?? 0;

        if (!cancelled) {
          setState({
            locationLabel: locationLabel || FALLBACK.locationLabel,
            status: uvStatus(currentUv),
            readings: uvSeries.length ? buildReadings(uvSeries) : FALLBACK.readings,
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setState(FALLBACK);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

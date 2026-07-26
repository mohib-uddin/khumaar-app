import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import { env } from '@/lib/env';

let configured = false;

/** Configure RevenueCat once per app launch. Safe to call repeatedly. */
export function configurePurchases(): boolean {
  if (configured) return true;

  const apiKey = env.revenueCatApiKey;
  if (!apiKey) {
    console.warn('[Purchases] Missing EXPO_PUBLIC_REVENUECAT_API_KEY');
    return false;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey });
  configured = true;

  if (__DEV__) {
    console.log(`[Purchases] configured (${Platform.OS})`);
  }

  return true;
}

export function isPurchasesConfigured(): boolean {
  return configured;
}

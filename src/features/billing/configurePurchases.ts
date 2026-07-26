import { NativeModules, Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import { env } from '@/lib/env';

let configured = false;

function hasNativePurchases(): boolean {
  return Boolean(NativeModules.RNPurchases);
}

/** Configure RevenueCat once per app launch. Safe to call repeatedly. */
export function configurePurchases(): boolean {
  if (configured) return true;

  const apiKey = env.revenueCatApiKey;
  if (!apiKey) {
    console.warn('[Purchases] Missing EXPO_PUBLIC_REVENUECAT_API_KEY');
    return false;
  }

  if (!hasNativePurchases()) {
    console.warn(
      '[Purchases] Native module missing — rebuild the iOS/Android development client after installing react-native-purchases.',
    );
    return false;
  }

  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    Purchases.configure({ apiKey });
    configured = true;

    if (__DEV__) {
      console.log(`[Purchases] configured (${Platform.OS})`);
    }

    return true;
  } catch (error) {
    console.warn('[Purchases] configure failed', error);
    return false;
  }
}

export function isPurchasesConfigured(): boolean {
  return configured;
}

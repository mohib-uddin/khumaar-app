import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { isPurchasesConfigured } from './configurePurchases';

export type PurchaseOutcome =
  | { kind: 'purchased' }
  | { kind: 'cancelled' }
  | { kind: 'failed'; error: unknown };

export async function fetchCurrentPackages(): Promise<PurchasesPackage[]> {
  if (!isPurchasesConfigured()) return [];
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  } catch (error) {
    console.warn('[Purchases] getOfferings failed', error);
    return [];
  }
}

export async function buy(pkg: PurchasesPackage): Promise<PurchaseOutcome> {
  if (!isPurchasesConfigured()) {
    return { kind: 'failed', error: new Error('Purchases not configured') };
  }
  try {
    await Purchases.purchasePackage(pkg);
    return { kind: 'purchased' };
  } catch (error: unknown) {
    const e = error as { userCancelled?: boolean };
    if (e?.userCancelled === true) return { kind: 'cancelled' };
    return { kind: 'failed', error };
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!isPurchasesConfigured()) return false;
  try {
    await Purchases.restorePurchases();
    return true;
  } catch (error) {
    console.warn('[Purchases] restore failed', error);
    return false;
  }
}

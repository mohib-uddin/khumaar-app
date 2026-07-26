import Purchases from 'react-native-purchases';

import { isPurchasesConfigured } from './configurePurchases';

export async function syncRevenueCat(appUserID: string): Promise<void> {
  if (!isPurchasesConfigured()) return;
  try {
    await Purchases.logIn(appUserID);
  } catch (error) {
    console.warn('[Purchases] logIn failed', error);
  }
}

export async function signOutRevenueCat(): Promise<void> {
  if (!isPurchasesConfigured()) return;
  try {
    const info = await Purchases.getCustomerInfo();
    if (info.originalAppUserId.startsWith('$RCAnonymousID:')) return;
    await Purchases.logOut();
  } catch (error) {
    console.warn('[Purchases] logOut failed', error);
  }
}

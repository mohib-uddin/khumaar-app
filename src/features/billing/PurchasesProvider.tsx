import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { useAuth } from '@/features/onboarding';

import { configurePurchases, isPurchasesConfigured } from './configurePurchases';
import { signOutRevenueCat, syncRevenueCat } from './identity';
import { ENTITLEMENT_PRO } from './planCatalog';

type PurchasesContextValue = {
  ready: boolean;
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  refresh: () => Promise<void>;
};

const PurchasesContext = createContext<PurchasesContextValue | null>(null);

function hasProEntitlement(info: CustomerInfo | null): boolean {
  if (!info) return false;
  return info.entitlements.active[ENTITLEMENT_PRO] !== undefined;
}

export function PurchasesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ready, setReady] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const previousUserId = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isPurchasesConfigured()) {
      setCustomerInfo(null);
      return;
    }
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.warn('[Purchases] getCustomerInfo failed', error);
    }
  }, []);

  useEffect(() => {
    const ok = configurePurchases();
    if (!ok) {
      setReady(true);
      return;
    }

    const listener = (info: CustomerInfo) => {
      setCustomerInfo(info);
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    void Purchases.getCustomerInfo()
      .then(setCustomerInfo)
      .catch(() => {
        /* ignore */
      })
      .finally(() => setReady(true));

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  useEffect(() => {
    if (!ready || !isPurchasesConfigured()) return;

    const currentUserID = user?.id ?? null;
    const prev = previousUserId.current;
    previousUserId.current = currentUserID;

    void (async () => {
      if (prev == null && currentUserID != null) {
        await syncRevenueCat(currentUserID);
        await refresh();
      } else if (prev != null && currentUserID == null) {
        await signOutRevenueCat();
        await refresh();
      } else if (prev != null && currentUserID != null && prev !== currentUserID) {
        await signOutRevenueCat();
        await syncRevenueCat(currentUserID);
        await refresh();
      }
    })();
  }, [user?.id, ready, refresh]);

  const value = useMemo<PurchasesContextValue>(
    () => ({
      ready,
      isPro: hasProEntitlement(customerInfo),
      customerInfo,
      refresh,
    }),
    [ready, customerInfo, refresh],
  );

  return (
    <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>
  );
}

export function usePurchases(): PurchasesContextValue {
  const ctx = useContext(PurchasesContext);
  if (!ctx) {
    throw new Error('usePurchases must be used within PurchasesProvider');
  }
  return ctx;
}

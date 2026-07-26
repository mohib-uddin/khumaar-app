import { router, type Href } from 'expo-router';

import type { PaywallReason } from './planCatalog';

export function openProPaywall(reason: PaywallReason = 'generic'): void {
  router.push(`/paywall?reason=${encodeURIComponent(reason)}` as Href);
}

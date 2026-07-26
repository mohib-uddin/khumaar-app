/**
 * Entitlement + free-tier limits. Gate features on entitlement IDs, never product IDs,
 * so dashboard product/price changes do not require app releases.
 */

export const ENTITLEMENT_PRO = 'pro' as const;

export const FREE_SPECIALIST_MESSAGES_PER_DAY = 3;

export type PaywallReason = 'scan' | 'color' | 'chat' | 'generic';

export const PAYWALL_COPY: Record<
  PaywallReason,
  { subtitle: string; highlight: string }
> = {
  scan: {
    subtitle: 'Weekly AI scans stay fresh with Khumaar Pro.',
    highlight: 'Unlock your next scan',
  },
  color: {
    subtitle: 'Personal Color Edit is included with Khumaar Pro.',
    highlight: 'Unlock Color Edit',
  },
  chat: {
    subtitle: `Free plan includes ${FREE_SPECIALIST_MESSAGES_PER_DAY} specialist messages per day.`,
    highlight: 'Chat without limits',
  },
  generic: {
    subtitle: 'Weekly scans, Color Edit, and unlimited specialist chat.',
    highlight: 'Upgrade to Khumaar Pro',
  },
};

export const PRO_BENEFITS = [
  {
    title: 'Weekly AI scans',
    caption: 'Track progress every week with fresh analysis',
  },
  {
    title: 'Personal Color Edit',
    caption: 'Stylist palette matched to your phototype',
  },
  {
    title: 'Unlimited specialist chat',
    caption: 'Ask the coach anytime — no daily cap',
  },
] as const;

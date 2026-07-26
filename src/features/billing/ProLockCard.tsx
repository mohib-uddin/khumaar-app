import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { brandGradient, palette, spacing } from '@/theme';

import { openProPaywall } from './openProPaywall';
import type { PaywallReason } from './planCatalog';
import { PAYWALL_COPY } from './planCatalog';

type Props = {
  reason?: PaywallReason;
  title?: string;
  caption?: string;
  actionLabel?: string;
  style?: ViewStyle;
};

/** Inline locked-feature prompt — same Card language as the dashboard. */
export function ProLockCard({
  reason = 'generic',
  title,
  caption,
  actionLabel = 'Upgrade to Pro',
  style,
}: Props) {
  const copy = PAYWALL_COPY[reason];

  return (
    <Card style={[styles.card, style]}>
      <LinearGradient
        colors={[palette.brand[50], palette.surface.raised]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.wash}
      />
      <View style={styles.copy}>
        <Text variant="cardTitle" color="textPrimary">
          {title ?? copy.highlight}
        </Text>
        <Text variant="caption" color={palette.ink[300]}>
          {caption ?? copy.subtitle}
        </Text>
      </View>
      <Button
        label={actionLabel}
        onPress={() => openProPaywall(reason)}
        fullWidth
        style={styles.cta}
      />
      <View style={styles.accentBar}>
        <LinearGradient
          colors={[...brandGradient.colors]}
          locations={[...brandGradient.locations]}
          start={brandGradient.start}
          end={brandGradient.end}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  wash: {
    ...StyleSheet.absoluteFill,
    opacity: 0.85,
  },
  copy: {
    gap: spacing.xs,
    zIndex: 1,
  },
  cta: {
    zIndex: 1,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
});

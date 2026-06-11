import { StyleSheet, View } from 'react-native';

import { ChevronRight, Sparkles } from '@/components/icons';
import { PressableScale, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

type Props = {
  /** e.g. "cleanser" — used in expanded copy */
  category?: string;
  pickCount?: number;
  variant?: 'compact' | 'expanded';
  onPress: () => void;
};

/** Routine-step entry point for AI product picks — clear, tappable, on-brand. */
export function RoutineProductCta({
  category,
  pickCount = 3,
  variant = 'compact',
  onPress,
}: Props) {
  const compactLabel = `${pickCount} picks`;
  const expandedLabel = category
    ? `View ${pickCount} matched ${category.toLowerCase()}s`
    : `View ${pickCount} product picks`;

  const label = variant === 'compact' ? compactLabel : expandedLabel;
  const a11y = category
    ? `View ${pickCount} recommended ${category.toLowerCase()} products`
    : `View ${pickCount} recommended products`;

  return (
    <PressableScale
      onPress={onPress}
      dim={false}
      pressedScale={0.96}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={[styles.hit, variant === 'expanded' ? styles.expandedHit : styles.compactHit]}>
      <View style={[styles.pill, variant === 'expanded' && styles.expandedPill]}>
        <Sparkles size={variant === 'compact' ? 13 : 14} color={palette.brand[700]} />
        <Text
          variant={variant === 'compact' ? 'captionMedium' : 'metricSm'}
          color={palette.brand[700]}
          numberOfLines={1}
          style={variant === 'expanded' ? styles.expandedLabel : undefined}>
          {label}
        </Text>
        <ChevronRight size={14} color={palette.brand[700]} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hit: {
    borderRadius: radii.pill,
  },
  compactHit: {
    flexShrink: 0,
  },
  expandedHit: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[50],
    borderWidth: 1,
    borderColor: 'rgba(192, 255, 0, 0.35)',
  },
  expandedPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
  },
  expandedLabel: {
    flexShrink: 1,
  },
});

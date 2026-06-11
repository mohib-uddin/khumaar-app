import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { Card, Pill, PressableScale, Text, Button } from '@/components/ui';
import { formatProductPrice } from '@/features/products/pricing';
import { palette, radii, spacing } from '@/theme';
import type { ProductRecommendation, RoutineFit } from '@/features/skin-profile';

type Props = {
  product: ProductRecommendation;
  onPress?: () => void;
  ctaLabel?: string;
  onPressCta?: () => void;
  showSource?: boolean;
};

const ROUTINE_FIT_LABEL: Record<RoutineFit, string> = {
  morning: 'Morning',
  night: 'Night',
  both: 'AM + PM',
};

/** AI product recommendation — concern match, reasoning, routine placement. */
export function ProductRecommendationCard({
  product,
  onPress,
  ctaLabel,
  onPressCta,
  showSource = false,
}: Props) {
  return (
    <PressableScale onPress={onPress} dim={false} pressedScale={0.98}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.tile}>
            {product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" />
            ) : (
              <Text variant="captionMedium" color={palette.ink[500]}>
                {product.category.slice(0, 1)}
              </Text>
            )}
          </View>

          <View style={styles.copy}>
            <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
              {product.name}
            </Text>
            <Text variant="caption" color="textTertiary" numberOfLines={1}>
              {`${product.brand} · ${product.category}`}
            </Text>
            <Text variant="captionMedium" color="textPrimary">
              {formatProductPrice(product)}
            </Text>
          </View>

          <Pill paddingX={10} paddingY={5} background={palette.brand[50]}>
            <Text variant="metricSm" color={palette.brand[700]}>
              {`${product.match}% match`}
            </Text>
          </Pill>
        </View>

        <Text variant="caption" color="textSecondary" style={styles.reason}>
          {product.reason}
        </Text>

        <View style={styles.fitBlock}>
          <Text variant="caption" color="textTertiary" style={styles.fitText}>
            {product.scanFit}
          </Text>
          <Text variant="caption" color="textTertiary" style={styles.fitText}>
            {product.environmentFit}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Pill paddingX={10} paddingY={5} background={palette.surface.sunken}>
            <Text variant="metricSm" color={palette.ink[500]}>
              {ROUTINE_FIT_LABEL[product.routineFit]}
            </Text>
          </Pill>
          <Pill paddingX={10} paddingY={5} background={palette.surface.sunken}>
            <Text variant="metricSm" color={palette.ink[500]}>
              {product.concern}
            </Text>
          </Pill>
          {product.compatibility.slice(0, 2).map((label) => (
            <Pill key={label} paddingX={10} paddingY={5} background={palette.surface.sunken}>
              <Text variant="metricSm" color={palette.ink[500]}>
                {label}
              </Text>
            </Pill>
          ))}
          {showSource ? (
            <Pill paddingX={10} paddingY={5} background={palette.surface.sunkenAlt}>
              <Text variant="metricSm" color={palette.ink[400]}>
                {product.source === 'open-beauty-facts' ? 'Live data' : 'Curated'}
              </Text>
            </Pill>
          ) : null}
        </View>

        {onPressCta ? (
          <Button
            label={ctaLabel ?? 'View deal'}
            onPress={onPressCta}
            accessibilityLabel={`View deal for ${product.name}`}
          />
        ) : null}
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  tile: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: palette.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  reason: {
    lineHeight: 18,
  },
  fitBlock: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: palette.surface.sunken,
  },
  fitText: {
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});

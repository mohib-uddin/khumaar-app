import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Sparkles } from '@/components/icons';
import { Card, Pill, PressableScale, Text } from '@/components/ui';
import { formatProductPrice } from '@/features/products';
import type { ProductRecommendation, RoutineFit } from '@/features/skin-profile';
import { chipGradientActive, durations, easings, palette, radii, spacing } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const ROUTINE_FIT_LABEL: Record<RoutineFit, string> = {
  morning: 'Morning',
  night: 'Night',
  both: 'AM + PM',
};

const MATCH_RING = 56;
const MATCH_STROKE = 3;
const MATCH_RADIUS = (MATCH_RING - MATCH_STROKE) / 2;
const MATCH_CIRCUMFERENCE = 2 * Math.PI * MATCH_RADIUS;

type HeroProps = {
  product: ProductRecommendation;
  featured?: boolean;
  onPress?: () => void;
};

/** Featured product card for the routine recommendation sheet. */
export function RoutineProductHeroCard({ product, featured = false, onPress }: HeroProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      120,
      withTiming(product.match / 100, { duration: durations.slower, easing: easings.emphasized }),
    );
  }, [product.match, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: MATCH_CIRCUMFERENCE * (1 - progress.value),
  }));

  const content = (
    <Card elevation={featured ? 'floating' : 'card'} style={styles.heroCard}>
      {featured ? (
        <LinearGradient
          colors={[palette.brand[50], palette.white]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGlow}
        />
      ) : null}

      {featured ? (
        <Pill
          paddingX={12}
          paddingY={6}
          gradient={chipGradientActive.colors}
          gradientLocations={chipGradientActive.locations}
          style={styles.bestMatchPill}>
          <View style={styles.bestMatchRow}>
            <Sparkles size={11} color={palette.ink[700]} />
            <Text variant="captionMedium" color={palette.ink[700]} style={styles.bestMatchLabel}>
              Best match
            </Text>
          </View>
        </Pill>
      ) : null}

      <View style={styles.heroTop}>
        <View style={styles.imageFrame}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.heroImage} contentFit="cover" />
          ) : (
            <View style={styles.imageFallback}>
              <Text variant="captionMedium" color={palette.ink[500]}>
                {product.category.slice(0, 1)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.heroCopy}>
          <Text variant="routineTitle" color="textPrimary" numberOfLines={2}>
            {product.name}
          </Text>
          <Text variant="caption" color="textTertiary" numberOfLines={1}>
            {`${product.brand} · ${product.category}`}
          </Text>
          <Text variant="stepTitle" color="textPrimary">
            {formatProductPrice(product)}
          </Text>
        </View>

        <View style={styles.matchDial}>
          <Svg width={MATCH_RING} height={MATCH_RING}>
            <Circle
              cx={MATCH_RING / 2}
              cy={MATCH_RING / 2}
              r={MATCH_RADIUS}
              stroke={palette.surface.sunken}
              strokeWidth={MATCH_STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={MATCH_RING / 2}
              cy={MATCH_RING / 2}
              r={MATCH_RADIUS}
              stroke={palette.brand[500]}
              strokeWidth={MATCH_STROKE}
              strokeLinecap="round"
              strokeDasharray={MATCH_CIRCUMFERENCE}
              animatedProps={animatedProps}
              fill="none"
              transform={`rotate(-90 ${MATCH_RING / 2} ${MATCH_RING / 2})`}
            />
          </Svg>
          <View style={styles.matchLabel}>
            <Text variant="metricSm" color="textPrimary">
              {`${product.match}%`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Text variant="captionMedium" color={palette.ink[700]}>
          Why this fits you
        </Text>
        <Text variant="caption" color="textSecondary" style={styles.insightCopy}>
          {product.scanFit}
        </Text>
        <Text variant="caption" color="textTertiary" style={styles.insightCopy}>
          {product.environmentFit}
        </Text>
      </View>

      <View style={styles.chipRow}>
        <Pill paddingX={10} paddingY={5} background={palette.surface.sunken}>
          <Text variant="metricSm" color={palette.ink[500]}>
            {ROUTINE_FIT_LABEL[product.routineFit]}
          </Text>
        </Pill>
        {product.compatibility.slice(0, 3).map((label) => (
          <Pill key={label} paddingX={10} paddingY={5} background={palette.surface.sunken}>
            <Text variant="metricSm" color={palette.ink[500]}>
              {label}
            </Text>
          </Pill>
        ))}
      </View>
    </Card>
  );

  if (!onPress) return content;

  return (
    <PressableScale onPress={onPress} dim={false} pressedScale={0.98}>
      {content}
    </PressableScale>
  );
}

type AltProps = {
  product: ProductRecommendation;
  onPress?: () => void;
};

/** Compact alternate pick for horizontal scrolling inside the sheet. */
export function RoutineProductAltCard({ product, onPress }: AltProps) {
  return (
    <PressableScale onPress={onPress} dim={false} pressedScale={0.97} style={styles.altHit}>
      <Card style={styles.altCard}>
        <View style={styles.altImageWrap}>
          {product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.altImage} contentFit="cover" />
          ) : (
            <View style={styles.altFallback}>
              <Text variant="captionMedium" color={palette.ink[500]}>
                {product.priceTier}
              </Text>
            </View>
          )}
        </View>
        <Text variant="captionMedium" color="textPrimary" numberOfLines={2} style={styles.altName}>
          {product.name}
        </Text>
        <Text variant="captionMedium" color="textPrimary">
          {formatProductPrice(product)}
        </Text>
        <Text variant="metricSm" color={palette.brand[700]}>
          {`${product.match}% match`}
        </Text>
      </Card>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    padding: spacing.xxl,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  heroGlow: {
    ...StyleSheet.absoluteFill,
    opacity: 0.55,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  imageFrame: {
    width: 88,
    height: 88,
    borderRadius: radii.pill,
    backgroundColor: palette.surface.sunken,
    padding: spacing.xs,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: radii.pill,
  },
  imageFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: palette.white,
  },
  bestMatchPill: {
    alignSelf: 'flex-start',
  },
  bestMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bestMatchLabel: {
    lineHeight: 14,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: 2,
  },
  matchDial: {
    width: MATCH_RING,
    height: MATCH_RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchLabel: {
    position: 'absolute',
  },
  insightCard: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: palette.surface.sunken,
  },
  insightCopy: {
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  altHit: {
    width: 132,
  },
  altCard: {
    padding: spacing.lg,
    gap: spacing.sm,
    minHeight: 168,
  },
  altImageWrap: {
    width: '100%',
    height: 72,
    borderRadius: radii.xl,
    backgroundColor: palette.surface.sunken,
    overflow: 'hidden',
  },
  altImage: {
    width: '100%',
    height: '100%',
  },
  altFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  altName: {
    lineHeight: 16,
    minHeight: 32,
  },
});

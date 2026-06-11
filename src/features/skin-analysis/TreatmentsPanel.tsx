import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ChevronRight } from '@/components/icons';
import { Card, PressableScale, Text } from '@/components/ui';
import { ProductList } from '@/features/products';
import { productRecommendations } from '@/features/skin-profile';
import { palette, radii, spacing } from '@/theme';

import { PanelHeading } from './PanelHeading';

type TreatmentAction = {
  id: string;
  title: string;
  detail: string;
  timeline: string;
};

const treatmentActions: TreatmentAction[] = [
  { id: 'hydrate', title: 'Boost hydration', detail: 'Add a hydrating serum morning & night.', timeline: '2 weeks' },
  { id: 'brighten', title: 'Even your tone', detail: 'Apply vitamin C every morning.', timeline: '4 weeks' },
  { id: 'calm', title: 'Calm redness', detail: 'Avoid over-exfoliating this week.', timeline: 'Ongoing' },
];

/** Treatments tab — recommended actions and AI-matched products. */
export function TreatmentsPanel() {
  const router = useRouter();
  const topProducts = productRecommendations.slice(0, 3);

  return (
    <View style={styles.panel}>
      <PanelHeading title="Recommended for you" subtitle="Based on your scan & goals" />

      <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.section}>
        <Card style={styles.actionsCard}>
          {treatmentActions.map((action, index) => (
            <View key={action.id}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.action}>
                <View style={styles.actionCopy}>
                  <Text variant="stepTitle" color="textPrimary">
                    {action.title}
                  </Text>
                  <Text variant="caption" color="textTertiary">
                    {action.detail}
                  </Text>
                </View>
                <View style={styles.timelinePill}>
                  <Text variant="metricSm" color={palette.ink[500]}>
                    {action.timeline}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.section}>
        <View style={styles.productsHeader}>
          <Text variant="stepTitle" color="textPrimary">
            Matched products
          </Text>
          <PressableScale
            onPress={() => router.push('/products')}
            dim={false}
            pressedScale={0.96}
            accessibilityRole="button"
            accessibilityLabel="View all products"
            style={styles.seeAll}>
            <Text variant="captionMedium" color={palette.brand[700]}>
              View all
            </Text>
            <ChevronRight size={16} color={palette.brand[700]} />
          </PressableScale>
        </View>

        <ProductList
          products={topProducts}
          baseDelay={200}
          onPressProduct={() => router.push('/products')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing['4xl'],
  },
  section: {
    gap: spacing.lg,
  },
  actionsCard: {
    padding: spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginVertical: spacing.lg,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  actionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  timelinePill: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: palette.surface.sunken,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

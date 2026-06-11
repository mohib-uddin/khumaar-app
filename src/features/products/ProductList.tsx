import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { spacing } from '@/theme';
import type { ProductRecommendation } from '@/features/skin-profile';

import { ProductRecommendationCard } from './ProductRecommendationCard';

type Props = {
  products: ProductRecommendation[];
  onPressProduct?: (product: ProductRecommendation) => void;
  /** Delay before the first item animates in. */
  baseDelay?: number;
  showSource?: boolean;
};

/** Staggered list of AI product recommendations. */
export function ProductList({ products, onPressProduct, baseDelay = 0, showSource = false }: Props) {
  return (
    <View style={styles.list}>
      {products.map((product, index) => (
        <Animated.View
          key={product.id}
          entering={FadeInDown.delay(baseDelay + index * 70)
            .duration(380)
            .springify()
            .damping(16)}>
          <ProductRecommendationCard
            product={product}
            onPress={onPressProduct ? () => onPressProduct(product) : undefined}
            showSource={showSource}
          />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.lg,
  },
});

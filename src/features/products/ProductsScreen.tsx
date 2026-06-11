import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeft } from '@/components/icons';
import { ChipTabs, IconButton, Screen, Text } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import { productRecommendations, type ProductCategory } from '@/features/skin-profile';
import { layout, spacing } from '@/theme';

import { ProductList } from './ProductList';
import { loadFeaturedProductRecommendations } from './recommendations';

type Filter = 'all' | ProductCategory;

const enter = (index: number) =>
  FadeInDown.delay(90 * index)
    .duration(420)
    .springify()
    .damping(16);

/** Full product recommendations browser with category filtering. */
export function ProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [productsData, setProductsData] = useState(productRecommendations);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadFeaturedProductRecommendations()
      .then((products) => {
        if (!cancelled && products.length > 0) setProductsData(products);
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(productsData.map((p) => p.category)));
    return [
      { value: 'all' as Filter, label: 'All' },
      ...categories.map((c) => ({ value: c as Filter, label: c })),
    ];
  }, [productsData]);

  const products = useMemo(
    () =>
      filter === 'all'
        ? productsData
        : productsData.filter((p) => p.category === filter),
    [filter, productsData],
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <HeaderBlur />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing['7xl'] }]}>
        <Animated.View entering={enter(0)} style={styles.header}>
          <IconButton size={50} accessibilityLabel="Go back" onPress={handleBack}>
            <ArrowLeft size={22} />
          </IconButton>
          <Text variant="sectionTitle" color="textPrimary">
            Products
          </Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <Animated.View entering={enter(1)} style={styles.intro}>
          <Text variant="displaySm" color="textPrimary">
            {'Picked for '}
            <Text variant="emphasizedItalic" color="textPrimary">
              your skin
            </Text>
          </Text>
          <Text variant="body" color="textTertiary">
            {loadingProducts
              ? 'Refreshing live product matches...'
              : 'Matched to your scan, concerns, environment and budget.'}
          </Text>
        </Animated.View>

        <Animated.View entering={enter(2)} style={styles.tabs}>
          <ChipTabs options={filterOptions} value={filter} onChange={setFilter} />
        </Animated.View>

        <View style={styles.list}>
          <ProductList products={products} baseDelay={260} showSource />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 50,
  },
  intro: {
    marginTop: spacing['4xl'],
    gap: spacing.base,
  },
  tabs: {
    marginTop: spacing.xxl,
  },
  list: {
    marginTop: spacing.xxl,
  },
});

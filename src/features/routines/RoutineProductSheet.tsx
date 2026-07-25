import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Close } from '@/components/icons';
import { Button, Card, IconButton, Pill, Text } from '@/components/ui';
import { loadProductsForRoutineStep } from '@/features/products';
import type { ProductRecommendation } from '@/features/skin-profile';
import { brandGradient, layout, palette, radii, shadows, spacing } from '@/theme';

import { RoutineProductHeroCard } from './RoutineProductSheetCard';

type SelectedStep = {
  id: string;
  title: string;
};

type Props = {
  visible: boolean;
  step: SelectedStep | null;
  onClose: () => void;
};

const enter = (index: number) =>
  FadeInDown.delay(70 * index)
    .duration(380)
    .springify()
    .damping(16);

export function RoutineProductSheet({ visible, step, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [loadedStepId, setLoadedStepId] = useState<string | null>(null);
  useEffect(() => {
    if (!visible || !step || loadedStepId === step.id) return;

    let cancelled = false;

    loadProductsForRoutineStep(step.id)
      .then((nextProducts) => {
        if (!cancelled) {
          setProducts(nextProducts);
          setLoadedStepId(step.id);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loadedStepId, step, visible]);

  const openProduct = (product: ProductRecommendation) => {
    const url = product.sourceUrl?.trim();
    if (!url) return;
    void Linking.openURL(url);
  };

  const loading = visible && Boolean(step) && loadedStepId !== step?.id;
  const visibleProducts = step && loadedStepId === step.id ? products : [];
  const topMatch = visibleProducts[0] ?? null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close product recommendations"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <LinearGradient
            colors={[palette.brand[50], palette.white, palette.surface.raised]}
            locations={[0, 0.45, 1]}
            start={brandGradient.start}
            end={brandGradient.end}
            style={styles.sheetGlow}
          />

          <View style={styles.handle} />

          <View style={styles.topBar}>
            <Pill paddingX={12} paddingY={6} background={palette.white}>
              <Text variant="metricSm" color={palette.brand[700]}>
                AI matched
              </Text>
            </Pill>
            <IconButton size={46} accessibilityLabel="Close recommendations" onPress={onClose}>
              <Close size={18} color={palette.ink[700]} />
            </IconButton>
          </View>

          <View style={styles.heroCopy}>
            <Text variant="displaySm" color="textPrimary">
              {step ? 'Picked for your ' : 'Picked for your '}
              <Text variant="emphasizedItalic" color="textPrimary">
                {step ? step.title.toLowerCase() : 'routine'}
              </Text>
            </Text>
            <Text variant="body" color="textTertiary" style={styles.subtitle}>
              Scored from your latest scan, routine timing and today’s environment.
            </Text>
          </View>

          <View style={styles.signalRow}>
            <SignalPill label="Latest scan" />
            <SignalPill label="High UV" />
            <SignalPill label={step ? `${step.title} step` : 'Routine fit'} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scroll}>
            {loading ? (
              <Card style={styles.loadingCard}>
                <ActivityIndicator color={palette.brand[700]} />
                <Text variant="caption" color="textTertiary">
                  Finding the best matches...
                </Text>
              </Card>
            ) : null}

            {!loading && visibleProducts.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Text variant="stepTitle" color="textPrimary">
                  No products found yet
                </Text>
                <Text variant="caption" color="textTertiary" style={styles.subtitle}>
                  Keep going with the routine. We’ll refresh matches once product data is available.
                </Text>
              </Card>
            ) : null}

            {!loading && visibleProducts.length > 0 ? (
              <Animated.View entering={enter(0)} style={styles.matchesSection}>
                <Text variant="cardTitle" color="textPrimary">
                  {`Top ${visibleProducts.length} matches`}
                </Text>
                {visibleProducts.map((product, index) => (
                  <RoutineProductHeroCard
                    key={product.id}
                    product={product}
                    featured={index === 0}
                    onPress={() => openProduct(product)}
                  />
                ))}
              </Animated.View>
            ) : null}
          </ScrollView>

          {!loading && topMatch ? (
            <View style={styles.footer}>
              {topMatch.sourceUrl ? (
                <Button
                  label="Browse only"
                  onPress={() => openProduct(topMatch)}
                  accessibilityLabel={`Browse ${topMatch.name}`}
                />
              ) : null}
              <Button
                label="Continue routine"
                variant="secondary"
                onPress={onClose}
                accessibilityLabel="Continue routine"
              />
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function SignalPill({ label }: { label: string }) {
  return (
    <Pill paddingX={10} paddingY={6} background={palette.surface.sunken}>
      <Text variant="metricSm" color={palette.ink[500]}>
        {label}
      </Text>
    </Pill>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(16, 16, 16, 0.28)',
  },
  sheet: {
    maxHeight: '90%',
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    backgroundColor: palette.surface.raised,
    overflow: 'hidden',
    ...shadows.floating,
  },
  sheetGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: palette.ink[100],
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
  },
  heroCopy: {
    paddingHorizontal: layout.screenPaddingX,
    marginTop: spacing.lg,
    gap: spacing.base,
  },
  subtitle: {
    lineHeight: 20,
  },
  signalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: layout.screenPaddingX,
    marginTop: spacing.xl,
  },
  scroll: {
    marginTop: spacing.xxl,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingX,
    gap: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  loadingCard: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
  },
  emptyCard: {
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  matchesSection: {
    gap: spacing.lg,
  },
  footer: {
    gap: spacing.md,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: palette.ink[100],
    backgroundColor: palette.surface.raised,
  },
});

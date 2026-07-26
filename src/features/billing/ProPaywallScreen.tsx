import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Close } from '@/components/icons';
import { Button, Card, IconButton, PressableScale, Text } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import {
  brandGradient,
  layout,
  palette,
  radii,
  spacing,
  specialistHubGradient,
} from '@/theme';

import {
  PAYWALL_COPY,
  PRO_BENEFITS,
  type PaywallReason,
} from './planCatalog';
import { buy, fetchCurrentPackages, restorePurchases } from './purchase';
import { usePurchases } from './PurchasesProvider';

function resolveReason(raw: string | string[] | undefined): PaywallReason {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === 'scan' || value === 'color' || value === 'chat') return value;
  return 'generic';
}

function packagePeriodLabel(pkg: PurchasesPackage): string {
  const id = pkg.packageType;
  if (id === 'ANNUAL') return 'year';
  if (id === 'MONTHLY') return 'month';
  if (pkg.identifier.includes('annual')) return 'year';
  if (pkg.identifier.includes('month')) return 'month';
  return '';
}

export function ProPaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { reason: reasonParam } = useLocalSearchParams<{ reason?: string }>();
  const reason = resolveReason(reasonParam);
  const copy = PAYWALL_COPY[reason];
  const { isPro, refresh } = usePurchases();

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingOfferings, setLoadingOfferings] = useState(true);
  const [buying, setBuying] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const selected = useMemo(
    () => packages.find((p) => p.identifier === selectedId) ?? packages[0] ?? null,
    [packages, selectedId],
  );

  useEffect(() => {
    let mounted = true;
    void (async () => {
      setLoadingOfferings(true);
      const next = await fetchCurrentPackages();
      if (!mounted) return;
      setPackages(next);
      const annual = next.find(
        (p) => p.packageType === 'ANNUAL' || p.identifier.includes('annual'),
      );
      setSelectedId((annual ?? next[0])?.identifier ?? null);
      setLoadingOfferings(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isPro) {
      if (router.canGoBack()) router.back();
      else router.replace('/');
    }
  }, [isPro, router]);

  const handleClose = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, [router]);

  const handlePurchase = useCallback(async () => {
    if (!selected || buying) return;
    setBuying(true);
    const outcome = await buy(selected);
    setBuying(false);
    if (outcome.kind === 'purchased') {
      await refresh();
      handleClose();
      return;
    }
    if (outcome.kind === 'failed') {
      const message =
        outcome.error instanceof Error
          ? outcome.error.message
          : 'Something went wrong. Try again.';
      Alert.alert('Purchase failed', message);
    }
  }, [selected, buying, refresh, handleClose]);

  const handleRestore = useCallback(async () => {
    if (restoring) return;
    setRestoring(true);
    const ok = await restorePurchases();
    await refresh();
    setRestoring(false);
    if (ok) {
      Alert.alert('Restored', 'Your purchases were restored.');
    } else {
      Alert.alert('Restore failed', 'No active purchases found for this account.');
    }
  }, [restoring, refresh]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[...specialistHubGradient.colors]}
        locations={[...specialistHubGradient.locations]}
        start={specialistHubGradient.start}
        end={specialistHubGradient.end}
        style={StyleSheet.absoluteFill}
      />
      <HeaderBlur />

      <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
        <IconButton accessibilityLabel="Close" onPress={handleClose} size={44}>
          <Close size={20} color={palette.ink[900]} />
        </IconButton>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing['6xl'] },
        ]}>
        <Animated.View entering={FadeInDown.duration(420).springify().damping(16)}>
          <Text variant="displayLg" color="textPrimary" style={styles.brand}>
            Khumaar Pro
          </Text>
          <Text variant="body" color={palette.ink[500]} style={styles.subtitle}>
            {copy.subtitle}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(420).springify().damping(16)}
          style={styles.benefits}>
          {PRO_BENEFITS.map((item) => (
            <Card key={item.title} style={styles.benefitCard}>
              <View style={styles.benefitDot}>
                <LinearGradient
                  colors={[...brandGradient.colors]}
                  locations={[...brandGradient.locations]}
                  start={brandGradient.start}
                  end={brandGradient.end}
                  style={StyleSheet.absoluteFill}
                />
              </View>
              <View style={styles.benefitCopy}>
                <Text variant="stepTitle" color="textPrimary">
                  {item.title}
                </Text>
                <Text variant="caption" color={palette.ink[300]}>
                  {item.caption}
                </Text>
              </View>
            </Card>
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(140).duration(420).springify().damping(16)}
          style={styles.plans}>
          <Text variant="sectionTitle" color="textPrimary">
            Choose a plan
          </Text>

          {loadingOfferings ? (
            <ActivityIndicator color={palette.ink[500]} style={styles.loader} />
          ) : packages.length === 0 ? (
            <Text variant="caption" color={palette.ink[300]}>
              Plans are unavailable right now. Check your connection and try again.
            </Text>
          ) : (
            packages.map((pkg) => {
              const selectedPkg = pkg.identifier === selected?.identifier;
              const period = packagePeriodLabel(pkg);
              return (
                <PressableScale
                  key={pkg.identifier}
                  onPress={() => setSelectedId(pkg.identifier)}
                  dim={false}
                  pressedScale={0.98}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedPkg }}
                  accessibilityLabel={`${pkg.product.title} ${pkg.product.priceString}`}>
                  <Card
                    style={[styles.planCard, selectedPkg && styles.planCardSelected]}>
                    <View style={styles.planRow}>
                      <View style={styles.planCopy}>
                        <Text variant="stepTitle" color="textPrimary">
                          {pkg.packageType === 'ANNUAL' ||
                          pkg.identifier.includes('annual')
                            ? 'Annual'
                            : 'Monthly'}
                        </Text>
                        <Text variant="caption" color={palette.ink[300]}>
                          {pkg.product.priceString}
                          {period ? ` / ${period}` : ''}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radio,
                          selectedPkg && styles.radioSelected,
                        ]}
                      />
                    </View>
                  </Card>
                </PressableScale>
              );
            })
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(420).springify().damping(16)}
          style={styles.actions}>
          <Button
            label={
              buying
                ? 'Processing…'
                : selected
                  ? `Continue · ${selected.product.priceString}`
                  : 'Continue'
            }
            onPress={() => {
              void handlePurchase();
            }}
            fullWidth
          />
          <PressableScale
            onPress={() => {
              void handleRestore();
            }}
            disabled={restoring}
            accessibilityRole="button"
            accessibilityLabel="Restore purchases"
            style={styles.restore}>
            <Text variant="caption" color={palette.ink[500]}>
              {restoring ? 'Restoring…' : 'Restore purchases'}
            </Text>
          </PressableScale>
          <PressableScale onPress={handleClose} accessibilityRole="button">
            <Text variant="caption" color={palette.ink[300]}>
              Not now
            </Text>
          </PressableScale>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.surface.canvas,
  },
  topBar: {
    paddingHorizontal: layout.screenPaddingX,
    alignItems: 'flex-end',
  },
  content: {
    paddingHorizontal: layout.screenPaddingX,
    gap: spacing['4xl'],
    paddingTop: spacing.lg,
  },
  brand: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    maxWidth: 320,
  },
  benefits: {
    gap: spacing.md,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  benefitDot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    overflow: 'hidden',
  },
  benefitCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  plans: {
    gap: spacing.lg,
  },
  loader: {
    marginVertical: spacing.xxl,
  },
  planCard: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: palette.brand[500],
    backgroundColor: palette.brand[50],
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  planCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radii.pill,
    borderWidth: 2,
    borderColor: palette.ink[200],
  },
  radioSelected: {
    borderColor: palette.brand[500],
    backgroundColor: palette.brand[300],
  },
  actions: {
    gap: spacing.xxl,
    alignItems: 'center',
  },
  restore: {
    paddingVertical: spacing.sm,
  },
});

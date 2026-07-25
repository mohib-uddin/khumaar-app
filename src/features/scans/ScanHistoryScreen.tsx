import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeft } from '@/components/icons';
import { IconButton, Screen, Text } from '@/components/ui';
import { HeaderBlur } from '@/features/dashboard';
import { layout, palette, spacing } from '@/theme';

import { useSupabaseScanRecords } from './hooks/useSupabaseScanRecords';
import { ScanHistoryRow } from './ScanHistoryRow';

const STAGGER = 80;

const enter = (index: number) =>
  FadeInDown.delay(STAGGER * index)
    .duration(420)
    .springify()
    .damping(16);

/** Scan history list — Compare CTA gated until live before/after ships. */
export function ScanHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { scans } = useSupabaseScanRecords();

  return (
    <Screen edges={['top', 'left', 'right']}>
      <HeaderBlur />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + layout.tabBarHeight + spacing.xxxl },
        ]}>
        <Animated.View entering={enter(0)} style={styles.header}>
          <IconButton accessibilityLabel="Go back" onPress={() => router.back()}>
            <ArrowLeft size={22} color={palette.ink[900]} />
          </IconButton>
          <Text variant="sectionTitle" color="textPrimary">
            Scan history
          </Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        <View style={styles.body}>
          <Animated.View entering={enter(1)} style={styles.heroCopy}>
            <Text variant="displayLg" color="textPrimary">
              Your progress
            </Text>
            <Text variant="body" color="textTertiary">
              Review past scans and scores. Side-by-side compare is coming soon.
            </Text>
          </Animated.View>

          <Animated.View entering={enter(2)} style={styles.listSection}>
            <Text variant="sectionTitle" color="textPrimary">
              All scans
            </Text>
            <View style={styles.list}>
              {scans.map((scan, index) => (
                <ScanHistoryRow key={scan.id} scan={scan} latest={index === 0} />
              ))}
            </View>
          </Animated.View>
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
    width: 56,
  },
  body: {
    marginTop: spacing['5xl'],
    gap: spacing['4xl'],
  },
  heroCopy: {
    gap: spacing.base,
  },
  listSection: {
    gap: spacing.lg,
  },
  list: {
    gap: spacing.base,
  },
});

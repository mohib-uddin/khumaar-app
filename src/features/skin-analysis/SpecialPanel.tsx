import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Check, ChevronRight, MagicWand } from '@/components/icons';
import { Card, PressableScale, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

const coachingTips = [
  'Use lukewarm water — hot water strips your barrier.',
  'Patch-test new actives for 2 days before full use.',
  'Always layer sunscreen last in your morning routine.',
];

/** Special tab — safety status, coaching tips, and specialist hand-off. */
export function SpecialPanel() {
  const router = useRouter();

  return (
    <View style={styles.panel}>
      <Animated.View entering={FadeInDown.delay(60).springify()}>
        <Card background={palette.brand[50]} style={styles.safetyCard}>
          <View style={styles.safetyIcon}>
            <Check size={20} color={palette.ink[900]} />
          </View>
          <View style={styles.safetyCopy}>
            <Text variant="stepTitle" color="textPrimary">
              No urgent concerns detected
            </Text>
            <Text variant="caption" color="textSecondary" style={styles.safetyText}>
              Your scan looks safe to self-manage. We&apos;ll flag anything that may need a
              dermatologist.
            </Text>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.section}>
        <Text variant="stepTitle" color="textPrimary">
          Coaching tips
        </Text>
        <Card style={styles.tipsCard}>
          {coachingTips.map((tip, index) => (
            <View key={tip}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <View style={styles.tip}>
                <View style={styles.dot} />
                <Text variant="body" color="textSecondary" style={styles.tipText}>
                  {tip}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(260).springify()}>
        <PressableScale
          onPress={() => router.push('/specialist')}
          dim={false}
          pressedScale={0.98}
          accessibilityRole="button"
          accessibilityLabel="Ask the AI skin specialist">
          <Card style={styles.cta}>
            <View style={styles.ctaIcon}>
              <MagicWand size={20} color={palette.ink[900]} />
            </View>
            <View style={styles.ctaCopy}>
              <Text variant="stepTitle" color="textPrimary">
                Ask the AI specialist
              </Text>
              <Text variant="caption" color="textTertiary">
                Get answers about your skin, 24/7
              </Text>
            </View>
            <ChevronRight size={20} color={palette.ink[400]} />
          </Card>
        </PressableScale>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing['4xl'],
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xxl,
  },
  safetyIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  safetyText: {
    lineHeight: 18,
  },
  section: {
    gap: spacing.lg,
  },
  tipsCard: {
    padding: spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginVertical: spacing.lg,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    backgroundColor: palette.brand[500],
  },
  tipText: {
    flex: 1,
    lineHeight: 20,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xxl,
  },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaCopy: {
    flex: 1,
    gap: spacing.xs,
  },
});

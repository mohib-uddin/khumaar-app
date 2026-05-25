import { StyleSheet, View } from 'react-native';
import Animated, { FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { Close, MagicWand } from '@/components/icons';
import { Card, GradientIconButton, IconButton, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onEnhance?: () => void;
};

/**
 * Dismissible AI suggestion strip — Figma node 0:429.
 */
export function AIBanner({ visible, onDismiss, onEnhance }: Props) {
  if (!visible) return null;

  return (
    <Animated.View exiting={FadeOutUp.duration(280)} layout={LinearTransition.springify()}>
      <Card radius="pill" elevation="none" style={styles.banner}>
        <View style={styles.inner}>
          <Text variant="bannerItalic" color="textPrimary" style={styles.copy}>
            AI wil analyse your data and make auto daily routine
          </Text>

          <View style={styles.actions}>
            <GradientIconButton
              size={48}
              accessibilityLabel="Generate AI routine"
              onPress={onEnhance}>
              <MagicWand size={20} color={palette.ink[900]} />
            </GradientIconButton>

            <IconButton
              size={48}
              accessibilityLabel="Dismiss suggestion"
              onPress={onDismiss}
              style={styles.dismiss}>
              <Close size={22} />
            </IconButton>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 68,
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    maxWidth: 219,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  dismiss: {
    borderWidth: 1,
    borderColor: palette.ink[200],
    opacity: 0.8,
  },
});

import { forwardRef } from 'react';
import { Pressable, type PressableProps, type View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { springs } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  /**
   * Scale to animate to while pressed. Default 0.96 — feels snappy but visible.
   */
  pressedScale?: number;
  /**
   * Whether the press should also dim the element via opacity.
   */
  dim?: boolean;
};

/**
 * A `Pressable` that scales (and optionally dims) on press, driven by a spring.
 * Use everywhere a tap should feel tactile — buttons, icon chips, list rows.
 */
export const PressableScale = forwardRef<View, Props>(function PressableScale(
  { pressedScale = 0.96, dim = true, style, onPressIn, onPressOut, children, ...rest },
  ref,
) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 - progress.value * (1 - pressedScale),
      },
    ],
    opacity: dim ? 1 - progress.value * 0.15 : 1,
  }));

  return (
    <AnimatedPressable
      ref={ref}
      onPressIn={(e) => {
        progress.value = withSpring(1, springs.press);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        progress.value = withSpring(0, springs.press);
        onPressOut?.(e);
      }}
      style={[animatedStyle, style as object]}
      {...rest}>
      {children as React.ReactNode}
    </AnimatedPressable>
  );
});

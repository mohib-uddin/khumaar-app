import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';

import { palette, radii } from '@/theme';
import { useThemeColors } from '@/theme/ThemeProvider';

import { PressableScale } from './PressableScale';

type Variant = 'default' | 'highlight';

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: number;
  accessibilityLabel: string;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
};

/**
 * Circular icon button — used in the dashboard header for the magic wand,
 * scan-face and bell entries. The `highlight` variant adds the lime brand
 * border to flag the primary action.
 */
export function IconButton({
  children,
  variant = 'default',
  size = 50,
  accessibilityLabel,
  onPress,
  style,
  testID,
}: Props) {
  const colors = useThemeColors();
  const isHighlight = variant === 'highlight';

  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      hitSlop={8}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radii.pill,
          backgroundColor: colors.surface,
          borderColor: isHighlight ? palette.brand[500] : 'transparent',
          borderWidth: isHighlight ? 2 : 0,
        },
        style,
      ]}>
      {children}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

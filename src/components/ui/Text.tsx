import { forwardRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useThemeColors } from '@/theme/ThemeProvider';
import { typography, type TypographyToken } from '@/theme';
import type { ThemeColorToken } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TypographyToken;
  color?: ThemeColorToken | string;
};

const isThemeToken = (value: string): value is ThemeColorToken =>
  ['textPrimary', 'textSecondary', 'textTertiary', 'textInverted'].includes(value);

export const Text = forwardRef<RNText, TextProps>(function Text(
  { variant = 'body', color = 'textPrimary', style, ...rest },
  ref,
) {
  const colors = useThemeColors();
  const resolvedColor = typeof color === 'string' && isThemeToken(color) ? colors[color] : color;

  return (
    <RNText
      ref={ref}
      allowFontScaling
      style={[typography[variant], { color: resolvedColor as string }, style]}
      {...rest}
    />
  );
});

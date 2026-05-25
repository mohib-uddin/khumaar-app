import { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { radii, shadows, type ShadowToken } from '@/theme';
import { useThemeColors } from '@/theme/ThemeProvider';

type Props = ViewProps & {
  /**
   * Border radius token. Defaults to `2xl` (20pt) — matches all dashboard cards.
   */
  radius?: keyof typeof radii;
  /**
   * Shadow elevation token. Defaults to `card`.
   */
  elevation?: ShadowToken;
  /**
   * Background colour. Falls back to the theme's surface colour.
   */
  background?: string;
};

export const Card = forwardRef<View, Props>(function Card(
  { style, radius = '2xl', elevation = 'card', background, children, ...rest },
  ref,
) {
  const colors = useThemeColors();

  const cardStyle: ViewStyle = {
    backgroundColor: background ?? colors.surface,
    borderRadius: radii[radius],
    overflow: 'hidden',
  };

  return (
    <View ref={ref} style={[cardStyle, shadows[elevation], style]} {...rest}>
      {children}
    </View>
  );
});

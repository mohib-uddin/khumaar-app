import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColors } from '@/theme/ThemeProvider';

type Props = {
  children: ReactNode;
  /**
   * Background colour. Defaults to the theme's canvas background.
   */
  background?: string;
  edges?: readonly Edge[];
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

/**
 * Screen wrapper that fills the safe area and applies the canvas background.
 */
export function Screen({
  children,
  background,
  edges = ['top', 'left', 'right'],
  style,
  contentStyle,
}: Props) {
  const colors = useThemeColors();
  const bg = background ?? colors.background;

  return (
    <View style={[styles.root, { backgroundColor: bg }, style]}>
      <SafeAreaView style={[styles.safe, contentStyle]} edges={edges}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
});

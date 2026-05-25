import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { radii, shadows } from '@/theme';

type Props = {
  source: ImageSource | number;
  size?: number;
  ringWidth?: number;
  ringColor?: string;
  style?: ViewStyle;
};

/**
 * Round avatar with a soft elevation and a configurable ring. The default ring
 * (white, 2pt) matches the design's "lifted" portrait treatment.
 */
export function Avatar({
  source,
  size = 56,
  ringWidth = 2,
  ringColor = '#FFFFFF',
  style,
}: Props) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: radii.pill,
          borderWidth: ringWidth,
          borderColor: ringColor,
        },
        shadows.avatar,
        style,
      ]}>
      <Image
        source={source}
        style={styles.image}
        contentFit="cover"
        transition={150}
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: radii.pill,
  },
});

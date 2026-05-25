import { StyleSheet, View } from 'react-native';
import Svg, { Defs, FeGaussianBlur, Filter, G, Path } from 'react-native-svg';

import { palette } from '@/theme';

/**
 * The lime "aurora" decoration that bleeds in behind the header. Re-built from
 * the Figma source as a pair of softly-blurred strokes — pure SVG so it stays
 * crisp at any density and avoids shipping a huge raster.
 */
export function HeaderBlur() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 488 557" preserveAspectRatio="none">
        <Defs>
          <Filter id="softBlur" x="-25%" y="-25%" width="150%" height="150%">
            <FeGaussianBlur stdDeviation="50" />
          </Filter>
        </Defs>
        <G filter="url(#softBlur)">
          <Path
            d="M143.757 136.005C130.77 216.593 104.659 629.297 352 287.412"
            stroke={palette.brand[300]}
            strokeWidth={72}
            strokeLinecap="round"
            opacity={0.32}
            fill="none"
          />
          <Path
            d="M205.859 184.005C198.576 225.289 183.214 359.492 271 301.832"
            stroke={palette.brand[300]}
            strokeWidth={72}
            strokeLinecap="round"
            opacity={0.18}
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: -20,
    left: 30,
    right: 0,
    height: 480,
    zIndex: -1,
  },
});

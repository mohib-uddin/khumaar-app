import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, FeGaussianBlur, Filter, G, Path } from 'react-native-svg';

import { palette } from '@/theme';

import { HERO_LAYOUT } from './heroLayout';

/**
 * Figma node 0:53 — soft lime glow behind the scan portrait.
 * Uses the same bleed-inset positioning as the dashboard HeaderBlur.
 */
export function HeroGlow() {
  const { width: screenWidth } = useWindowDimensions();
  const scale = screenWidth / HERO_LAYOUT.frameWidth;
  const { glow } = HERO_LAYOUT;

  const containerWidth = glow.width * scale;
  const containerHeight = glow.height * scale;
  const left = glow.left * scale;
  const top = glow.top * scale;

  const innerWidth = containerWidth * (1 + glow.inset.left + glow.inset.right);
  const innerHeight = containerHeight * (1 + glow.inset.top + glow.inset.bottom);
  const innerLeft = -containerWidth * glow.inset.left;
  const innerTop = -containerHeight * glow.inset.top;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          left,
          top,
          width: containerWidth,
          height: containerHeight,
        },
      ]}>
      <View
        style={{
          position: 'absolute',
          top: innerTop,
          left: innerLeft,
          width: innerWidth,
          height: innerHeight,
        }}>
        <Svg width="100%" height="100%" viewBox="0 0 603.507 816.012" preserveAspectRatio="none">
          <Defs>
            <Filter
              id="heroGlowBlur"
              x="0"
              y="0"
              width="603.507"
              height="816.012"
              filterUnits="userSpaceOnUse">
              <FeGaussianBlur stdDeviation="60" />
            </Filter>
          </Defs>
          <G filter="url(#heroGlowBlur)" opacity={0.5}>
            <Path
              d="M274.686 156.005C253.885 189.73 232.366 258.648 312.695 264.527C353.54 263.962 447.507 277.005 447.507 369.005C437.007 531.505 334.007 623.005 156.007 660.005"
              stroke={palette.brand[300]}
              strokeWidth={72}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    overflow: 'visible',
  },
});

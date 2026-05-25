import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, FeGaussianBlur, Filter, G, Path } from 'react-native-svg';

import { palette } from '@/theme';

/** Figma Home frame (402×910) — node 5:214 "Layer blurs". */
const FIGMA_FRAME_WIDTH = 402;
const BLUR_LEFT = 112;
const BLUR_WIDTH = 227;
const BLUR_HEIGHT = 274;

/** Negative inset on the inner asset, matching Figma's overflow bleed. */
const INSET = {
  top: 0.4964,
  left: 0.5507,
  right: 0.5991,
  bottom: 0.5365,
} as const;

/**
 * The lime "aurora" decoration behind the header. Positioned and scaled from
 * the Figma "Layer blurs" frame so the soft glow sits upper-right, not stretched
 * across the full screen width.
 */
export function HeaderBlur() {
  const { width: screenWidth } = useWindowDimensions();
  const scale = screenWidth / FIGMA_FRAME_WIDTH;

  const containerWidth = BLUR_WIDTH * scale;
  const containerHeight = BLUR_HEIGHT * scale;
  const left = BLUR_LEFT * scale;

  const innerWidth = containerWidth * (1 + INSET.left + INSET.right);
  const innerHeight = containerHeight * (1 + INSET.top + INSET.bottom);
  const innerLeft = -containerWidth * INSET.left;
  const innerTop = -containerHeight * INSET.top;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          left,
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
        <Svg width="100%" height="100%" viewBox="0 0 488.003 557" preserveAspectRatio="none">
          <Defs>
            <Filter
              id="headerBlurPrimary"
              x="0"
              y="0"
              width="488.003"
              height="556.999"
              filterUnits="userSpaceOnUse">
              <FeGaussianBlur stdDeviation="50" />
            </Filter>
            <Filter
              id="headerBlurSecondary"
              x="64.0123"
              y="47.9994"
              width="342.992"
              height="404.065"
              filterUnits="userSpaceOnUse">
              <FeGaussianBlur stdDeviation="50" />
            </Filter>
          </Defs>
          <G filter="url(#headerBlurPrimary)" opacity={0.2}>
            <Path
              d="M143.757 136.005C130.77 216.593 104.659 629.297 352 287.412"
              stroke={palette.brand[300]}
              strokeWidth={72}
              strokeLinecap="round"
              fill="none"
            />
          </G>
          <G filter="url(#headerBlurSecondary)" opacity={0.1}>
            <Path
              d="M205.859 184.005C198.576 225.289 183.214 359.492 271 301.832"
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
    top: 0,
    zIndex: -1,
    overflow: 'visible',
  },
});

import { memo } from 'react';
import Svg, { Circle, Defs, FeColorMatrix, FeComposite, FeFlood, FeGaussianBlur, FeOffset, Filter } from 'react-native-svg';

import type { IconProps } from './types';

type Props = IconProps & {
  outerColor?: string;
  innerColor?: string;
};

/**
 * The chart endpoint marker — a soft white capsule with a vivid lime core.
 * Used as a "live indicator" on the environment chart and on the weekly bar chart.
 */
export const DotMarker = memo(function DotMarker({
  size = 20,
  outerColor = '#FFFFFF',
  innerColor = '#C0FF00',
  ...rest
}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...rest}>
      <Defs>
        <Filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
          <FeFlood floodOpacity={0} />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <FeOffset dy={2} />
          <FeGaussianBlur stdDeviation={2} />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
        </Filter>
      </Defs>
      <Circle cx={10} cy={10} r={6} fill={outerColor} filter="url(#dotShadow)" />
      <Circle cx={10} cy={10} r={3} fill={innerColor} />
    </Svg>
  );
});

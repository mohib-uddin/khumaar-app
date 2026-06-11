import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Simple clock — used for exercise duration and scan timing. */
export const Clock = memo(function Clock({ size = 16, color = '#101010', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...rest}>
      <Circle cx={8} cy={8} r={6.2} stroke={color} strokeWidth={1.5} />
      <Path
        d="M8 4.8V8l2.2 1.6"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

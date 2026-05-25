import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export const ArrowLeft = memo(function ArrowLeft({ size = 22, color = '#101010', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...rest}>
      <Path
        d="M11 18V4M11 4L5 10M11 4l6 6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

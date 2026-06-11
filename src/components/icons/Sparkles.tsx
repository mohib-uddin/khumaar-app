import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Sparkles — used for weekly treatment routines. */
export const Sparkles = memo(function Sparkles({ size = 22, color = '#101010', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...rest}>
      <Path
        d="M11 2.5v3.2M11 16.3v3.2M4.2 5.8l2.3 2.3M15.5 17.1l2.3 2.3M2.5 11h3.2M16.3 11h3.2M5.8 16.2l2.3-2.3M17.1 4.9l2.3-2.3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M11 8.2l.9 1.8 1.9.3-1.4 1.3.3 1.9-1.7-.9-1.7.9.3-1.9-1.4-1.3 1.9-.3.9-1.8Z"
        fill={color}
      />
    </Svg>
  );
});

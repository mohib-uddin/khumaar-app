import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Water droplet — used for midday refresh / mist routines. */
export const Droplet = memo(function Droplet({ size = 22, color = '#101010', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...rest}>
      <Path
        d="M11 3.5c2.8 4.2 6.5 7.1 6.5 11a6.5 6.5 0 1 1-13 0c0-3.9 3.7-6.8 6.5-11Z"
        fill={color}
      />
    </Svg>
  );
});

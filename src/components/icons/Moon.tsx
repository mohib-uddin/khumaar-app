import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Crescent moon — used for night routines. */
export const Moon = memo(function Moon({ size = 22, color = '#101010', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...rest}>
      <Path
        d="M14.8 3.2a7.25 7.25 0 1 0 5 12.45A8.75 8.75 0 1 1 14.8 3.2Z"
        fill={color}
      />
    </Svg>
  );
});

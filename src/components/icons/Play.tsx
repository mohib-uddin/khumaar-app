import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Filled play triangle — used on facial-exercise start controls. */
export const Play = memo(function Play({ size = 20, color = '#101010', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...rest}>
      <Path
        d="M6.5 4.8c0-.74.8-1.2 1.44-.83l8.2 4.8c.62.36.62 1.27 0 1.63l-8.2 4.8c-.64.38-1.44-.09-1.44-.82V4.8z"
        fill={color}
      />
    </Svg>
  );
});

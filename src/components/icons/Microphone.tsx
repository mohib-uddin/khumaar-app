import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Classic mic + stand — readable at small sizes on dark buttons. */
export const Microphone = memo(function Microphone({
  size = 22,
  color = '#FFFFFF',
  ...rest
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M12 15.25a3.75 3.75 0 0 0 3.75-3.75V8a3.75 3.75 0 1 0-7.5 0v3.5A3.75 3.75 0 0 0 12 15.25Z"
        fill={color}
      />
      <Path
        d="M6.25 11.5a5.75 5.75 0 0 0 11.5 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M12 17v3.25" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M9.25 20.25h5.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
});

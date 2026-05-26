import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export const Paperclip = memo(function Paperclip({
  size = 20,
  color = '#101010',
  ...rest
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...rest}>
      <Path
        d="M12.2 4.8 7.4 9.6a2.2 2.2 0 0 0 3.1 3.1l5.5-5.5a3.8 3.8 0 0 0-5.4-5.4L5.2 7.6a5.5 5.5 0 0 0 7.8 7.8l6.5-6.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

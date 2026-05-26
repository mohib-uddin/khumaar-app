import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export const PaperPlane = memo(function PaperPlane({
  size = 20,
  color = '#101010',
  ...rest
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...rest}>
      <Path
        d="M17.5 2.5 9 11M17.5 2.5l-5 15-3.5-6.5L2.5 7l15-4.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

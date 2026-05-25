import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

/** Down-right enter arrow used on routine cards. */
export const ChevronEnter = memo(function ChevronEnter({
  size = 22,
  color = '#101010',
  ...rest
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...rest}>
      <Path
        d="M7 7l8 8M15 7v8H7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

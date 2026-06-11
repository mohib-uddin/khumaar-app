import { memo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

/** Closed padlock — used on locked facial-exercise steps. */
export const Lock = memo(function Lock({ size = 20, color = '#101010', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...rest}>
      <Rect
        x={4}
        y={8.5}
        width={12}
        height={8}
        rx={2.2}
        stroke={color}
        strokeWidth={1.7}
      />
      <Path
        d="M6.75 8.5V6.75a3.25 3.25 0 0 1 6.5 0V8.5"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
});

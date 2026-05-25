import { memo } from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

import { palette } from '@/theme';
import type { IconProps } from './types';

/** Active step indicator — lime circle with inner dot (Figma node 0:478). */
export const TonerStepIcon = memo(function TonerStepIcon({
  size = 48,
  ...rest
}: IconProps) {
  const r = size / 2;
  const dotR = size * (4 / 48);
  const dotCx = size * (24 / 48);
  const dotCy = size * (24 / 48);

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...rest}>
      <Rect width={48} height={48} rx={24} fill={palette.brand[300]} fillOpacity={0.14} />
      <Circle cx={dotCx} cy={dotCy} r={dotR} fill="#ADE405" />
    </Svg>
  );
});

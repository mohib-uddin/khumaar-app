import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export const Lightning = memo(function Lightning({ size = 14, color = '#1D956E', ...rest }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...rest}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.91636 1.16663L8.90034 5.24995H11.817L4.68011 12.8333L6.27668 6.41663H3.94336L5.24965 1.16663H9.91636Z"
        fill={color}
      />
    </Svg>
  );
});

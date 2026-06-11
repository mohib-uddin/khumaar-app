import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { DoubleChin, Droplet, Moon, Sparkles, Sun } from '@/components/icons';
import { palette, radii } from '@/theme';

import type { RoutineIconKey } from './data';

type Props = {
  icon: RoutineIconKey;
  size?: number;
};

const ICON_SIZE = 28;

/** Muted ink-on-sunken palette — matches card chevrons and the warm canvas UI. */
const ICON_BG = palette.surface.sunken;
const ICON_COLOR = palette.ink[700];
const ICON_COLOR_SOFT = palette.ink[500];

const ICON_CONFIG: Record<
  RoutineIconKey,
  { background: string; color: string; render: (color: string) => ReactNode }
> = {
  morning: {
    background: ICON_BG,
    color: ICON_COLOR,
    render: (color) => <Sun size={ICON_SIZE} color={color} />,
  },
  night: {
    background: palette.surface.sunkenAlt,
    color: ICON_COLOR_SOFT,
    render: (color) => <Moon size={ICON_SIZE} color={color} />,
  },
  'facial-fitness': {
    background: ICON_BG,
    color: ICON_COLOR,
    render: (color) => <DoubleChin size={ICON_SIZE} color={color} />,
  },
  weekly: {
    background: palette.surface.sunkenAlt,
    color: ICON_COLOR_SOFT,
    render: (color) => <Sparkles size={ICON_SIZE} color={color} />,
  },
  midday: {
    background: ICON_BG,
    color: ICON_COLOR_SOFT,
    render: (color) => <Droplet size={ICON_SIZE} color={color} />,
  },
};

/** Circular routine thumbnail with a distinct icon per routine type. */
export function RoutineIcon({ icon, size = 64 }: Props) {
  const config = ICON_CONFIG[icon];

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: config.background,
        },
      ]}>
      {config.render(config.color)}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radii.pill,
  },
});

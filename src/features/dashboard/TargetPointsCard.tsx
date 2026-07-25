import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';

import { Acne, DoubleChin, Oiliness } from '@/components/icons';
import { Card, Pill, Text } from '@/components/ui';
import type { FocusPoint } from '@/lib/database.types';
import { palette, radii } from '@/theme';

import { SkinProgressRow } from './SkinProgressRow';

const ICON_SIZE = 30;
const ICONS = [Acne, Oiliness, DoubleChin] as const;

function HatchedConnector() {
  return (
    <Svg width={92} height={10} viewBox="0 0 92 10">
      <G stroke={palette.ink[700]} strokeWidth={1} strokeLinecap="round">
        {Array.from({ length: 14 }, (_, i) => (
          <Line key={i} x1={i * 6.5 + 1} y1={0} x2={i * 6.5 + 6} y2={10} />
        ))}
      </G>
    </Svg>
  );
}

function DottedConnector() {
  return (
    <Svg width={97} height={10} viewBox="0 0 97 10">
      <G fill={palette.brand[500]}>
        {Array.from({ length: 22 }, (_, i) => (
          <Circle key={i} cx={i * 4.4 + 2} cy={5 + (i % 2 === 0 ? -1 : 1)} r={1.4} />
        ))}
      </G>
    </Svg>
  );
}

type Props = {
  points: FocusPoint[];
};

/**
 * The big "Your Target Points" card. Requires live focus_points — no mock padding.
 */
export function TargetPointsCard({ points }: Props) {
  const slots = points.slice(0, 3);
  if (slots.length < 3) return null;

  const active = slots.find((p) => p.status === 'active') ?? slots[1];
  const [left, , right] = slots;

  return (
    <Card style={styles.card}>
      <View style={styles.section}>
        <Text variant="cardTitle" color="textPrimary">
          Your Target Points
        </Text>

        <View style={styles.timeline}>
          <View style={styles.activeColumn}>
            <Pill
              paddingX={10}
              paddingY={6}
              gradient={[palette.brand[300], '#FCFFF4']}
              gradientLocations={[0.020345, 0.98348]}>
              <Text variant="captionMedium" color={palette.ink[700]}>
                {active.label}
              </Text>
            </Pill>
            <View style={styles.activeStem} />
          </View>

          <View style={styles.endLabels}>
            <Text variant="captionMedium" color={palette.ink[300]}>
              {left.label}
            </Text>
            <Text variant="captionMedium" color={palette.ink[300]}>
              {right.label}
            </Text>
          </View>

          <View style={styles.iconsRow}>
            {slots.map((point, index) => {
              const Icon = ICONS[index] ?? Acne;
              const isActive = point.status === 'active';
              const isDone = point.status === 'done';
              return (
                <View key={point.key} style={styles.iconFrag}>
                  {index === 1 ? <HatchedConnector /> : null}
                  {index === 2 ? <DottedConnector /> : null}
                  <View
                    style={[
                      styles.iconBox,
                      isActive && styles.iconBoxDashed,
                      {
                        borderColor:
                          isDone || isActive ? palette.ink[900] : 'rgba(204, 204, 204, 0.8)',
                      },
                    ]}>
                    <Icon size={16} color={palette.ink[900]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <SkinProgressRow />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 14,
    gap: 22,
  },
  section: {
    gap: 12,
  },
  timeline: {
    height: 89,
    justifyContent: 'flex-end',
  },
  activeColumn: {
    position: 'absolute',
    top: 0,
    left: '38.5%',
    alignItems: 'center',
  },
  activeStem: {
    width: 1,
    height: 21,
    backgroundColor: palette.ink[700],
    marginTop: 4,
  },
  endLabels: {
    position: 'absolute',
    top: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  iconFrag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  iconBox: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: radii.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxDashed: {
    borderColor: palette.ink[900],
    borderStyle: 'dashed',
  },
});

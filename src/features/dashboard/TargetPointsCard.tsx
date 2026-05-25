import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';

import { Acne, DoubleChin, Oiliness } from '@/components/icons';
import { Card, Pill, Text } from '@/components/ui';
import { palette, radii } from '@/theme';

import { SkinProgressRow } from './SkinProgressRow';

const ICON_SIZE = 30;

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

/**
 * The big "Your Target Points" card. Contains the icon timeline at the top
 * and the inner "Skin" progress pill at the bottom.
 */
export function TargetPointsCard() {
  return (
    <Card style={styles.card}>
      <View style={styles.section}>
        <Text variant="cardTitle" color="textPrimary">
          Your Target Points
        </Text>

        <View style={styles.timeline}>
          <View style={styles.activeColumn}>
            <Pill paddingX={10} paddingY={6} gradient={[palette.brand[300], '#FCFFF4']}>
              <Text variant="captionMedium" color={palette.ink[700]}>
                Oiliness
              </Text>
            </Pill>
            <View style={styles.activeStem} />
          </View>

          <View style={styles.endLabels}>
            <Text variant="captionMedium" color={palette.ink[300]}>
              Acne
            </Text>
            <Text variant="captionMedium" color={palette.ink[300]}>
              Double Chin
            </Text>
          </View>

          <View style={styles.iconsRow}>
            <View style={[styles.iconBox, { borderColor: palette.ink[900] }]}>
              <Acne size={16} color={palette.ink[900]} />
            </View>

            <HatchedConnector />

            <View style={[styles.iconBox, styles.iconBoxDashed]}>
              <Oiliness size={16} color={palette.ink[900]} />
            </View>

            <DottedConnector />

            <View style={[styles.iconBox, { borderColor: 'rgba(204, 204, 204, 0.8)' }]}>
              <DoubleChin size={16} color={palette.ink[900]} />
            </View>
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

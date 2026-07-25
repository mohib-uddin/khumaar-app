import { StyleSheet, View } from 'react-native';

import { Button, Card, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

import { FITZPATRICK_TYPES, getFitzpatrickMeta } from './fitzpatrick';

type Props = {
  type: number | null | undefined;
  onScan?: () => void;
  /** Opens fashion / color compatibility sheet when phototype is known. */
  onPressColors?: () => void;
};

/**
 * Horizontal Fitzpatrick I–VI scale — Dashboard Card language, cosmetic estimate only.
 */
export function FitzpatrickScaleCard({ type, onScan, onPressColors }: Props) {
  const active = getFitzpatrickMeta(type);

  if (!active) {
    return (
      <Card style={styles.card}>
        <View style={styles.heading}>
          <Text variant="cardTitle" color="textPrimary">
            Skin phototype
          </Text>
          <Text variant="caption" color={palette.ink[300]}>
            Complete a scan to estimate your phototype
          </Text>
        </View>
        <View style={styles.track}>
          {FITZPATRICK_TYPES.map((item) => (
            <View key={item.type} style={styles.step}>
              <View style={[styles.swatch, styles.swatchMuted, { backgroundColor: item.swatch }]} />
              <Text variant="metricSm" color={palette.ink[300]}>
                {item.roman}
              </Text>
            </View>
          ))}
        </View>
        {onScan ? (
          <Button label="Start scan" variant="secondary" onPress={onScan} fullWidth />
        ) : null}
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.heading}>
        <Text variant="cardTitle" color="textPrimary">
          Skin phototype
        </Text>
        <Text variant="caption" color={palette.ink[300]}>
          Estimated from your latest scan · cosmetic only
        </Text>
      </View>

      <View style={styles.track}>
        {FITZPATRICK_TYPES.map((item) => {
          const selected = item.type === active.type;
          return (
            <View key={item.type} style={styles.step}>
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: item.swatch },
                  selected && styles.swatchActive,
                ]}
              />
              <Text
                variant="metricSm"
                color={selected ? palette.ink[900] : palette.ink[300]}>
                {item.roman}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.activeRow}>
        <Text variant="stepTitle" color="textPrimary">
          {`Type ${active.roman} · ${active.name}`}
        </Text>
        <Text variant="caption" color={palette.ink[300]}>
          {active.cue}
        </Text>
      </View>

      {onPressColors ? (
        <View style={styles.ctaBlock}>
          <Button
            label="Get my personal color edit"
            variant="secondary"
            onPress={onPressColors}
            fullWidth
          />
          <Text variant="caption" color={palette.ink[300]} style={styles.ctaCaption}>
            Stylist palette for your phototype
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: spacing.lg,
  },
  heading: {
    gap: spacing.xs,
  },
  track: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  swatch: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 44,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: palette.ink[100],
  },
  swatchMuted: {
    opacity: 0.45,
  },
  swatchActive: {
    borderWidth: 2.5,
    borderColor: palette.brand[500],
  },
  activeRow: {
    gap: spacing.xxs,
    paddingTop: spacing.xs,
  },
  ctaBlock: {
    gap: spacing.sm,
  },
  ctaCaption: {
    textAlign: 'center',
  },
});

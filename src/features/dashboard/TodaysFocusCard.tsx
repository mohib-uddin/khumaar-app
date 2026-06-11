import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Check, ChevronRight, MagicWand, Play } from '@/components/icons';
import { Card, Pill, PressableScale, Text } from '@/components/ui';
import { productRecommendations } from '@/features/skin-profile';
import { palette, radii, spacing } from '@/theme';

type Props = {
  onPressRoutine?: () => void;
  onPressExercise?: () => void;
  onPressProduct?: () => void;
};

/** Compact "what to do today" hub linking routines, exercises and products. */
export function TodaysFocusCard({ onPressRoutine, onPressExercise, onPressProduct }: Props) {
  const topProduct = productRecommendations[0];

  return (
    <Card style={styles.card}>
      <Text variant="cardTitle" color="textPrimary">
        Today&apos;s Focus
      </Text>

      <View style={styles.rows}>
        <FocusRow
          icon={<Check size={20} color={palette.ink[900]} />}
          title="Morning routine"
          subtitle="2 of 3 steps done"
          trailing={
            <Pill paddingX={10} paddingY={5} background={palette.brand[50]}>
              <Text variant="metricSm" color={palette.brand[700]}>
                67%
              </Text>
            </Pill>
          }
          onPress={onPressRoutine}
        />
        <FocusRow
          icon={<Play size={18} color={palette.ink[900]} />}
          title="Facial fitness"
          subtitle="Jawline session · 5 min"
          trailing={<ChevronRight size={20} color={palette.ink[400]} />}
          onPress={onPressExercise}
        />
        <FocusRow
          icon={<MagicWand size={18} color={palette.ink[900]} />}
          title={topProduct.name}
          subtitle={`Recommended · ${topProduct.concern}`}
          trailing={<ChevronRight size={20} color={palette.ink[400]} />}
          onPress={onPressProduct}
        />
      </View>
    </Card>
  );
}

type FocusRowProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  trailing: ReactNode;
  onPress?: () => void;
};

function FocusRow({ icon, title, subtitle, trailing, onPress }: FocusRowProps) {
  return (
    <PressableScale
      onPress={onPress}
      dim={false}
      pressedScale={0.98}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      style={styles.row}>
      <View style={styles.iconTile}>{icon}</View>
      <View style={styles.copy}>
        <Text variant="stepTitle" color="textPrimary" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="textTertiary" numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {trailing}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    gap: spacing.xl,
  },
  rows: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: palette.surface.sunken,
    borderRadius: radii.xl,
    padding: spacing.lg,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});

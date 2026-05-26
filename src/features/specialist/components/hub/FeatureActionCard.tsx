import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronEnter } from '@/components/icons';
import { Card, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

type Props = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress: () => void;
};

export function FeatureActionCard({ title, subtitle, icon, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cell, pressed && styles.pressed]}>
      <Card style={styles.card}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text variant="stepTitle" color="textPrimary" numberOfLines={2}>
          {title}
        </Text>
        <Text variant="caption" color="textTertiary" numberOfLines={2}>
          {subtitle}
        </Text>
        <View style={styles.arrow}>
          <ChevronEnter size={18} color={palette.ink[500]} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
  },
  pressed: {
    opacity: 0.92,
  },
  card: {
    minHeight: 148,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: palette.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  arrow: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
});

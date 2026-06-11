import { StyleSheet, View } from 'react-native';

import { ChevronRight } from '@/components/icons';
import { Card, PressableScale, Text } from '@/components/ui';
import { palette, spacing } from '@/theme';

export type ProfileAction = {
  id: string;
  label: string;
  caption: string;
  onPress?: () => void;
};

type Props = {
  actions: ProfileAction[];
};

/** Settings / preferences list rendered as a single grouped card. */
export function ProfileActions({ actions }: Props) {
  return (
    <Card style={styles.card}>
      {actions.map((action, index) => (
        <View key={action.id}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <PressableScale
            onPress={action.onPress}
            dim={false}
            pressedScale={0.99}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            style={styles.row}>
            <View style={styles.copy}>
              <Text variant="stepTitle" color="textPrimary">
                {action.label}
              </Text>
              <Text variant="caption" color="textTertiary">
                {action.caption}
              </Text>
            </View>
            <ChevronRight size={20} color={palette.ink[400]} />
          </PressableScale>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
});

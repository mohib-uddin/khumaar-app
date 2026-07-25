import { StyleSheet, View, type ViewStyle } from 'react-native';

import { palette, spacing } from '@/theme';

import { Button } from './Button';
import { Card } from './Card';
import { Text } from './Text';

type Props = {
  title: string;
  caption: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
  /** Match half-width dashboard cards (SkinHealth / Environment). */
  compact?: boolean;
};

/**
 * Honest empty placeholder — same Card shell as Dashboard, no decorative chrome.
 */
export function EmptyStateCard({
  title,
  caption,
  actionLabel,
  onAction,
  style,
  compact,
}: Props) {
  return (
    <Card style={[compact ? styles.compact : styles.full, style]}>
      <View style={styles.copy}>
        <Text variant="cardTitle" color="textPrimary">
          {title}
        </Text>
        <Text variant="caption" color={palette.ink[300]} style={styles.caption}>
          {caption}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Button
          label={actionLabel}
          variant="secondary"
          onPress={onAction}
          fullWidth
          style={styles.cta}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  full: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: spacing.lg,
  },
  compact: {
    width: '48.5%',
    height: 160,
    paddingVertical: 14,
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  copy: {
    gap: spacing.xs,
  },
  caption: {
    lineHeight: 18,
  },
  cta: {
    marginTop: spacing.xs,
  },
});

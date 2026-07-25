import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { PressableScale, Text } from '@/components/ui';
import { layout, palette, radii, spacing } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  progress?: ReactNode;
};

/** Shared chrome for onboarding screens — matches dashboard canvas + padding. */
export function OnboardingShell({ title, subtitle, children, footer, progress }: Props) {
  return (
    <View style={styles.root}>
      {progress ? <View style={styles.progress}>{progress}</View> : null}
      <View style={styles.header}>
        <Text variant="displayLg" color="textPrimary">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.body}>{children}</View>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

type SelectableCardProps = {
  label: string;
  helper?: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectableCard({ label, helper, selected, onPress }: SelectableCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.card, selected && styles.cardSelected]}>
      <Text variant="sectionTitle" color="textPrimary">
        {label}
      </Text>
      {helper ? (
        <Text variant="caption" color="textSecondary" style={styles.helper}>
          {helper}
        </Text>
      ) : null}
    </PressableScale>
  );
}

type ChipProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function ConcernChip({ label, selected, disabled, onPress }: ChipProps) {
  return (
    <PressableScale
      onPress={disabled && !selected ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        disabled && !selected && styles.chipDisabled,
      ]}>
      <Text
        variant="captionMedium"
        color={selected ? palette.ink[900] : 'textPrimary'}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.xxl,
    paddingBottom: spacing['4xl'],
  },
  progress: {
    marginBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.md,
    marginBottom: spacing['4xl'],
  },
  subtitle: {
    maxWidth: 340,
  },
  body: {
    flex: 1,
  },
  footer: {
    gap: spacing.lg,
    paddingTop: spacing.xxl,
  },
  card: {
    backgroundColor: palette.surface.raised,
    borderRadius: radii['2xl'],
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing['4xl'],
    borderWidth: 1.5,
    borderColor: palette.border.light,
    marginBottom: spacing.lg,
  },
  cardSelected: {
    borderColor: palette.brand[500],
    backgroundColor: palette.brand[50],
  },
  helper: {
    marginTop: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.pill,
    backgroundColor: palette.surface.raised,
    borderWidth: 1.5,
    borderColor: palette.border.light,
  },
  chipSelected: {
    backgroundColor: palette.brand[300],
    borderColor: palette.brand[500],
  },
  chipDisabled: {
    opacity: 0.4,
  },
});

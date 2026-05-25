import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { TonerStepIcon } from '@/components/icons';
import { Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

import type { HowToStep } from './data';

type Props = {
  title: string;
  description: string;
  howToLabel: string;
  steps: HowToStep[];
};

/**
 * Expanded active step with "How to do?" walkthrough — Figma node 0:476.
 */
export function RoutineStepExpanded({ title, description, howToLabel, steps }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.activeIcon}>
          <TonerStepIcon size={48} />
        </View>
        <View style={styles.copy}>
          <Text variant="stepTitle" color="textPrimary">
            {title}
          </Text>
          <Text variant="caption" color="textTertiary">
            {description}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text variant="stepTitle" color="textPrimary" style={styles.howToLabel}>
        {howToLabel}
      </Text>

      <View style={styles.stepsRow}>
        {steps.map((step) => (
          <View key={step.id} style={styles.stepColumn}>
            <View style={styles.stepImageWrap}>
              <Image source={step.image} style={styles.stepImage} contentFit="cover" />
            </View>
            <Text variant="metricSm" color="textTertiary" style={styles.stepCaption}>
              {step.caption}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const STEP_IMAGE = 54;

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.surface.sunken,
    borderRadius: radii['2xl'],
    minHeight: 217,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    paddingTop: spacing.base,
    paddingHorizontal: spacing.base,
  },
  activeIcon: {
    width: STEP_IMAGE,
    height: STEP_IMAGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: spacing.xxs,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
    marginTop: spacing.lg,
    marginHorizontal: spacing.base,
    opacity: 0.6,
  },
  howToLabel: {
    marginTop: spacing.lg,
    marginLeft: spacing.base,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  stepColumn: {
    width: 90,
    alignItems: 'center',
    gap: spacing.md,
  },
  stepImageWrap: {
    width: STEP_IMAGE,
    height: STEP_IMAGE,
    borderRadius: radii.pill,
    overflow: 'hidden',
    backgroundColor: palette.surface.sunken,
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  stepCaption: {
    textAlign: 'center',
  },
});

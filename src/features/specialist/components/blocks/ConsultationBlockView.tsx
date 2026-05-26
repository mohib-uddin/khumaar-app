import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ScanFace } from '@/components/icons';
import { Card, GradientIconButton, PressableScale, Text } from '@/components/ui';
import { SymptomMetricRow } from '@/features/skin-analysis/SymptomMetricRow';
import { palette, radii, spacing } from '@/theme';

import type { ConsultationBlock, TriageLevel } from '../../types';

const agentOrb = require('../../../../../assets/figma/tab-bar/agent-orb.png');
const userAvatar = require('../../../../../assets/figma/avatars/profile-main.png');

type Props = {
  block: ConsultationBlock;
  index: number;
  onScanPress: () => void;
  onTriageSelect: (level: TriageLevel) => void;
};

const enter = (index: number) =>
  FadeInDown.delay(60 + index * 55)
    .duration(360)
    .springify()
    .damping(16);

const TRIAGE_OPTIONS: { level: TriageLevel; label: string }[] = [
  { level: 'routine', label: 'Routine care' },
  { level: 'monitor', label: 'Monitor' },
  { level: 'dermatologist', label: 'See dermatologist' },
];

function SpecialistRow({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.specialistRow}>
      <Image source={agentOrb} style={styles.orbAvatar} contentFit="contain" />
      <View style={styles.specialistContent}>{children}</View>
    </View>
  );
}

export function ConsultationBlockView({ block, index, onScanPress, onTriageSelect }: Props) {
  const router = useRouter();

  switch (block.type) {
    case 'user':
      return (
        <Animated.View entering={enter(index)} style={styles.userRow}>
          <View style={styles.userBubble}>
            <Text variant="body" color="textPrimary">
              {block.text}
            </Text>
          </View>
          <Image source={userAvatar} style={styles.userAvatar} contentFit="cover" />
        </Animated.View>
      );

    case 'specialist':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <View style={styles.msgBubble}>
              <Text variant="body" color="textPrimary">
                {block.text}
              </Text>
            </View>
          </SpecialistRow>
        </Animated.View>
      );

    case 'insight':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <Card style={styles.cardBubble}>
              <Text variant="captionMedium" color={palette.accent.success}>
                {block.title}
              </Text>
              <Text variant="body" color="textPrimary" style={styles.gapTop}>
                {block.body}
              </Text>
              {block.highlight ? (
                <Text variant="emphasizedItalic" color="textSecondary" style={styles.gapTop}>
                  {block.highlight}
                </Text>
              ) : null}
            </Card>
          </SpecialistRow>
        </Animated.View>
      );

    case 'scan_prompt':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <Card style={styles.cardBubble}>
              <Text variant="cardTitle" color="textPrimary">
                Quick face scan
              </Text>
              <Text variant="caption" color="textTertiary" style={styles.gapTop}>
                I'll compare with your last results.
              </Text>
              <GradientIconButton
                size={48}
                accessibilityLabel="Start scan"
                onPress={onScanPress}
                style={styles.gapTop}>
                <ScanFace size={22} color={palette.ink[900]} />
              </GradientIconButton>
            </Card>
          </SpecialistRow>
        </Animated.View>
      );

    case 'scan_analyzing':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <Card style={styles.cardBubble}>
              <Text variant="cardTitle" color="textPrimary">
                Analyzing…
              </Text>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.skeletonBar, styles.gapTop]} />
              ))}
            </Card>
          </SpecialistRow>
        </Animated.View>
      );

    case 'scan_result':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <Card style={styles.cardBubble}>
              <Text variant="cardTitle" color="textPrimary">
                Scan summary
              </Text>
              <Text variant="caption" color="textTertiary" style={styles.gapTop}>
                {block.summary}
              </Text>
              <View style={[styles.metrics, styles.gapTop]}>
                {block.metrics.map((m, mi) => (
                  <SymptomMetricRow key={m.id} metric={m} index={mi} />
                ))}
              </View>
            </Card>
          </SpecialistRow>
        </Animated.View>
      );

    case 'routine_suggestion':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <Card style={styles.cardBubble}>
              <Text variant="cardTitle" color="textPrimary">
                Suggested changes
              </Text>
              {block.changes.map((c) => (
                <Text key={c} variant="body" color="textPrimary" style={styles.gapTop}>
                  · {c}
                </Text>
              ))}
            </Card>
          </SpecialistRow>
        </Animated.View>
      );

    case 'safety':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <Card
              style={[
                styles.cardBubble,
                block.level === 'dermatologist' && styles.safetyUrgent,
              ]}>
              <Text variant="body" color="textPrimary">
                {block.message}
              </Text>
            </Card>
          </SpecialistRow>
        </Animated.View>
      );

    case 'deep_link':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <PressableScale onPress={() => router.push(block.href)}>
              <Card style={styles.cardBubble}>
                <Text variant="stepTitle" color="textPrimary">
                  {block.title}
                </Text>
                <Text variant="caption" color="textTertiary" style={styles.gapTop}>
                  {block.subtitle}
                </Text>
              </Card>
            </PressableScale>
          </SpecialistRow>
        </Animated.View>
      );

    case 'triage':
      return (
        <Animated.View entering={enter(index)}>
          <SpecialistRow>
            <View style={styles.triageWrap}>
              <Text variant="caption" color="textTertiary">
                How urgent?
              </Text>
              <View style={styles.triageRow}>
                {TRIAGE_OPTIONS.map((opt) => {
                  const selected = block.selected === opt.level;
                  return (
                    <Pressable
                      key={opt.level}
                      disabled={!!block.selected}
                      onPress={() => onTriageSelect(opt.level)}
                      style={[styles.triageChip, selected && styles.triageOn]}>
                      <Text variant="captionMedium" color={selected ? palette.ink[900] : 'textSecondary'}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </SpecialistRow>
        </Animated.View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingLeft: spacing['5xl'],
  },
  userBubble: {
    backgroundColor: palette.brand[100],
    borderRadius: radii['2xl'],
    borderTopRightRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    maxWidth: '82%',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
  },
  specialistRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingRight: spacing.xl,
  },
  orbAvatar: {
    width: 36,
    height: 36,
  },
  specialistContent: {
    flex: 1,
  },
  msgBubble: {
    backgroundColor: palette.white,
    borderRadius: radii['2xl'],
    borderTopLeftRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    ...{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  },
  cardBubble: {
    padding: spacing.lg,
    flex: 1,
  },
  gapTop: {
    marginTop: spacing.sm,
  },
  metrics: {
    gap: spacing.lg,
  },
  skeletonBar: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: palette.ink[100],
    width: '100%',
  },
  safetyUrgent: {
    backgroundColor: palette.accent.warningSoft,
    borderWidth: 1,
    borderColor: palette.accent.warning,
  },
  triageWrap: {
    flex: 1,
    gap: spacing.sm,
  },
  triageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  triageChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.ink[100],
  },
  triageOn: {
    backgroundColor: palette.brand[100],
    borderColor: palette.brand[500],
  },
});

import { StyleSheet, View } from 'react-native';

import { Check } from '@/components/icons';
import { Card, Pill, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

import type { RoadmapPhase } from '../data';

type Props = {
  phases: RoadmapPhase[];
};

/** Vertical milestone roadmap — done / active / upcoming phases. */
export function RoadmapTimeline({ phases }: Props) {
  return (
    <View style={styles.wrap}>
      {phases.map((phase, index) => (
        <PhaseRow key={phase.id} phase={phase} last={index === phases.length - 1} />
      ))}
    </View>
  );
}

function PhaseRow({ phase, last }: { phase: RoadmapPhase; last: boolean }) {
  const isActive = phase.status === 'active';
  const isDone = phase.status === 'done';

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.node,
            isDone && styles.nodeDone,
            isActive && styles.nodeActive,
            !isDone && !isActive && styles.nodeUpcoming,
          ]}>
          {isDone ? <Check size={14} color={palette.ink[900]} /> : null}
          {isActive ? <View style={styles.nodeActiveDot} /> : null}
        </View>
        {last ? null : <View style={styles.line} />}
      </View>

      <Card
        elevation={isActive ? 'card' : 'none'}
        background={isActive ? palette.surface.raised : palette.surface.sunken}
        style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text variant="caption" color="textTertiary">
              {phase.month}
            </Text>
            <Text variant="routineTitle" color="textPrimary">
              {phase.title}
            </Text>
          </View>
          <Pill
            paddingX={10}
            paddingY={5}
            background={isActive ? palette.brand[50] : 'transparent'}>
            <Text
              variant="metricSm"
              color={isActive ? palette.brand[700] : palette.ink[300]}>
              {isDone ? 'Done' : isActive ? 'In progress' : 'Upcoming'}
            </Text>
          </Pill>
        </View>

        <View style={styles.chips}>
          {phase.focus.map((item) => (
            <Pill key={item} paddingX={10} paddingY={5} background={palette.white}>
              <Text variant="metricSm" color={palette.ink[700]}>
                {item}
              </Text>
            </Pill>
          ))}
        </View>

        {isActive ? (
          <>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${phase.progress}%` }]} />
            </View>
            <View style={styles.actionRow}>
              <Text variant="caption" color="textSecondary" style={styles.actionText}>
                {`This week: ${phase.weeklyAction}`}
              </Text>
              <Text variant="captionMedium" color={palette.brand[700]}>
                {`${phase.progress}%`}
              </Text>
            </View>
          </>
        ) : (
          <Text variant="caption" color="textTertiary">
            {phase.targets.join(' · ')}
          </Text>
        )}
      </Card>
    </View>
  );
}

const NODE = 28;

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  rail: {
    alignItems: 'center',
    width: NODE,
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: palette.brand[300],
  },
  nodeActive: {
    backgroundColor: palette.white,
    borderWidth: 2,
    borderColor: palette.brand[500],
  },
  nodeActiveDot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: palette.brand[500],
  },
  nodeUpcoming: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.ink[200],
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: spacing.xs,
    backgroundColor: palette.ink[100],
  },
  card: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerCopy: {
    gap: spacing.xxs,
    flexShrink: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: palette.surface.sunkenAlt,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: palette.brand[500],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionText: {
    flex: 1,
  },
});

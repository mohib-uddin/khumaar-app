import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import { ChevronRight } from '@/components/icons';
import { AwarenessTag, Card, PressableScale, Text } from '@/components/ui';
import { awarenessTags, symptomMetrics } from '@/features/skin-analysis/data';
import { SymptomMetricRow } from '@/features/skin-analysis/SymptomMetricRow';
import {
  HighlightRow,
  MetricGroup,
  SkinHealthAnalysis,
  facialRatios,
  scanSummary,
  skinMetrics,
} from '@/features/skin-profile';
import { palette, spacing } from '@/theme';

import { ProfileScanPreview } from './ProfileScanPreview';
import { ProfileSegmentTabs } from './ProfileSegmentTabs';

type ProfileAnalysisTab = 'overview' | 'symptoms' | 'face';
type FaceView = 'front' | 'side';

const PROFILE_ANALYSIS_TABS = [
  { value: 'overview' as const, label: 'Overview' },
  { value: 'symptoms' as const, label: 'Symptoms' },
  { value: 'face' as const, label: 'Face' },
] as const;

const FACE_VIEW_OPTIONS = [
  { value: 'front' as const, label: 'Front' },
  { value: 'side' as const, label: 'Side' },
] as const;

type Props = {
  onViewScans: () => void;
};

/** Tabbed analysis on profile — overview, symptoms, and face ratios with scan imagery. */
export function ProfileAnalysisSection({ onViewScans }: Props) {
  const [tab, setTab] = useState<ProfileAnalysisTab>('overview');
  const [faceView, setFaceView] = useState<FaceView>('front');

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="sectionTitle" color="textPrimary">
          Your Analysis
        </Text>
        <PressableScale
          onPress={onViewScans}
          dim={false}
          pressedScale={0.98}
          accessibilityRole="button"
          accessibilityLabel="View scans"
          style={styles.scanLink}>
          <Text variant="captionMedium" color={palette.brand[700]}>
            View scans
          </Text>
          <ChevronRight size={16} color={palette.brand[700]} />
        </PressableScale>
      </View>

      <ProfileSegmentTabs
        options={PROFILE_ANALYSIS_TABS}
        value={tab}
        onChange={setTab}
        accessibilityLabel="Analysis sections"
      />

      <Animated.View key={`${tab}-${tab === 'face' ? faceView : ''}`} entering={FadeInDown.duration(280).springify()}>
        {tab === 'overview' ? <OverviewPanel /> : null}
        {tab === 'symptoms' ? <SymptomsPanel /> : null}
        {tab === 'face' ? (
          <FacePanel view={faceView} onViewChange={setFaceView} />
        ) : null}
      </Animated.View>
    </View>
  );
}

function OverviewPanel() {
  return (
    <View style={styles.panel}>
      <Card style={styles.insightCard}>
        <Text variant="cardTitle" color="textPrimary">
          Latest insight
        </Text>
        <View style={styles.insightBody}>
          <Text variant="body" color="textSecondary" style={styles.insightText}>
            {scanSummary.headline}
          </Text>
        </View>
        <View style={styles.insightMeta}>
          <MetricPill label="Improving" value={scanSummary.topImprovement} emphasis="success" />
          <MetricPill label="Focus" value={scanSummary.topConcern} emphasis="warning" />
        </View>
      </Card>

      <SkinHealthAnalysis metrics={skinMetrics} />
    </View>
  );
}

function SymptomsPanel() {
  return (
    <View style={styles.panel}>
      <Card style={styles.metricsCard}>
        {symptomMetrics.map((metric, index) => (
          <Animated.View
            key={metric.id}
            layout={LinearTransition.springify()}
            style={index > 0 ? styles.metricWithDivider : undefined}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <SymptomMetricRow metric={metric} index={index} />
          </Animated.View>
        ))}
      </Card>

      <Card style={styles.tagsCard}>
        <Text variant="cardTitle" color="textPrimary">
          Triggers to watch
        </Text>
        <View style={styles.tags}>
          {awarenessTags.map((tag) => (
            <AwarenessTag key={tag} label={tag} />
          ))}
        </View>
      </Card>
    </View>
  );
}

function FacePanel({
  view,
  onViewChange,
}: {
  view: FaceView;
  onViewChange: (view: FaceView) => void;
}) {
  const groups = view === 'front' ? facialRatios.front : facialRatios.side;

  return (
    <View style={styles.panel}>
      <ProfileScanPreview view={view} capturedLabel={scanSummary.capturedLabel} />

      <ProfileSegmentTabs
        options={FACE_VIEW_OPTIONS}
        value={view}
        onChange={onViewChange}
        accessibilityLabel="Front or side scan"
      />

      <View style={styles.ratioSummary}>
        <RatioStat value={facialRatios.score.front.toFixed(1)} label="Front" />
        <View style={styles.ratioDivider} />
        <RatioStat value={facialRatios.score.side.toFixed(1)} label="Side" />
        <View style={styles.ratioDivider} />
        <RatioStat
          value={facialRatios.score.overall.toFixed(1)}
          label="Overall"
          emphasis
        />
      </View>

      <Card style={styles.metricsCard}>
        {groups.map((group, index) => (
          <Animated.View
            key={`${view}-${group.id}`}
            layout={LinearTransition.springify()}
            style={index > 0 ? styles.metricWithDivider : undefined}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <MetricGroup group={group} defaultOpen={index === 0} />
          </Animated.View>
        ))}
      </Card>

      <Card style={styles.highlightsCard}>
        <View style={styles.highlightGroup}>
          <Text variant="stepTitle" color="textPrimary">
            Strengths
          </Text>
          {facialRatios.strengths.slice(0, 2).map((highlight, index) => (
            <HighlightRow key={highlight.id} highlight={highlight} index={index} />
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.highlightGroup}>
          <Text variant="stepTitle" color="textPrimary">
            Focus
          </Text>
          {facialRatios.improvements.slice(0, 2).map((highlight, index) => (
            <HighlightRow key={highlight.id} highlight={highlight} index={index} />
          ))}
        </View>
      </Card>
    </View>
  );
}

function MetricPill({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis: 'success' | 'warning';
}) {
  const color = emphasis === 'success' ? palette.accent.success : palette.accent.warning;

  return (
    <View style={styles.metricPill}>
      <Text variant="metricSm" color={palette.ink[400]}>
        {label}
      </Text>
      <Text variant="captionMedium" color={color} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function RatioStat({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.ratioStat}>
      <Text variant="metricLg" color={emphasis ? palette.brand[700] : 'textPrimary'}>
        {value}
      </Text>
      <Text variant="caption" color="textTertiary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  scanLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  panel: {
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  insightCard: {
    padding: 14,
    gap: spacing.lg,
  },
  insightBody: {
    backgroundColor: palette.surface.sunken,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  insightText: {
    lineHeight: 20,
  },
  insightMeta: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  metricPill: {
    flex: 1,
    gap: spacing.xs,
    backgroundColor: palette.surface.sunken,
    borderRadius: 16,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  metricsCard: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  metricWithDivider: {
    gap: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: palette.ink[100],
  },
  tagsCard: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.base,
  },
  ratioSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.surface.raised,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  ratioStat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratioDivider: {
    width: 1,
    height: 28,
    backgroundColor: palette.ink[100],
  },
  highlightsCard: {
    padding: spacing.xxl,
    gap: spacing.xxl,
  },
  highlightGroup: {
    gap: spacing.xxl,
  },
});

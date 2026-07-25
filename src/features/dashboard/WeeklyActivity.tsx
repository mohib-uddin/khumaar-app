import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { DotMarker } from '@/components/icons';
import { Avatar, Text } from '@/components/ui';
import { brandGradientBar, layout, palette, radii, shadows, spacing, springs } from '@/theme';

import { weeklyActivity, type ActivityDay } from './data';

const SMALL_AVATAR = require('@/assets/figma/avatars/profile-small.png');

const BAR_GAP = 5;
const MAX_BAR_HEIGHT = 69;
const SELECTED_GRADIENT_HEIGHT = 22;

/** Figma node 5:261 — 178.4° linear gradient with explicit stops. */
const SELECTED_BAR_GRADIENT = brandGradientBar;
const CHART_HEIGHT = 110;
const DIVIDER_Y = 40;

type BarProps = {
  height: number;
  highlighted?: boolean;
  marker?: 'avatar' | 'indicator';
  label: string;
  index: number;
  avatarSource: { uri: string } | number;
};

function ActivityBar({ height, highlighted, marker, label, index, avatarSource }: BarProps) {
  const heightAnim = useSharedValue(0);

  useEffect(() => {
    heightAnim.value = withDelay(80 * index, withSpring(height, springs.bounce));
  }, [height, heightAnim, index]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }));

  return (
    <View style={styles.barColumn}>
      {marker === 'avatar' ? (
        <Avatar source={avatarSource} size={26} ringWidth={1} style={styles.markerAvatar} />
      ) : null}

      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: highlighted ? palette.ink[900] : '#FFFFFF' },
          animatedBarStyle,
        ]}>
        {highlighted ? (
          <LinearGradient
            colors={[...SELECTED_BAR_GRADIENT.colors]}
            locations={[...SELECTED_BAR_GRADIENT.locations]}
            start={SELECTED_BAR_GRADIENT.start}
            end={SELECTED_BAR_GRADIENT.end}
            style={styles.barGradient}
          />
        ) : null}
        <Text
          variant={highlighted ? 'caption' : 'overline'}
          style={[
            styles.barLabel,
            highlighted && styles.barLabelActive,
            { color: highlighted ? '#FFFFFF' : palette.ink[500] },
          ]}>
          {label}
        </Text>
      </Animated.View>
    </View>
  );
}

type Props = {
  days?: ActivityDay[];
  nextScanLabel?: string;
  avatarUri?: string | null;
};

export function WeeklyActivity({
  days = weeklyActivity,
  nextScanLabel = 'Sat',
  avatarUri,
}: Props) {
  const avatarSource = avatarUri ? { uri: avatarUri } : SMALL_AVATAR;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <View style={styles.divider} />

        <View style={styles.cursor}>
          <Avatar source={avatarSource} size={30} ringWidth={1} />
          <DotMarker size={14} />
        </View>

        <View style={styles.bars}>
          {days.map((day, index) => (
            <ActivityBar
              key={day.key}
              label={day.label}
              height={day.height}
              highlighted={day.highlighted}
              marker={day.marker}
              index={index}
              avatarSource={avatarSource}
            />
          ))}
        </View>
      </View>

      <Text variant="body" color={palette.ink[300]} style={styles.caption}>
        {'Your next AI scan is scheduled for '}
        <Text variant="bodyEmphasis" color={palette.accent.info}>
          {nextScanLabel}
        </Text>
        {'. Keep the streak going.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chart: {
    height: CHART_HEIGHT,
    width: '100%',
  },
  divider: {
    position: 'absolute',
    top: DIVIDER_Y,
    left: -layout.screenPaddingX,
    right: -layout.screenPaddingX,
    height: 1,
    backgroundColor: palette.ink[100],
  },
  cursor: {
    position: 'absolute',
    right: 6,
    top: 0,
    alignItems: 'center',
    gap: 3,
    zIndex: 1,
  },
  bars: {
    position: 'absolute',
    top: DIVIDER_Y + 1,
    left: 0,
    right: 0,
    height: MAX_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: BAR_GAP,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  bar: {
    width: '100%',
    borderRadius: radii.md,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.soft,
  },
  barGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: SELECTED_GRADIENT_HEIGHT,
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
  },
  barLabel: {
    fontSize: 12,
  },
  barLabelActive: {
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  markerAvatar: {
    marginBottom: 3,
  },
  caption: {
    marginTop: spacing.xxl,
    // Must fit the inline 19px bodyEmphasis ("3X") without clipping.
    lineHeight: 24,
  },
});

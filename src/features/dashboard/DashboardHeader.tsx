import { StyleSheet, View } from 'react-native';

import { Bell, MagicWand, ScanFace } from '@/components/icons';
import { Avatar, IconButton, PressableScale } from '@/components/ui';
import { palette, spacing } from '@/theme';

const PROFILE_AVATAR = require('@/assets/figma/avatars/profile-main.png');

type Props = {
  onPressMagic?: () => void;
  onPressScan?: () => void;
  onPressBell?: () => void;
  onPressAvatar?: () => void;
};

/**
 * Top-of-screen row: the user's avatar (with the soft elevation treatment from
 * the design) on the left, three quick-action chips on the right.
 */
export function DashboardHeader({
  onPressMagic,
  onPressScan,
  onPressBell,
  onPressAvatar,
}: Props) {
  return (
    <View style={styles.row}>
      <PressableScale
        onPress={onPressAvatar}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        pressedScale={0.92}>
        <Avatar source={PROFILE_AVATAR} size={56} ringWidth={2} />
      </PressableScale>

      <View style={styles.actions}>
        <IconButton
          variant="highlight"
          accessibilityLabel="AI suggestions"
          onPress={onPressMagic}>
          <MagicWand size={22} color={palette.ink[900]} />
        </IconButton>
        <IconButton accessibilityLabel="Scan face" onPress={onPressScan}>
          <ScanFace size={22} color={palette.ink[900]} />
        </IconButton>
        <IconButton accessibilityLabel="Notifications" onPress={onPressBell}>
          <Bell size={22} color={palette.ink[900]} />
        </IconButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

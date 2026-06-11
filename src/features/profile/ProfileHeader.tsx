import { StyleSheet, View } from 'react-native';

import { ScanFace } from '@/components/icons';
import { Avatar, IconButton } from '@/components/ui';
import { palette, spacing } from '@/theme';

const PROFILE_AVATAR = require('@/assets/figma/avatars/profile-main.png');

type Props = {
  onPressScans?: () => void;
};

/** Profile top bar — avatar and scan access, aligned with the dashboard header. */
export function ProfileHeader({ onPressScans }: Props) {
  return (
    <View style={styles.row}>
      <Avatar source={PROFILE_AVATAR} size={56} ringWidth={2} />

      <View style={styles.actions}>
        <IconButton accessibilityLabel="View scans" onPress={onPressScans}>
          <ScanFace size={22} color={palette.ink[900]} />
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

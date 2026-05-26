import { StyleSheet, View } from 'react-native';

import { ArrowLeft, Bell } from '@/components/icons';
import { IconButton } from '@/components/ui';
import { layout, spacing } from '@/theme';

type Props = {
  onBack: () => void;
};

export function SpecialistHubHeader({ onBack }: Props) {
  return (
    <View style={styles.row}>
      <IconButton size={44} accessibilityLabel="Go back" onPress={onBack}>
        <ArrowLeft size={20} />
      </IconButton>
      <IconButton size={44} accessibilityLabel="Notifications" onPress={() => {}}>
        <Bell size={20} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.sm,
  },
});

import { StyleSheet, View } from 'react-native';

import { ArrowLeft } from '@/components/icons';
import { IconButton, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

type Props = {
  title: string;
  onBack: () => void;
};

export function SpecialistChatHeader({ title, onBack }: Props) {
  return (
    <View style={styles.bar}>
      <IconButton size={50} accessibilityLabel="Back" onPress={onBack}>
        <ArrowLeft size={22} />
      </IconButton>
      <Text variant="sectionTitle" color="textPrimary" numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: 'transparent',
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 50,
  },
});

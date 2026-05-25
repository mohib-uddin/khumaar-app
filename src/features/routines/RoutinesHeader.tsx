import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ArrowLeft, Plus } from '@/components/icons';
import { IconButton, Text } from '@/components/ui';
import { spacing } from '@/theme';

type Props = {
  title?: string;
  onPressAdd?: () => void;
};

/**
 * Top bar: back chevron, centred title, add button.
 * Mirrors Figma node 0:419 on the Your Routines frame.
 */
export function RoutinesHeader({ title = 'Your Routines', onPressAdd }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/');
    }
  };

  return (
    <View style={styles.row}>
      <IconButton
        size={50}
        accessibilityLabel="Go back"
        onPress={handleBack}>
        <ArrowLeft size={22} />
      </IconButton>

      <Text variant="sectionTitle" color="textPrimary">
        {title}
      </Text>

      <IconButton size={50} accessibilityLabel="Add routine" onPress={onPressAdd}>
        <Plus size={22} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

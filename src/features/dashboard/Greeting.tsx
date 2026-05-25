import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

type Props = {
  name: string;
};

export function Greeting({ name }: Props) {
  return (
    <View style={styles.wrap}>
      <Text variant="displayLg" color="textPrimary">
        {`Hello ${name},`}
      </Text>
      <Text variant="displaySm" color="textPrimary">
        {`Here's What's your `}
        <Text variant="emphasizedItalic" color="textPrimary">
          progress
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.base,
  },
});

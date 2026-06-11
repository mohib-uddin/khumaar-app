import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';

type Props = {
  name: string;
};

/** Profile headline — matches the dashboard greeting rhythm. */
export function ProfileGreeting({ name }: Props) {
  return (
    <View style={styles.wrap}>
      <Text variant="displayLg" color="textPrimary">
        {`Hello ${name},`}
      </Text>
      <Text variant="displaySm" color="textPrimary">
        {`Here's your `}
        <Text variant="emphasizedItalic" color="textPrimary">
          skin profile
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

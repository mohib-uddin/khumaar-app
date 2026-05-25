import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Screen, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

export default function RitualsScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(360)} style={styles.content}>
          <Text variant="displayLg" color="textPrimary">
            Daily Rituals
          </Text>
          <Text variant="bodyLarge" color="textSecondary" style={styles.subtitle}>
            Your personalised skincare schedule will appear here.
          </Text>
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingX,
    justifyContent: 'center',
  },
  content: {
    gap: spacing.lg,
  },
  subtitle: {
    maxWidth: 280,
  },
});

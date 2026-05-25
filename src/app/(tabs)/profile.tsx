import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Avatar, Screen, Text } from '@/components/ui';
import { layout, spacing } from '@/theme';

const PROFILE_AVATAR = require('@/assets/figma/avatars/profile-main.png');

export default function ProfileScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(360)} style={styles.content}>
          <Avatar source={PROFILE_AVATAR} size={88} ringWidth={3} />
          <Text variant="displayLg" color="textPrimary">
            Micy
          </Text>
          <Text variant="bodyLarge" color="textSecondary">
            Profile, settings and preferences will live here.
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
    alignItems: 'center',
  },
  content: {
    gap: spacing.lg,
    alignItems: 'center',
  },
});

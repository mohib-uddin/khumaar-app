import { Stack } from 'expo-router';

import { palette } from '@/theme';

export default function RitualsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.surface.canvas },
        animation: 'slide_from_right',
        animationDuration: 280,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="exercise/[id]" />
    </Stack>
  );
}

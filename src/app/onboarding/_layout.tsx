import { Stack } from 'expo-router';

import { palette } from '@/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.surface.canvas },
        animation: 'slide_from_right',
        animationDuration: 280,
        gestureEnabled: false,
      }}
    />
  );
}

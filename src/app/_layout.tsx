import {
  PlusJakartaSans_300Light,
  PlusJakartaSans_300Light_Italic,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_400Regular_Italic,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_500Medium_Italic,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_600SemiBold_Italic,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { palette } from '@/theme';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore — already hidden */
});

function RootStack() {
  const { name } = useTheme();
  return (
    <>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.surface.canvas },
          animation: 'slide_from_right',
          animationDuration: 280,
        }}>
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakarta_300Light: PlusJakartaSans_300Light,
    PlusJakarta_300Light_Italic: PlusJakartaSans_300Light_Italic,
    PlusJakarta_400Regular: PlusJakartaSans_400Regular,
    PlusJakarta_400Regular_Italic: PlusJakartaSans_400Regular_Italic,
    PlusJakarta_500Medium: PlusJakartaSans_500Medium,
    PlusJakarta_500Medium_Italic: PlusJakartaSans_500Medium_Italic,
    PlusJakarta_600SemiBold: PlusJakartaSans_600SemiBold,
    PlusJakarta_600SemiBold_Italic: PlusJakartaSans_600SemiBold_Italic,
    PlusJakarta_700Bold: PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {
        /* noop */
      });
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: palette.surface.canvas }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* The Figma source is a strictly light-mode design — pin the theme
            until the dark variant is approved. */}
        <ThemeProvider override="light">
          <RootStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

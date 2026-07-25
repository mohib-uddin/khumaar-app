import { Redirect, type Href } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuth, routeForStep } from '@/features/onboarding';
import { palette } from '@/theme';

/**
 * Entry redirect: welcome/auth → onboarding steps → tabs when done.
 */
export default function Index() {
  const { loading, session, profile, configured } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.surface.canvas,
        }}>
        <ActivityIndicator color={palette.brand[700]} />
      </View>
    );
  }

  if (!configured || !session) {
    return <Redirect href="/onboarding" />;
  }

  const step = profile?.onboarding_step ?? 'consent';
  if (step === 'done') {
    return <Redirect href="/(tabs)" />;
  }

  if (step === 'welcome' || step === 'auth') {
    return <Redirect href="/onboarding/consent" />;
  }

  return <Redirect href={routeForStep(step) as Href} />;
}

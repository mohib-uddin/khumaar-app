import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { getSupabase } from '@/lib/supabase';
import { palette } from '@/theme';

/**
 * OAuth deep-link landing: khumaar://auth/callback
 * Session is usually already set by the auth browser handoff in api.ts.
 */
export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        router.replace('/onboarding/auth');
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/');
        return;
      }

      router.replace('/onboarding/auth');
    };
    void run();
  }, [router]);

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

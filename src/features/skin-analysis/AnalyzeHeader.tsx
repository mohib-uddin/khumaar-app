import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeft } from '@/components/icons';
import { IconButton } from '@/components/ui';
import { layout, spacing } from '@/theme';

/**
 * Floating back control for the Skin Analysis screen (Figma top bar).
 */
export function AnalyzeHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.bar, { paddingTop: insets.top + spacing.sm }]}>
      <IconButton size={50} accessibilityLabel="Go back" onPress={handleBack}>
        <ArrowLeft size={22} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: layout.screenPaddingX,
    alignItems: 'flex-start',
  },
});

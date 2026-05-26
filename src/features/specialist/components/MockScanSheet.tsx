import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScanFace } from '@/components/icons';
import { Card, GradientIconButton, Text } from '@/components/ui';
import { layout, palette, radii, spacing } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCapture: () => void;
};

export function MockScanSheet({ visible, onClose, onCapture }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text variant="sectionTitle" color="textPrimary">
            Skin scan
          </Text>
          <Text variant="body" color="textTertiary" style={styles.copy}>
            Take or upload a photo — I'll analyze it against your profile (mock).
          </Text>

          <Card style={styles.preview}>
            <View style={styles.previewInner}>
              <ScanFace size={48} color={palette.ink[300]} />
              <Text variant="caption" color="textTertiary">
                Camera preview (mock)
              </Text>
            </View>
          </Card>

          <View style={styles.actions}>
            <GradientIconButton
              size={56}
              accessibilityLabel="Capture photo"
              onPress={onCapture}>
              <ScanFace size={24} color={palette.ink[900]} />
            </GradientIconButton>
            <Pressable onPress={onCapture} style={styles.galleryBtn}>
              <Text variant="captionMedium" color="textPrimary">
                Choose from gallery
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16, 16, 16, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: palette.surface.canvas,
    borderTopLeftRadius: radii['3xl'],
    borderTopRightRadius: radii['3xl'],
    paddingHorizontal: layout.screenPaddingX,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.ink[200],
    marginBottom: spacing.xs,
  },
  copy: {
    marginTop: -spacing.sm,
  },
  preview: {
    minHeight: 160,
    justifyContent: 'center',
  },
  previewInner: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing['5xl'],
  },
  actions: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  galleryBtn: {
    paddingVertical: spacing.md,
  },
});

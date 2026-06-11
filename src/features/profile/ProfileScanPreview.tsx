import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Card, Pill, Text } from '@/components/ui';
import { palette, radii, spacing } from '@/theme';

const FACE_SCAN = require('@/assets/figma/skin-analysis/face-scan.png');
const DETECTION_OVERLAY = require('@/assets/figma/skin-analysis/detection-overlay.png');
const MESH_LEFT = require('@/assets/figma/skin-analysis/mesh-left.svg');

type ScanView = 'front' | 'side';

type Props = {
  view: ScanView;
  capturedLabel: string;
};

/** Compact scan preview for profile face analysis — portrait with detection mesh. */
export function ProfileScanPreview({ view, capturedLabel }: Props) {
  const isFront = view === 'front';

  return (
    <Card style={styles.card} radius="2xl">
      <View style={styles.frame}>
        <Image
          source={FACE_SCAN}
          style={[styles.photo, !isFront && styles.photoSide]}
          contentFit="cover"
          contentPosition={isFront ? 'center' : 'left center'}
          transition={200}
        />

        {isFront ? (
          <Image
            source={DETECTION_OVERLAY}
            style={styles.overlay}
            contentFit="contain"
            transition={200}
          />
        ) : (
          <Image
            source={MESH_LEFT}
            style={styles.sideMesh}
            contentFit="contain"
            transition={200}
          />
        )}

        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.meta}>
          <Pill paddingX={10} paddingY={5} background="rgba(255, 255, 255, 0.92)">
            <Text variant="captionMedium" color={palette.ink[700]}>
              {isFront ? 'Front scan' : 'Side scan'}
            </Text>
          </Pill>
          <Pill paddingX={10} paddingY={5} background="rgba(255, 255, 255, 0.92)">
            <Text variant="caption" color={palette.ink[400]}>
              {capturedLabel}
            </Text>
          </Pill>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.sm,
    overflow: 'hidden',
  },
  frame: {
    height: 220,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: palette.surface.sunken,
  },
  photo: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  photoSide: {
    transform: [{ scale: 1.15 }],
  },
  overlay: {
    position: 'absolute',
    left: '18%',
    top: '12%',
    width: '64%',
    height: '72%',
    opacity: 0.92,
  },
  sideMesh: {
    position: 'absolute',
    left: '8%',
    top: '18%',
    width: '55%',
    height: '68%',
    opacity: 0.9,
  },
  glow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
    backgroundColor: 'rgba(192, 255, 0, 0.14)',
  },
  meta: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    bottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

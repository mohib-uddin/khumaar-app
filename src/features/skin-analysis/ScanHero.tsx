import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { ScanFace } from '@/components/icons';
import { palette, radii } from '@/theme';

import { FaceDetectionMesh } from './FaceDetectionMesh';
import { HeroGlow } from './HeroGlow';
import { FACE_SCAN, HERO_LAYOUT } from './heroLayout';

/** Figma node 0:52 — face scan hero with glow, portrait crop, and detection mesh. */
export function ScanHero() {
  const { width: screenWidth } = useWindowDimensions();
  const scale = screenWidth / HERO_LAYOUT.frameWidth;
  const heroHeight = HERO_LAYOUT.frameHeight * scale;

  const { face, detection, scanButton } = HERO_LAYOUT;

  const faceWidth = face.width * scale;
  const faceHeight = face.height * scale;
  const faceLeft = screenWidth / 2 - face.centerOffsetX * scale - faceWidth / 2;
  const faceTop = face.top * scale;

  const detectionWidth = detection.width * scale;
  const detectionHeight = detection.height * scale;
  const detectionLeft = detection.left * scale;
  const detectionTop = detection.top * scale;

  const scanSize = scanButton.padding * 2 + scanButton.iconSize;
  const scanTop = scanButton.top * scale;

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const meshAnim = useAnimatedStyle(() => ({
    opacity: 0.94 + (pulse.value - 1) * 3,
  }));

  return (
    <View style={[styles.hero, { height: heroHeight }]}>
      <HeroGlow />

      <View
        style={[
          styles.faceFrame,
          {
            left: faceLeft,
            top: faceTop,
            width: faceWidth,
            height: faceHeight,
          },
        ]}>
        <Image
          source={FACE_SCAN}
          style={[
            styles.faceImage,
            {
              width: faceWidth,
              height: faceHeight * face.imageHeightRatio,
              top: faceHeight * face.imageTopRatio,
            },
          ]}
          contentFit="cover"
          transition={200}
        />
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.detection,
          meshAnim,
          {
            left: detectionLeft,
            top: detectionTop,
            width: detectionWidth,
            height: detectionHeight,
          },
        ]}>
        <FaceDetectionMesh width={detectionWidth} height={detectionHeight} />
      </Animated.View>

      <View style={[styles.scanBtn, { top: scanTop }]}>
        <View
          style={[
            styles.scanChip,
            {
              width: scanSize * scale,
              height: scanSize * scale,
              padding: scanButton.padding * scale,
            },
          ]}>
          <ScanFace size={scanButton.iconSize * scale} color={palette.ink[900]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: palette.surface.canvas,
    overflow: 'hidden',
  },
  faceFrame: {
    position: 'absolute',
    overflow: 'hidden',
  },
  faceImage: {
    position: 'absolute',
  },
  detection: {
    position: 'absolute',
  },
  scanBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  scanChip: {
    backgroundColor: palette.white,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

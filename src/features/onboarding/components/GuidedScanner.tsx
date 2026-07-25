import { useFaceDetector } from '@noma4i/vision-camera-face-detector';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, Mask, Rect } from 'react-native-svg';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';

import { Button, PressableScale, Text } from '@/components/ui';
import {
  SCAN_POSE_COPY,
  SCAN_POSES,
  type ScanPose,
} from '@/features/onboarding/constants';
import { OnboardingProgress } from '@/features/onboarding/components/OnboardingProgress';
import {
  canManualCapture,
  canSoftUnlockManual,
  evaluateScanQuality,
  guideConfigForPose,
  isSidePose,
  ovalPixels,
  readyStabilityForPose,
  type ScanGuideCode,
} from '@/features/onboarding/scanQuality';
import { palette, radii, spacing } from '@/theme';

type Captures = Partial<Record<ScanPose, string>>;

type Props = {
  onComplete: (captures: Record<ScanPose, string>) => void;
};

type PrimaryFace = { yawAngle?: number };

function statusTone(code: ScanGuideCode, softUnlocked?: boolean): string {
  if (code === 'ready' || code === 'hold_still') return palette.brand[300];
  if (softUnlocked) return palette.brand[100];
  if (code === 'no_face' || code === 'unavailable') return palette.surface.raised;
  return palette.brand[100];
}

/**
 * VisionCamera + face guide — fixed centered portrait oval (Skin360-style).
 */
export function GuidedScanner({ onComplete }: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission, canRequestPermission } = useCameraPermission();
  const photoOutput = usePhotoOutput({ quality: 0.88, qualityPrioritization: 'balanced' });

  const [poseIndex, setPoseIndex] = useState(0);
  const [captures, setCaptures] = useState<Captures>({});
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewSize, setPreviewSize] = useState({
    width: windowWidth,
    height: Math.max(windowHeight * 0.72, windowWidth * 1.35),
  });

  const pose = SCAN_POSES[poseIndex];
  const copy = SCAN_POSE_COPY[pose];
  const guide = useMemo(() => guideConfigForPose(pose), [pose]);

  const face = useFaceDetector({
    preset: 'selfie',
    guide,
    outputs: photoOutput,
    preview: previewSize,
    stability: { readySamples: 3, resetSamples: 2, minTransitionMs: 160 },
    fps: 12,
  });

  const primaryFace = face.result.primaryFace as PrimaryFace | undefined;
  const yawAngle = primaryFace?.yawAngle;

  const quality = evaluateScanQuality({
    faceCount: face.result.faces.length,
    faceRect: face.result.primaryFaceRect,
    guideRect: face.result.guideRect,
    isInsideGuide: face.result.isInsideGuide,
    detectorReady: face.available,
    pose,
    previewWidth: previewSize.width,
    previewHeight: previewSize.height,
    yawAngle,
    mirrored: true,
  });

  const poseStartedAtRef = useRef(Date.now());
  const [softUnlocked, setSoftUnlocked] = useState(false);

  useEffect(() => {
    poseStartedAtRef.current = Date.now();
    setSoftUnlocked(false);
  }, [pose]);

  useEffect(() => {
    if (!isSidePose(pose) || previewUri || softUnlocked) return;
    const id = setInterval(() => {
      const elapsed = Date.now() - poseStartedAtRef.current;
      if (
        canSoftUnlockManual({
          pose,
          faceCount: face.result.faces.length,
          elapsedMs: elapsed,
        })
      ) {
        setSoftUnlocked(true);
      }
    }, 500);
    return () => clearInterval(id);
  }, [pose, previewUri, softUnlocked, face.result.faces.length]);

  const shutterEnabled = canManualCapture({
    pose,
    faceCount: face.result.faces.length,
    detectorReady: face.available,
    canCapture: quality.canCapture,
    softUnlocked,
  });

  const readyStreakRef = useRef(0);
  const readySinceRef = useRef<number | null>(null);
  const capturingRef = useRef(false);
  const [holdLabel, setHoldLabel] = useState<string | null>(null);

  const onPreviewLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setPreviewSize({ width, height });
    }
  };

  const takePicture = useCallback(async () => {
    if (busy || capturingRef.current || previewUri) return;
    capturingRef.current = true;
    setBusy(true);
    try {
      const file = await photoOutput.capturePhotoToFile(
        { flashMode: 'off', enableShutterSound: true },
        {},
      );
      const uri = file.filePath.startsWith('file://') ? file.filePath : `file://${file.filePath}`;
      setPreviewUri(uri);
      readyStreakRef.current = 0;
      readySinceRef.current = null;
      setHoldLabel(null);
    } catch (error) {
      console.warn('Photo capture failed', error);
    } finally {
      setBusy(false);
      capturingRef.current = false;
    }
  }, [busy, photoOutput, previewUri]);

  useEffect(() => {
    if (previewUri || busy) return;

    if (quality.canCapture) {
      readyStreakRef.current += 1;
      if (readySinceRef.current == null) {
        readySinceRef.current = Date.now();
      }
      const elapsed = Date.now() - (readySinceRef.current ?? Date.now());
      const { frames, ms } = readyStabilityForPose(pose);
      if (readyStreakRef.current >= 3) {
        setHoldLabel('Hold still…');
      }
      if (readyStreakRef.current >= frames && elapsed >= ms) {
        void takePicture();
      }
    } else {
      readyStreakRef.current = 0;
      readySinceRef.current = null;
      setHoldLabel(null);
    }
  }, [quality.canCapture, quality.code, previewUri, busy, takePicture, face.result, pose]);

  const confirmPreview = () => {
    if (!previewUri) return;
    const next = { ...captures, [pose]: previewUri };
    setCaptures(next);
    setPreviewUri(null);
    readyStreakRef.current = 0;
    readySinceRef.current = null;

    if (poseIndex < SCAN_POSES.length - 1) {
      setPoseIndex((i) => i + 1);
      return;
    }

    onComplete(next as Record<ScanPose, string>);
  };

  if (!hasPermission) {
    return (
      <View style={[styles.permission, { paddingTop: insets.top + spacing.xxl }]}>
        <Text variant="sectionTitle" color="textPrimary">
          Camera access
        </Text>
        <Text variant="body" color="textSecondary" style={styles.permissionBody}>
          We use your camera for a cosmetic skin coaching scan — photos stay private to your
          account.
        </Text>
        {canRequestPermission ? (
          <Button label="Allow camera" onPress={() => void requestPermission()} />
        ) : (
          <Text variant="caption" color="textSecondary">
            Enable camera access in Settings to continue.
          </Text>
        )}
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.permission, { paddingTop: insets.top + spacing.xxl }]}>
        <Text variant="sectionTitle" color="textPrimary">
          No front camera
        </Text>
        <Text variant="body" color="textSecondary">
          A front-facing camera is required for the skin scan.
        </Text>
      </View>
    );
  }

  const guidePx = ovalPixels(previewSize.width, previewSize.height);
  const ovalReady = quality.canCapture || quality.code === 'hold_still' || Boolean(holdLabel);
  const progressHint =
    isSidePose(pose) &&
    !quality.canCapture &&
    !holdLabel &&
    quality.turnProgress > 0 &&
    quality.turnProgress < 1
      ? ` · ${Math.round(quality.turnProgress * 100)}%`
      : '';
  const chipLabel = holdLabel
    ? holdLabel
    : softUnlocked && !quality.canCapture
      ? 'Close enough — tap to capture'
      : `${quality.label}${progressHint}`;
  const chipBg = statusTone(holdLabel ? 'hold_still' : quality.code, softUnlocked);
  // Place coaching chip just below the oval bottom
  const chipTop = Math.min(
    guidePx.cy + guidePx.ry + spacing.xl,
    previewSize.height - spacing['6xl'],
  );

  return (
    <View style={styles.root}>
      <View style={styles.previewWrap} onLayout={onPreviewLayout}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.camera} contentFit="cover" />
        ) : (
          <Camera
            {...face.camera}
            style={styles.camera}
            device={device}
            isActive={!previewUri}
            mirrorMode="on"
            resizeMode="cover"
          />
        )}

        <View style={styles.overlay} pointerEvents="none">
          <Svg width={previewSize.width} height={previewSize.height}>
            <Defs>
              <Mask id="faceOvalMask">
                <Rect
                  x="0"
                  y="0"
                  width={previewSize.width}
                  height={previewSize.height}
                  fill="#fff"
                />
                <Ellipse
                  cx={guidePx.cx}
                  cy={guidePx.cy}
                  rx={guidePx.rx}
                  ry={guidePx.ry}
                  fill="#000"
                />
              </Mask>
            </Defs>
            <Rect
              x="0"
              y="0"
              width={previewSize.width}
              height={previewSize.height}
              fill="rgba(16,16,16,0.58)"
              mask="url(#faceOvalMask)"
            />
            <Ellipse
              cx={guidePx.cx}
              cy={guidePx.cy}
              rx={guidePx.rx}
              ry={guidePx.ry}
              fill="transparent"
              stroke={ovalReady ? palette.brand[300] : palette.white}
              strokeWidth={ovalReady ? 3.5 : 2}
              strokeDasharray={ovalReady ? undefined : '10 7'}
            />
          </Svg>

          <View style={[styles.topChrome, { paddingTop: insets.top + spacing.md }]}>
            <OnboardingProgress
              step={poseIndex}
              total={SCAN_POSES.length}
              label={`${poseIndex + 1} / ${SCAN_POSES.length}`}
              onDark
            />
            <Text variant="bodyEmphasis" color={palette.white} style={styles.poseTitle}>
              {copy.title}
            </Text>
            <Text variant="caption" color="rgba(255,255,255,0.82)" style={styles.poseHint}>
              {copy.hint}
            </Text>
          </View>

          <View style={[styles.guideChip, { top: chipTop, backgroundColor: chipBg }]}>
            <Text variant="captionMedium" color={palette.ink[900]}>
              {chipLabel}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.xxl) }]}>
        {previewUri ? (
          <>
            <Button label="Use photo" onPress={confirmPreview} />
            <PressableScale onPress={() => setPreviewUri(null)} accessibilityRole="button">
              <Text variant="bodyEmphasis" color="textSecondary" style={styles.retake}>
                Retake
              </Text>
            </PressableScale>
          </>
        ) : (
          <>
            <PressableScale
              onPress={() => {
                if (shutterEnabled) void takePicture();
              }}
              accessibilityRole="button"
              accessibilityLabel="Capture"
              accessibilityState={{ disabled: !shutterEnabled }}
              style={[styles.shutterOuter, !shutterEnabled && styles.shutterDisabled]}
              dim={false}>
              <View style={[styles.shutterInner, shutterEnabled && styles.shutterReady]}>
                {busy ? <ActivityIndicator color={palette.ink[900]} /> : null}
              </View>
            </PressableScale>
            <Text variant="caption" color="textSecondary" style={styles.hint}>
              {quality.canCapture
                ? 'Auto-captures when aligned — or tap the shutter'
                : softUnlocked
                  ? 'Tap the shutter when your cheek looks good'
                  : copy.guide}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.surface.canvas,
  },
  previewWrap: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: palette.ink[900],
    minHeight: 360,
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
  },
  poseTitle: {
    marginTop: spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  poseHint: {
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  guideChip: {
    position: 'absolute',
    alignSelf: 'center',
    left: spacing.xxl,
    right: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    alignItems: 'center',
  },
  actions: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    minHeight: 120,
    justifyContent: 'center',
    backgroundColor: palette.surface.canvas,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: palette.brand[500],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surface.raised,
  },
  shutterDisabled: {
    opacity: 0.35,
    borderColor: palette.ink[200],
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.track.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterReady: {
    backgroundColor: palette.brand[300],
  },
  retake: {
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
  permission: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xxl,
    paddingHorizontal: spacing['4xl'],
  },
  permissionBody: {
    marginBottom: spacing.lg,
  },
});

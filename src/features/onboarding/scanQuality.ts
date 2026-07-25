import type { ScanPose } from '@/features/onboarding/constants';

/** Preview-space face bounds (matches detector FaceRect shape). */
export type FaceRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ScanGuideCode =
  | 'unavailable'
  | 'no_face'
  | 'too_many'
  | 'too_far'
  | 'too_close'
  | 'off_center'
  | 'wrong_pose'
  | 'hold_still'
  | 'ready';

export type ScanQualityResult = {
  code: ScanGuideCode;
  label: string;
  /** True when auto-capture may proceed (after stability). */
  canCapture: boolean;
  /** 0–1 progress toward the target cheek yaw (side poses). */
  turnProgress: number;
};

/**
 * Fixed portrait face oval in 0–1 preview ratios.
 * Same hole for front / left / right — modern skin-scan UX.
 */
export type FaceOvalGuide = {
  centerX: number;
  centerY: number;
  /** Oval width as fraction of preview width. */
  width: number;
  /** height / width — >1 for portrait face silhouette. */
  aspect: number;
  tolerancePx: number;
};

export const FACE_OVAL_GUIDE: FaceOvalGuide = {
  centerX: 0.5,
  centerY: 0.46,
  width: 0.64,
  aspect: 1.28,
  tolerancePx: 48,
};

/** Front: looking roughly straight at camera. */
export const FRONT_YAW_MAX = 15;
/** Side: minimum |yaw| for a usable ¾ cheek turn. */
export const SIDE_YAW_MIN = 18;
/** Side: maximum |yaw| before over-turning. */
export const SIDE_YAW_MAX = 48;

/** Soft unlock after this many ms on a side pose with a face present. */
export const SIDE_SOFT_UNLOCK_MS = 12_000;

type PoseThresholds = {
  minFillH: number;
  maxFillH: number;
  centerSlackY: number;
  centerSlackX: number;
};

const FRONT_THRESHOLDS: PoseThresholds = {
  minFillH: 0.55,
  maxFillH: 0.95,
  centerSlackY: 0.24,
  centerSlackX: 0.24,
};

/** Size-only oval for side — do not fight a real head turn. */
const SIDE_THRESHOLDS: PoseThresholds = {
  minFillH: 0.42,
  maxFillH: 1.1,
  centerSlackY: 0.35,
  centerSlackX: 0.45,
};

const LABELS: Record<ScanGuideCode, string> = {
  unavailable: 'Face detection unavailable',
  no_face: 'Center your face in the oval',
  too_many: 'Only one face in frame',
  too_far: 'Move closer',
  too_close: 'Move back a little',
  off_center: 'Center in the oval',
  wrong_pose: 'Turn to match the pose',
  hold_still: 'Hold still…',
  ready: 'Perfect — capturing',
};

function thresholdsForPose(pose: ScanPose): PoseThresholds {
  return pose === 'front' ? FRONT_THRESHOLDS : SIDE_THRESHOLDS;
}

export function isSidePose(pose: ScanPose): boolean {
  return pose === 'left' || pose === 'right';
}

function cheekLabel(pose: 'left' | 'right'): string {
  return pose === 'left' ? 'left' : 'right';
}

/** Align detector yaw with mirrored front-camera preview. */
export function displayYaw(rawYaw: number, mirrored: boolean): number {
  return mirrored ? -rawYaw : rawYaw;
}

/** Pixel geometry for drawing / gate math. */
export function ovalPixels(previewWidth: number, previewHeight: number) {
  const g = FACE_OVAL_GUIDE;
  const ovalW = g.width * previewWidth;
  const ovalH = ovalW * g.aspect;
  const cx = g.centerX * previewWidth;
  const cy = g.centerY * previewHeight;
  return {
    cx,
    cy,
    rx: ovalW / 2,
    ry: ovalH / 2,
    ovalW,
    ovalH,
    x: cx - ovalW / 2,
    y: cy - ovalH / 2,
  };
}

/** noma4i rect guide matching the oval bounding box (all poses). */
export function guideConfigForPose(_pose: ScanPose) {
  const g = FACE_OVAL_GUIDE;
  const height = g.width * g.aspect;
  return {
    shape: 'rect' as const,
    units: 'ratio' as const,
    x: g.centerX - g.width / 2,
    y: g.centerY - height / 2,
    width: g.width,
    height,
    tolerancePx: g.tolerancePx,
  };
}

function yawInBand(yaw: number, min: number, max: number): boolean {
  return yaw >= min && yaw <= max;
}

/**
 * 0–1 how close displayYaw is to the side target band.
 * Front uses 1 when facing forward enough, else drops with |yaw|.
 */
export function turnProgressForPose(
  pose: ScanPose,
  rawYaw: number | undefined,
  mirrored: boolean,
): number {
  if (rawYaw == null || Number.isNaN(rawYaw)) return 0;
  const yaw = displayYaw(rawYaw, mirrored);

  if (pose === 'front') {
    if (Math.abs(yaw) <= FRONT_YAW_MAX) return 1;
    return Math.max(0, 1 - (Math.abs(yaw) - FRONT_YAW_MAX) / 30);
  }

  const signedTarget = pose === 'left' ? 1 : -1;
  const signedYaw = yaw * signedTarget;
  if (signedYaw < 0) return 0;
  if (signedYaw < SIDE_YAW_MIN) return Math.min(0.99, signedYaw / SIDE_YAW_MIN);
  if (signedYaw <= SIDE_YAW_MAX) return 1;
  return Math.max(0, 1 - (signedYaw - SIDE_YAW_MAX) / 20);
}

function sideYawReady(pose: 'left' | 'right', yaw: number): boolean {
  if (pose === 'left') return yawInBand(yaw, SIDE_YAW_MIN, SIDE_YAW_MAX);
  return yawInBand(yaw, -SIDE_YAW_MAX, -SIDE_YAW_MIN);
}

/**
 * Evaluate face quality for the active scan pose.
 * Side poses gate on head yaw (not bbox aspect/offset hacks).
 */
export function evaluateScanQuality(input: {
  faceCount: number;
  faceRect?: FaceRect;
  guideRect?: FaceRect;
  isInsideGuide: boolean;
  detectorReady: boolean;
  pose: ScanPose;
  previewWidth: number;
  previewHeight: number;
  /** Raw detector yaw in degrees; undefined if unavailable. */
  yawAngle?: number;
  /** Front camera preview is mirrored. */
  mirrored?: boolean;
}): ScanQualityResult {
  const {
    faceCount,
    faceRect,
    isInsideGuide,
    detectorReady,
    pose,
    previewWidth,
    previewHeight,
    yawAngle,
    mirrored = true,
  } = input;

  const progress = turnProgressForPose(pose, yawAngle, mirrored);

  if (!detectorReady && faceCount === 0) {
    return {
      code: 'unavailable',
      label: LABELS.unavailable,
      canCapture: false,
      turnProgress: 0,
    };
  }

  if (faceCount === 0 || !faceRect) {
    return {
      code: 'no_face',
      label: LABELS.no_face,
      canCapture: false,
      turnProgress: 0,
    };
  }

  if (faceCount > 1) {
    return {
      code: 'too_many',
      label: LABELS.too_many,
      canCapture: false,
      turnProgress: progress,
    };
  }

  const t = thresholdsForPose(pose);
  const oval = ovalPixels(previewWidth, previewHeight);
  const faceCx = faceRect.x + faceRect.width / 2;
  const faceCy = faceRect.y + faceRect.height / 2;
  const fillH = faceRect.height / oval.ovalH;

  if (fillH < t.minFillH) {
    return { code: 'too_far', label: LABELS.too_far, canCapture: false, turnProgress: progress };
  }

  if (fillH > t.maxFillH) {
    return {
      code: 'too_close',
      label: LABELS.too_close,
      canCapture: false,
      turnProgress: progress,
    };
  }

  const maxOffsetY = oval.ry * t.centerSlackY;
  if (Math.abs(faceCy - oval.cy) > maxOffsetY) {
    return {
      code: 'off_center',
      label: LABELS.off_center,
      canCapture: false,
      turnProgress: progress,
    };
  }

  if (pose === 'front') {
    const maxOffsetX = oval.rx * t.centerSlackX;
    if (Math.abs(faceCx - oval.cx) > maxOffsetX) {
      return {
        code: 'off_center',
        label: LABELS.off_center,
        canCapture: false,
        turnProgress: progress,
      };
    }
  }

  if (yawAngle == null || Number.isNaN(yawAngle)) {
    return {
      code: 'wrong_pose',
      label: 'Turn slowly so we can track your face',
      canCapture: false,
      turnProgress: 0,
    };
  }

  const yaw = displayYaw(yawAngle, mirrored);

  if (pose === 'front') {
    if (Math.abs(yaw) > FRONT_YAW_MAX) {
      return {
        code: 'wrong_pose',
        label: 'Face the camera straight on',
        canCapture: false,
        turnProgress: progress,
      };
    }
    if (!isInsideGuide) {
      return {
        code: 'off_center',
        label: LABELS.off_center,
        canCapture: false,
        turnProgress: progress,
      };
    }
    return { code: 'ready', label: LABELS.ready, canCapture: true, turnProgress: 1 };
  }

  const side = pose;
  if (!sideYawReady(side, yaw)) {
    const absYaw = Math.abs(yaw);
    const wrongWay =
      (side === 'left' && yaw < 0) || (side === 'right' && yaw > 0);
    const label = wrongWay
      ? `Other way — show your ${cheekLabel(side)} cheek`
      : absYaw < SIDE_YAW_MIN
        ? progress > 0.55
          ? 'A little more…'
          : `Show your ${cheekLabel(side)} cheek to the camera`
        : 'Ease back a little — not a full profile';

    return {
      code: 'wrong_pose',
      label,
      canCapture: false,
      turnProgress: progress,
    };
  }

  // Side: skip strict isInsideGuide — turning legitimately shifts the box.
  const maxOffsetX = oval.rx * t.centerSlackX;
  if (Math.abs(faceCx - oval.cx) > maxOffsetX) {
    return {
      code: 'off_center',
      label: 'Keep your face in the oval',
      canCapture: false,
      turnProgress: progress,
    };
  }

  return { code: 'ready', label: LABELS.ready, canCapture: true, turnProgress: 1 };
}

/** Soft unlock: side pose + face present long enough → allow manual capture. */
export function canSoftUnlockManual(input: {
  pose: ScanPose;
  faceCount: number;
  elapsedMs: number;
}): boolean {
  if (!isSidePose(input.pose)) return false;
  if (input.faceCount !== 1) return false;
  return input.elapsedMs >= SIDE_SOFT_UNLOCK_MS;
}

/** Manual shutter: quality ready, or soft-unlocked side pose. */
export function canManualCapture(input: {
  pose: ScanPose;
  faceCount: number;
  detectorReady: boolean;
  canCapture: boolean;
  softUnlocked?: boolean;
}): boolean {
  if (input.canCapture) return true;
  return Boolean(input.softUnlocked && isSidePose(input.pose) && input.faceCount === 1);
}

/** Require N consecutive ready frames before auto-capture. */
export const READY_STABLE_FRAMES = 8;
export const READY_STABLE_MS = 700;

/** Shorter hold for cheek poses. */
export const SIDE_READY_STABLE_FRAMES = 5;
export const SIDE_READY_STABLE_MS = 450;

export function readyStabilityForPose(pose: ScanPose): { frames: number; ms: number } {
  if (isSidePose(pose)) {
    return { frames: SIDE_READY_STABLE_FRAMES, ms: SIDE_READY_STABLE_MS };
  }
  return { frames: READY_STABLE_FRAMES, ms: READY_STABLE_MS };
}

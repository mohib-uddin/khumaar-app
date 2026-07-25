import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  SIDE_SOFT_UNLOCK_MS,
  canManualCapture,
  canSoftUnlockManual,
  displayYaw,
  evaluateScanQuality,
  ovalPixels,
  readyStabilityForPose,
  turnProgressForPose,
  type FaceRect,
} from './scanQuality';

const PREVIEW_W = 400;
const PREVIEW_H = 600;

function centeredFace(opts: {
  fillH: number;
  aspect?: number;
  offsetX?: number;
  offsetY?: number;
}): FaceRect {
  const oval = ovalPixels(PREVIEW_W, PREVIEW_H);
  const height = opts.fillH * oval.ovalH;
  const width = (opts.aspect ?? 0.85) * height;
  const cx = oval.cx + (opts.offsetX ?? 0);
  const cy = oval.cy + (opts.offsetY ?? 0);
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height,
  };
}

function evaluate(
  pose: 'front' | 'left' | 'right',
  faceRect: FaceRect,
  extras?: Partial<{
    faceCount: number;
    isInsideGuide: boolean;
    detectorReady: boolean;
    yawAngle: number | undefined;
    mirrored: boolean;
  }>,
) {
  return evaluateScanQuality({
    faceCount: extras?.faceCount ?? 1,
    faceRect,
    isInsideGuide: extras?.isInsideGuide ?? true,
    detectorReady: extras?.detectorReady ?? true,
    pose,
    previewWidth: PREVIEW_W,
    previewHeight: PREVIEW_H,
    yawAngle: extras?.yawAngle,
    mirrored: extras?.mirrored ?? true,
  });
}

describe('displayYaw', () => {
  it('negates yaw when mirrored', () => {
    assert.equal(displayYaw(30, true), -30);
    assert.equal(displayYaw(30, false), 30);
  });
});

describe('evaluateScanQuality yaw gating', () => {
  it('accepts front when yaw is near zero', () => {
    const result = evaluate('front', centeredFace({ fillH: 0.75 }), { yawAngle: 5 });
    assert.equal(result.code, 'ready');
    assert.equal(result.canCapture, true);
  });

  it('rejects front when yaw is large', () => {
    // mirrored: raw +40 → display -40
    const result = evaluate('front', centeredFace({ fillH: 0.75 }), { yawAngle: 40 });
    assert.equal(result.code, 'wrong_pose');
    assert.equal(result.canCapture, false);
  });

  it('accepts left cheek when mirrored yaw is in band', () => {
    // left needs displayYaw +18..+48 → rawYaw -18..-48 when mirrored
    const result = evaluate('left', centeredFace({ fillH: 0.7, offsetX: 20 }), {
      yawAngle: -30,
      isInsideGuide: false,
    });
    assert.equal(result.code, 'ready');
    assert.equal(result.canCapture, true);
  });

  it('accepts right cheek when mirrored yaw is in band', () => {
    // right needs displayYaw -18..-48 → rawYaw +18..+48 when mirrored
    const result = evaluate('right', centeredFace({ fillH: 0.7, offsetX: -20 }), {
      yawAngle: 30,
      isInsideGuide: false,
    });
    assert.equal(result.code, 'ready');
    assert.equal(result.canCapture, true);
  });

  it('rejects wrong-sign yaw on left', () => {
    const result = evaluate('left', centeredFace({ fillH: 0.7 }), { yawAngle: 30 });
    assert.equal(result.code, 'wrong_pose');
    assert.equal(result.canCapture, false);
    assert.match(result.label, /Other way|left cheek/i);
  });

  it('does not auto-ready when yaw is missing', () => {
    const result = evaluate('left', centeredFace({ fillH: 0.7 }), { yawAngle: undefined });
    assert.equal(result.canCapture, false);
    assert.equal(result.code, 'wrong_pose');
    assert.match(result.label, /Turn slowly/i);
  });

  it('rejects centered frontal yaw on side poses', () => {
    const result = evaluate('right', centeredFace({ fillH: 0.75 }), { yawAngle: 2 });
    assert.equal(result.canCapture, false);
    assert.equal(result.code, 'wrong_pose');
  });
});

describe('turnProgressForPose', () => {
  it('rises as yaw approaches the left band', () => {
    const early = turnProgressForPose('left', -8, true); // display +8
    const mid = turnProgressForPose('left', -16, true); // display +16
    const ready = turnProgressForPose('left', -30, true); // display +30
    assert.ok(early < mid);
    assert.ok(mid < ready);
    assert.equal(ready, 1);
  });
});

describe('canManualCapture / soft unlock', () => {
  it('soft-unlocks side poses after timeout with a face', () => {
    assert.equal(
      canSoftUnlockManual({ pose: 'left', faceCount: 1, elapsedMs: SIDE_SOFT_UNLOCK_MS }),
      true,
    );
    assert.equal(
      canSoftUnlockManual({ pose: 'left', faceCount: 1, elapsedMs: SIDE_SOFT_UNLOCK_MS - 1 }),
      false,
    );
    assert.equal(
      canSoftUnlockManual({ pose: 'front', faceCount: 1, elapsedMs: SIDE_SOFT_UNLOCK_MS }),
      false,
    );
  });

  it('allows manual capture when soft-unlocked on side', () => {
    assert.equal(
      canManualCapture({
        pose: 'left',
        faceCount: 1,
        detectorReady: true,
        canCapture: false,
        softUnlocked: true,
      }),
      true,
    );
    assert.equal(
      canManualCapture({
        pose: 'left',
        faceCount: 1,
        detectorReady: true,
        canCapture: false,
        softUnlocked: false,
      }),
      false,
    );
  });
});

describe('readyStabilityForPose', () => {
  it('uses a shorter streak for cheek poses', () => {
    assert.deepEqual(readyStabilityForPose('left'), { frames: 5, ms: 450 });
    assert.deepEqual(readyStabilityForPose('front'), { frames: 8, ms: 700 });
  });
});

/** Figma node 0:52 "Top Image" — pixel layout on the 402pt Analyze frame. */
export const HERO_LAYOUT = {
  frameWidth: 402,
  frameHeight: 526,

  /** Node 0:53 — lime radial glow behind the portrait. */
  glow: {
    left: 1.5,
    top: 0,
    width: 291.5,
    height: 504,
    inset: { top: 0.3095, right: 0.5352, bottom: 0.3095, left: 0.5352 },
  },

  /** Node 0:54 — portrait frame + inner image crop. */
  face: {
    top: 76,
    width: 429,
    height: 485,
    /** `left: calc(50% - 3.5px)` before `-translate-x-1/2`. */
    centerOffsetX: 3.5,
    imageHeightRatio: 1.3273,
    imageTopRatio: -0.0767,
  },

  /** Node 0:55 — AI detection mesh overlay. */
  detection: {
    left: 109,
    top: 161.58,
    width: 193.002,
    height: 267.973,
  },

  /** Node 0:119 — scan-face chip. */
  scanButton: {
    top: 62,
    padding: 16,
    iconSize: 24,
  },
} as const;

export const FACE_SCAN = require('@/assets/figma/skin-analysis/face-scan.png');

/** @deprecated Use HERO_LAYOUT.frameHeight */
export const FIGMA_HERO_HEIGHT = HERO_LAYOUT.frameHeight;
/** @deprecated Use HERO_LAYOUT.frameWidth */
export const FIGMA_FRAME_WIDTH = HERO_LAYOUT.frameWidth;

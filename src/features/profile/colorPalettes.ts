import type { SkinUndertone } from '@/lib/database.types';

export type PaletteSwatch = {
  id: string;
  label: string;
  hex: string;
};

export type DepthBand = 'light' | 'medium' | 'deep';

export type FashionPack = {
  hero: PaletteSwatch;
  best: PaletteSwatch[];
  accents: PaletteSwatch[];
  softAvoid: PaletteSwatch[];
  blurb: string;
};

export function depthBandFromFitzpatrick(type: number | null | undefined): DepthBand | null {
  if (type == null || type < 1 || type > 6) return null;
  if (type <= 2) return 'light';
  if (type <= 4) return 'medium';
  return 'deep';
}

type PaletteKey = `${SkinUndertone}_${DepthBand}`;

const s = (id: string, label: string, hex: string): PaletteSwatch => ({ id, label, hex });

/** Curated studio fashion packs — cosmetic style guidance only. */
const FASHION_PACKS: Record<PaletteKey, FashionPack> = {
  cool_light: {
    hero: s('navy', 'Navy', '#2C3E50'),
    best: [
      s('ivory', 'Ivory', '#F4EFE6'),
      s('pearl', 'Pearl', '#E8E4DF'),
      s('slate', 'Slate', '#6B7C8A'),
      s('soft-grey', 'Soft grey', '#A8B0B8'),
      s('ink', 'Ink', '#1A1A1C'),
    ],
    accents: [
      s('soft-rose', 'Soft rose', '#E8B4B8'),
      s('berry', 'Berry', '#7A3E5C'),
      s('teal', 'Teal', '#3D6B6B'),
      s('lavender', 'Lavender', '#9B8BB8'),
    ],
    softAvoid: [
      s('mustard', 'Mustard', '#C9A227'),
      s('orange', 'Bright orange', '#E07A3D'),
      s('warm-camel', 'Camel', '#C4A06A'),
    ],
    blurb: 'Crisp neutrals and soft cool accents keep fair cool skin luminous.',
  },
  cool_medium: {
    hero: s('charcoal', 'Charcoal', '#3A3A3C'),
    best: [
      s('pearl', 'Pearl', '#E8E4DF'),
      s('stone', 'Stone', '#C5BDB3'),
      s('slate', 'Slate', '#6B7C8A'),
      s('charcoal', 'Charcoal', '#3A3A3C'),
      s('ink', 'Ink', '#1A1A1C'),
    ],
    accents: [
      s('mauve', 'Mauve', '#A8788A'),
      s('plum', 'Plum', '#5C3A5C'),
      s('teal', 'Teal', '#3D6B6B'),
      s('berry', 'Berry', '#7A3E5C'),
    ],
    softAvoid: [
      s('peach', 'Peach', '#E8B892'),
      s('gold', 'Bright gold', '#D4AF37'),
      s('rust', 'Rust', '#B85C38'),
    ],
    blurb: 'Balanced cool depth loves charcoal bases with mauve and teal lift.',
  },
  cool_deep: {
    hero: s('emerald', 'Emerald', '#1F4D3A'),
    best: [
      s('stone', 'Stone', '#C5BDB3'),
      s('charcoal', 'Charcoal', '#3A3A3C'),
      s('ink', 'Ink', '#1A1A1C'),
      s('navy', 'Navy', '#2C3E50'),
      s('graphite', 'Graphite', '#4A4A4C'),
    ],
    accents: [
      s('eggplant', 'Eggplant', '#4A2C4A'),
      s('ruby', 'Ruby', '#6B1E2E'),
      s('emerald', 'Emerald', '#1F4D3A'),
      s('berry', 'Berry', '#7A3E5C'),
    ],
    softAvoid: [
      s('pastel-pink', 'Pastel pink', '#F2C4C8'),
      s('beige', 'Warm beige', '#E0C9A8'),
      s('lime', 'Lime', '#AADF08'),
    ],
    blurb: 'Deep cool complexions glow in ink, jewel accents, and muted stone.',
  },
  warm_light: {
    hero: s('camel', 'Camel', '#C4A06A'),
    best: [
      s('cream', 'Cream', '#F5E6D3'),
      s('sand', 'Sand', '#E0C9A8'),
      s('camel', 'Camel', '#C4A06A'),
      s('sage', 'Sage', '#8FA67A'),
      s('espresso', 'Espresso', '#4A3020'),
    ],
    accents: [
      s('peach', 'Peach', '#E8B892'),
      s('terracotta', 'Terracotta', '#C46B4A'),
      s('coral', 'Coral', '#D97B6C'),
      s('olive', 'Olive', '#6B7A3D'),
    ],
    softAvoid: [
      s('icy-blue', 'Icy blue', '#A8C4D8'),
      s('fuchsia', 'Fuchsia', '#C23B7A'),
      s('silver', 'Silver', '#C0C0C0'),
    ],
    blurb: 'Warm light tones bloom in cream, camel, and soft earth accents.',
  },
  warm_medium: {
    hero: s('rust', 'Rust', '#B85C38'),
    best: [
      s('sand', 'Sand', '#E0C9A8'),
      s('copper', 'Copper', '#A86B3C'),
      s('olive', 'Olive', '#6B7A3D'),
      s('espresso', 'Espresso', '#4A3020'),
      s('linen', 'Linen', '#D9CFC3'),
    ],
    accents: [
      s('rust', 'Rust', '#B85C38'),
      s('terracotta', 'Terracotta', '#C46B4A'),
      s('gold', 'Gold', '#C9A227'),
      s('forest', 'Forest', '#2F4A2F'),
    ],
    softAvoid: [
      s('cool-grey', 'Cool grey', '#8A9299'),
      s('lavender', 'Lavender', '#9B8BB8'),
      s('bubblegum', 'Bubblegum', '#E88BA8'),
    ],
    blurb: 'Medium warm skin loves rust, olive, and grounded sand bases.',
  },
  warm_deep: {
    hero: s('mahogany', 'Mahogany', '#5C2E1F'),
    best: [
      s('bronze', 'Bronze', '#A67C52'),
      s('mahogany', 'Mahogany', '#5C2E1F'),
      s('espresso', 'Espresso', '#4A3020'),
      s('forest', 'Forest', '#2F4A2F'),
      s('black', 'Black', '#1C1C1C'),
    ],
    accents: [
      s('burnt-orange', 'Burnt orange', '#C45A2A'),
      s('gold', 'Gold', '#C9A227'),
      s('oxblood', 'Oxblood', '#4A1C24'),
      s('copper', 'Copper', '#A86B3C'),
    ],
    softAvoid: [
      s('pastel-yellow', 'Pastel yellow', '#F5E6A8'),
      s('mint', 'Mint', '#A8D8C8'),
      s('icy-lilac', 'Icy lilac', '#C8B8D8'),
    ],
    blurb: 'Deep warm complexions carry mahogany, bronze, and rich earth accents.',
  },
  neutral_light: {
    hero: s('taupe', 'Taupe', '#8B7355'),
    best: [
      s('oat', 'Oat', '#EDE6DC'),
      s('greige', 'Greige', '#A89F94'),
      s('taupe', 'Taupe', '#8B7355'),
      s('soft-navy', 'Soft navy', '#4A5568'),
      s('charcoal', 'Charcoal', '#3A3A3C'),
    ],
    accents: [
      s('blush', 'Blush', '#D9B5A8'),
      s('sage', 'Sage', '#8FA67A'),
      s('clay', 'Clay', '#A67C6D'),
      s('soft-rose', 'Soft rose', '#E8B4B8'),
    ],
    softAvoid: [
      s('neon', 'Neon', '#C0FF00'),
      s('electric-blue', 'Electric blue', '#3B6FE8'),
      s('hot-pink', 'Hot pink', '#E83B7A'),
    ],
    blurb: 'Light neutral skin stays versatile in oat, greige, and quiet blush.',
  },
  neutral_medium: {
    hero: s('graphite', 'Graphite', '#4A4A4C'),
    best: [
      s('linen', 'Linen', '#D9CFC3'),
      s('clay', 'Clay', '#A67C6D'),
      s('moss', 'Moss', '#6B7355'),
      s('graphite', 'Graphite', '#4A4A4C'),
      s('soft-navy', 'Soft navy', '#4A5568'),
    ],
    accents: [
      s('wine', 'Wine', '#6B3A3A'),
      s('olive', 'Olive', '#6B7A3D'),
      s('taupe', 'Taupe', '#8B7355'),
      s('blush', 'Blush', '#D9B5A8'),
    ],
    softAvoid: [
      s('pure-white', 'Stark white', '#FFFFFF'),
      s('neon-orange', 'Neon orange', '#FF6B1A'),
      s('icy-mint', 'Icy mint', '#B8E8D8'),
    ],
    blurb: 'Medium neutrals thrive in linen, moss, and soft wine accents.',
  },
  neutral_deep: {
    hero: s('cocoa', 'Cocoa', '#5C4033'),
    best: [
      s('mushroom', 'Mushroom', '#B5A99A'),
      s('cocoa', 'Cocoa', '#5C4033'),
      s('pine', 'Pine', '#2A4030'),
      s('black', 'Black', '#1C1C1C'),
      s('graphite', 'Graphite', '#4A4A4C'),
    ],
    accents: [
      s('oxblood', 'Oxblood', '#4A1C24'),
      s('bronze', 'Bronze', '#A67C52'),
      s('wine', 'Wine', '#6B3A3A'),
      s('gold', 'Gold', '#C9A227'),
    ],
    softAvoid: [
      s('baby-blue', 'Baby blue', '#B0D0E8'),
      s('lemon', 'Lemon', '#F5E86A'),
      s('lilac', 'Lilac', '#C8B0D8'),
    ],
    blurb: 'Deep neutrals look expensive in cocoa, pine, and restrained metallics.',
  },
};

export function fashionPackForTone(
  undertone: SkinUndertone | null | undefined,
  fitzpatrickType: number | null | undefined,
): FashionPack | null {
  if (!undertone) return null;
  const depth = depthBandFromFitzpatrick(fitzpatrickType);
  if (!depth) return null;
  return FASHION_PACKS[`${undertone}_${depth}`] ?? null;
}

/** @deprecated Prefer fashionPackForTone — kept for any residual callers. */
export function paletteForTone(
  undertone: SkinUndertone | null | undefined,
  fitzpatrickType: number | null | undefined,
): PaletteSwatch[] | null {
  const pack = fashionPackForTone(undertone, fitzpatrickType);
  if (!pack) return null;
  return [pack.hero, ...pack.best.slice(0, 4)];
}

export function undertoneLabel(undertone: SkinUndertone): string {
  if (undertone === 'cool') return 'Cool';
  if (undertone === 'warm') return 'Warm';
  return 'Neutral';
}

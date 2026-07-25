export type FitzpatrickType = 1 | 2 | 3 | 4 | 5 | 6;

export type FitzpatrickMeta = {
  type: FitzpatrickType;
  roman: string;
  name: string;
  /** Short burn/tan cue for caption */
  cue: string;
  /** Cosmetic tone swatch (not a medical palette). */
  swatch: string;
};

/** Fitzpatrick I–VI display constants for Profile scale. */
export const FITZPATRICK_TYPES: FitzpatrickMeta[] = [
  {
    type: 1,
    roman: 'I',
    name: 'Very fair',
    cue: 'Always burns',
    swatch: '#F6E4D4',
  },
  {
    type: 2,
    roman: 'II',
    name: 'Fair',
    cue: 'Usually burns',
    swatch: '#E8C9A8',
  },
  {
    type: 3,
    roman: 'III',
    name: 'Medium',
    cue: 'Sometimes burns',
    swatch: '#D4A574',
  },
  {
    type: 4,
    roman: 'IV',
    name: 'Olive',
    cue: 'Rarely burns',
    swatch: '#B07D4F',
  },
  {
    type: 5,
    roman: 'V',
    name: 'Brown',
    cue: 'Very rarely burns',
    swatch: '#8D5524',
  },
  {
    type: 6,
    roman: 'VI',
    name: 'Deep',
    cue: 'Never burns',
    swatch: '#3B2214',
  },
];

export function getFitzpatrickMeta(type: number | null | undefined): FitzpatrickMeta | null {
  if (type == null) return null;
  return FITZPATRICK_TYPES.find((t) => t.type === type) ?? null;
}

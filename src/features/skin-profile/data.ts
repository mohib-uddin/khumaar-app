/**
 * Shared, static skin-profile data for the post-onboarding experience.
 *
 * In production this would come from the analysis API / query layer. Keeping it
 * co-located and strongly typed lets the dashboard, profile, analysis and
 * product surfaces all read from one mock source until the backend lands.
 *
 * `position` fields are 0–1 and drive the score bars; `value` is the
 * human-readable label shown on the right. They are decoupled on purpose — a
 * "110°" neck angle and a "93%" symmetry both map onto the same 0–1 track.
 */
import type { Tone } from './tones';

export type { Tone } from './tones';

/* ----------------------------------------------------------------------------
 * Latest scan summary
 * ------------------------------------------------------------------------- */

export type ScanSummary = {
  score: number;
  total: number;
  /** e.g. "+9.7%" since the previous weekly scan. */
  deltaLabel: string;
  capturedLabel: string;
  statusLabel: string;
  topImprovement: string;
  topConcern: string;
  /** One-line, non-technical read on the latest scan. */
  headline: string;
};

export const scanSummary: ScanSummary = {
  score: 86,
  total: 100,
  deltaLabel: '+9.7%',
  capturedLabel: '15 mins ago',
  statusLabel: 'Ahead of roadmap',
  topImprovement: 'Inflammation calmed',
  topConcern: 'Hydration',
  headline: 'Your skin is clearer and calmer than last week. Keep hydration as your focus.',
};

/* ----------------------------------------------------------------------------
 * Skin health metrics
 * ------------------------------------------------------------------------- */

export type SkinMetric = {
  id: string;
  label: string;
  /** Plain-language hint shown under the label. */
  helper?: string;
  value: string;
  position: number;
  tone: Tone;
};

export const skinMetrics: SkinMetric[] = [
  { id: 'clarity', label: 'Clarity', helper: 'Active breakouts', value: 'Clear', position: 0.82, tone: 'good' },
  { id: 'hydration', label: 'Hydration', helper: 'Moisture level', value: 'Low', position: 0.34, tone: 'improve' },
  { id: 'texture', label: 'Texture', helper: 'Smoothness', value: 'Even', position: 0.68, tone: 'average' },
  { id: 'redness', label: 'Redness', helper: 'Inflammation', value: 'Mild', position: 0.6, tone: 'average' },
  { id: 'pigmentation', label: 'Even tone', helper: 'Dark spots', value: 'Good', position: 0.74, tone: 'good' },
  { id: 'dark-circles', label: 'Under-eye', helper: 'Dark circles', value: 'Visible', position: 0.42, tone: 'improve' },
  { id: 'pores', label: 'Pores', helper: 'Visibility', value: 'Refined', position: 0.7, tone: 'average' },
  { id: 'oil', label: 'Oil balance', helper: 'Shine', value: 'Balanced', position: 0.66, tone: 'average' },
];

/* ----------------------------------------------------------------------------
 * Facial ratios (reference-inspired)
 * ------------------------------------------------------------------------- */

export type RatioBadge = 'key' | 'new';

export type RatioMetric = {
  id: string;
  label: string;
  helper?: string;
  value: string;
  position: number;
  tone: Tone;
  badge?: RatioBadge;
};

export type RatioGroup = {
  id: string;
  title: string;
  /** Group-level average chip, e.g. "Avg 3.3". */
  averageLabel?: string;
  averageTone?: Tone;
  metrics: RatioMetric[];
};

export type FacialScore = {
  overall: number;
  max: number;
  category: string;
  tone: Tone;
  front: number;
  side: number;
  combined: number;
  /** Approx. population percentile, e.g. "Top 20%". */
  percentileLabel: string;
};

export type RatioHighlight = {
  id: string;
  label: string;
  value: string;
  position: number;
  tone: Tone;
  /** Short, actionable next step shown on improvement items. */
  suggestion?: string;
};

export type FacialRatios = {
  score: FacialScore;
  counts: { strengths: number; average: number; improve: number };
  front: RatioGroup[];
  side: RatioGroup[];
  strengths: RatioHighlight[];
  improvements: RatioHighlight[];
};

export const facialRatios: FacialRatios = {
  score: {
    overall: 7.2,
    max: 10,
    category: 'Above average',
    tone: 'good',
    front: 7.0,
    side: 7.4,
    combined: 7.2,
    percentileLabel: 'Top 25%',
  },
  counts: { strengths: 13, average: 6, improve: 5 },
  front: [
    {
      id: 'thirds',
      title: 'Facial thirds',
      averageLabel: 'Balanced',
      averageTone: 'average',
      metrics: [
        { id: 'lower-third', label: 'Lower face third', value: 'Balanced', position: 0.62, tone: 'average' },
        { id: 'upper-third', label: 'Upper face third', value: 'Slightly short', position: 0.54, tone: 'average' },
        { id: 'middle-third', label: 'Middle face third', value: 'Ideal', position: 0.78, tone: 'good' },
      ],
    },
    {
      id: 'symmetry',
      title: 'Symmetry',
      averageLabel: 'Strong',
      averageTone: 'good',
      metrics: [
        { id: 'midline', label: 'Midline alignment', helper: 'Center balance', value: 'Aligned', position: 0.7, tone: 'good' },
        { id: 'face-symmetry', label: 'Face symmetry', value: '93%', position: 0.9, tone: 'good', badge: 'key' },
      ],
    },
    {
      id: 'eyes',
      title: 'Eye area',
      averageLabel: 'Good',
      averageTone: 'good',
      metrics: [
        { id: 'brow-height', label: 'Brow position', value: 'Ideal', position: 0.82, tone: 'good' },
        { id: 'canthal', label: 'Eye tilt', helper: 'Canthal angle', value: 'Neutral', position: 0.66, tone: 'average', badge: 'new' },
      ],
    },
    {
      id: 'golden',
      title: 'Golden ratio',
      averageLabel: 'Close',
      averageTone: 'good',
      metrics: [
        { id: 'golden-ratio', label: 'Golden ratio fit', helper: 'Overall proportion', value: '88%', position: 0.84, tone: 'good', badge: 'key' },
      ],
    },
  ],
  side: [
    {
      id: 'chin',
      title: 'Chin & jaw',
      averageLabel: 'Improving',
      averageTone: 'average',
      metrics: [
        { id: 'jaw-angle', label: 'Jaw definition', value: 'Developing', position: 0.5, tone: 'improve', badge: 'key' },
        { id: 'chin-projection', label: 'Chin projection', value: 'Slightly back', position: 0.46, tone: 'improve' },
        { id: 'neck-angle', label: 'Neck angle', helper: 'Posture line', value: 'Good', position: 0.72, tone: 'good' },
      ],
    },
    {
      id: 'profile',
      title: 'Profile',
      averageLabel: 'Strong',
      averageTone: 'good',
      metrics: [
        { id: 'facial-angle', label: 'Profile balance', value: 'Harmonious', position: 0.78, tone: 'good', badge: 'key' },
        { id: 'e-line', label: 'Lip projection', helper: 'E-line', value: 'Ideal', position: 0.8, tone: 'good' },
      ],
    },
    {
      id: 'nasal',
      title: 'Nose',
      averageLabel: 'Good',
      averageTone: 'good',
      metrics: [
        { id: 'nasofacial', label: 'Nose-to-face angle', value: 'Balanced', position: 0.68, tone: 'average' },
        { id: 'tip-rotation', label: 'Tip rotation', value: 'Ideal', position: 0.76, tone: 'good', badge: 'new' },
      ],
    },
  ],
  strengths: [
    { id: 's-symmetry', label: 'Face symmetry', value: '93%', position: 0.9, tone: 'good' },
    { id: 's-profile', label: 'Profile balance', value: 'Harmonious', position: 0.82, tone: 'good' },
    { id: 's-eyes', label: 'Brow position', value: 'Ideal', position: 0.82, tone: 'good' },
    { id: 's-eline', label: 'Lip projection', value: 'Ideal', position: 0.8, tone: 'good' },
  ],
  improvements: [
    {
      id: 'i-jaw',
      label: 'Jaw definition',
      value: 'Developing',
      position: 0.5,
      tone: 'improve',
      suggestion: 'Daily jawline routine + lower body-fat',
    },
    {
      id: 'i-chin',
      label: 'Chin projection',
      value: 'Slightly back',
      position: 0.46,
      tone: 'improve',
      suggestion: 'Posture reset & mewing practice',
    },
    {
      id: 'i-undereye',
      label: 'Under-eye area',
      value: 'Visible circles',
      position: 0.42,
      tone: 'improve',
      suggestion: 'Improve sleep + caffeine eye serum',
    },
  ],
};

/* ----------------------------------------------------------------------------
 * Transformation roadmap
 * ------------------------------------------------------------------------- */

export type RoadmapStatus = 'done' | 'active' | 'upcoming';

export type RoadmapPhase = {
  id: string;
  month: string;
  title: string;
  status: RoadmapStatus;
  focus: string[];
  targets: string[];
  weeklyAction: string;
  progress: number;
};

export const roadmapPhases: RoadmapPhase[] = [
  {
    id: 'phase-1',
    month: 'Month 1',
    title: 'Calm & hydrate',
    status: 'active',
    focus: ['Acne reduction', 'Hydration'],
    targets: ['15% fewer active breakouts', 'Restored moisture barrier'],
    weeklyAction: 'Hydrating toner morning & night',
    progress: 64,
  },
  {
    id: 'phase-2',
    month: 'Month 2',
    title: 'Even the tone',
    status: 'upcoming',
    focus: ['Hyperpigmentation', 'Skin tone'],
    targets: ['More even complexion', 'Faded dark spots'],
    weeklyAction: 'Vitamin C serum every morning',
    progress: 0,
  },
  {
    id: 'phase-3',
    month: 'Month 3',
    title: 'Texture & glow',
    status: 'upcoming',
    focus: ['Texture', 'Glow'],
    targets: ['Smoother surface', 'Visible radiance'],
    weeklyAction: 'Gentle weekly exfoliation',
    progress: 0,
  },
  {
    id: 'phase-4',
    month: 'Month 4',
    title: 'Define & refine',
    status: 'upcoming',
    focus: ['Jawline', 'Posture', 'Consistency'],
    targets: ['Sharper definition', 'Daily routine streak'],
    weeklyAction: 'Facial fitness 4× per week',
    progress: 0,
  },
];

/* ----------------------------------------------------------------------------
 * Upcoming scans
 * ------------------------------------------------------------------------- */

export type UpcomingScan = {
  id: string;
  title: string;
  subtitle: string;
  dueLabel: string;
  /** Highlighted = the next required scan. */
  emphasis?: boolean;
};

export const upcomingScans: UpcomingScan[] = [
  { id: 'weekly', title: 'Weekly skin scan', subtitle: 'Tracks acne, redness & texture', dueLabel: 'In 3 days', emphasis: true },
  { id: 'ratios', title: 'Facial ratio scan', subtitle: 'Front & side profile', dueLabel: 'In 1 week' },
  { id: 'monthly', title: 'Monthly progress report', subtitle: 'Before & after summary', dueLabel: 'In 18 days' },
];

export const scanStreak = {
  current: 4,
  goal: 6,
  label: 'week streak',
};

/* ----------------------------------------------------------------------------
 * Product recommendations
 * ------------------------------------------------------------------------- */

export type ProductCategory =
  | 'Cleanser'
  | 'Toner'
  | 'Moisturizer'
  | 'Sunscreen'
  | 'Serum'
  | 'Retinoid'
  | 'Vitamin C'
  | 'Exfoliant'
  | 'Mask'
  | 'Mist'
  | 'Spot Treatment';

export type RoutineFit = 'morning' | 'night' | 'both';

export type PriceTier = '$' | '$$' | '$$$';

export type ProductRecommendation = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  priceTier: PriceTier;
  /** Display price e.g. "$14.99". Optional — resolved via product pricing helpers when omitted. */
  priceLabel?: string;
  imageUrl?: string;
  /** The concern this targets, in plain language. */
  concern: string;
  /** Why the AI picked it for this user. */
  reason: string;
  routineFit: RoutineFit;
  /** 0–100 match to the user's profile. */
  match: number;
  /** Routine step ids where this product is useful. */
  stepIds: string[];
  /** Compact intelligence tags shown as soft pills. */
  compatibility: string[];
  scanFit: string;
  environmentFit: string;
  affiliateUrl: string;
  source: 'curated' | 'open-beauty-facts';
  sourceUrl?: string;
  warnings?: string[];
};

export const productRecommendations: ProductRecommendation[] = [
  {
    id: 'p-cleanser',
    name: 'Gentle Hydrating Cleanser',
    brand: 'CeraVe',
    category: 'Cleanser',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=500&q=80',
    concern: 'Dryness & barrier',
    reason: 'Non-stripping formula to protect your moisture barrier while clearing oil.',
    routineFit: 'both',
    match: 96,
    stepIds: ['cleanser', 'makeup-remover'],
    compatibility: ['Barrier-safe', 'Non-stripping', 'AM + PM'],
    scanFit: 'Protects the moisture barrier flagged in your scan.',
    environmentFit: 'Gentle enough for high-UV days when skin feels stressed.',
    affiliateUrl: 'https://khumaar.app/affiliate/cerave-hydrating-cleanser',
    source: 'curated',
  },
  {
    id: 'p-cleanser-lrp',
    name: 'Toleriane Hydrating Cleanser',
    brand: 'La Roche-Posay',
    category: 'Cleanser',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=500&q=80',
    concern: 'Sensitive skin',
    reason: 'A dermatologist-favorite cleanse that stays gentle on reactive, barrier-compromised skin.',
    routineFit: 'both',
    match: 93,
    stepIds: ['cleanser', 'makeup-remover'],
    compatibility: ['Sensitive skin', 'Fragrance-free', 'AM + PM'],
    scanFit: 'Calms redness-prone areas flagged in your scan.',
    environmentFit: 'Ideal when UV and pollution stress your skin barrier.',
    affiliateUrl: 'https://khumaar.app/affiliate/lrp-toleriane-cleanser',
    source: 'curated',
  },
  {
    id: 'p-cleanser-vanicream',
    name: 'Gentle Facial Cleanser',
    brand: 'Vanicream',
    category: 'Cleanser',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80',
    concern: 'Barrier support',
    reason: 'Minimal-ingredient cleanse for days your skin feels tight or easily irritated.',
    routineFit: 'both',
    match: 91,
    stepIds: ['cleanser', 'makeup-remover'],
    compatibility: ['Minimal formula', 'Barrier-safe', 'Budget pick'],
    scanFit: 'Supports recovery when your scan shows barrier stress.',
    environmentFit: 'Good for dry indoor air and post-sun days.',
    affiliateUrl: 'https://khumaar.app/affiliate/vanicream-gentle-cleanser',
    source: 'curated',
  },
  {
    id: 'p-toner',
    name: 'Rice Toner',
    brand: "I'm From",
    category: 'Toner',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    concern: 'Hydration & glow',
    reason: 'Adds light hydration after cleansing without making the T-zone feel heavy.',
    routineFit: 'both',
    match: 95,
    stepIds: ['toner'],
    compatibility: ['Hydration boost', 'Oil-balanced', 'Scan focus'],
    scanFit: 'Supports the hydration focus from your latest analysis.',
    environmentFit: 'Good for dry indoor air and high UV exposure.',
    affiliateUrl: 'https://khumaar.app/affiliate/im-from-rice-toner',
    source: 'curated',
  },
  {
    id: 'p-toner-cosrx',
    name: 'Centella Water Alcohol-Free Toner',
    brand: 'COSRX',
    category: 'Toner',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80',
    concern: 'Redness & calm',
    reason: 'Soothes post-cleanse skin while keeping oilier zones balanced.',
    routineFit: 'both',
    match: 92,
    stepIds: ['toner'],
    compatibility: ['Soothing', 'Alcohol-free', 'Oil-balanced'],
    scanFit: 'Helps calm the inflammation signals from your scan.',
    environmentFit: 'Useful on high-UV days when skin feels warm or reactive.',
    affiliateUrl: 'https://khumaar.app/affiliate/cosrx-centella-toner',
    source: 'curated',
  },
  {
    id: 'p-toner-klairs',
    name: 'Supple Preparation Unscented Toner',
    brand: 'Klairs',
    category: 'Toner',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=500&q=80',
    concern: 'Hydration',
    reason: 'Layers hydration without heaviness, making serum and moisturizer absorb better.',
    routineFit: 'both',
    match: 89,
    stepIds: ['toner'],
    compatibility: ['Layering toner', 'Unscented', 'Hydration boost'],
    scanFit: 'Boosts moisture where your scan shows dehydration.',
    environmentFit: 'Great when indoor heating or AC dries your skin out.',
    affiliateUrl: 'https://khumaar.app/affiliate/klairs-supple-toner',
    source: 'curated',
  },
  {
    id: 'p-vitc',
    name: 'Vitamin C Brightening Serum',
    brand: 'La Roche-Posay',
    category: 'Vitamin C',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80',
    concern: 'Dark spots & tone',
    reason: 'Targets the hyperpigmentation flagged in your scan and evens skin tone.',
    routineFit: 'morning',
    match: 92,
    stepIds: ['serum'],
    compatibility: ['Tone support', 'AM routine', 'Antioxidant'],
    scanFit: 'Matches the dark spot and uneven tone signals from the scan.',
    environmentFit: 'Pairs well with SPF when UV is high.',
    affiliateUrl: 'https://khumaar.app/affiliate/la-roche-posay-vitamin-c',
    source: 'curated',
  },
  {
    id: 'p-moist',
    name: 'Oil-Free Daily Moisturizer',
    brand: 'Neutrogena',
    category: 'Moisturizer',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=500&q=80',
    concern: 'Hydration',
    reason: 'Lightweight hydration for your low moisture level without clogging pores.',
    routineFit: 'both',
    match: 90,
    stepIds: ['moisturizer'],
    compatibility: ['Oil-free', 'Lightweight', 'Barrier support'],
    scanFit: 'Adds moisture without overloading oily areas.',
    environmentFit: 'Useful after sun and dry-air exposure.',
    affiliateUrl: 'https://khumaar.app/affiliate/neutrogena-oil-free-moisturizer',
    source: 'curated',
  },
  {
    id: 'p-moist-cerave',
    name: 'PM Facial Moisturizing Lotion',
    brand: 'CeraVe',
    category: 'Moisturizer',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=500&q=80',
    concern: 'Barrier repair',
    reason: 'Ceramide-rich night hydration that repairs without clogging pores.',
    routineFit: 'night',
    match: 88,
    stepIds: ['moisturizer'],
    compatibility: ['Ceramides', 'Night routine', 'Barrier repair'],
    scanFit: 'Rebuilds barrier strength flagged as a focus area.',
    environmentFit: 'Strong pick for dry nights after sun exposure.',
    affiliateUrl: 'https://khumaar.app/affiliate/cerave-pm-moisturizer',
    source: 'curated',
  },
  {
    id: 'p-moist-hydro',
    name: 'Hydro Boost Water Gel',
    brand: 'Neutrogena',
    category: 'Moisturizer',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80',
    concern: 'Lightweight hydration',
    reason: 'Gel-cream texture that hydrates oily and combination skin without shine.',
    routineFit: 'both',
    match: 86,
    stepIds: ['moisturizer'],
    compatibility: ['Gel texture', 'Oil-free', 'Lightweight'],
    scanFit: 'Adds water-based moisture without worsening oiliness.',
    environmentFit: 'Comfortable in humid or high-UV conditions.',
    affiliateUrl: 'https://khumaar.app/affiliate/neutrogena-hydro-boost',
    source: 'curated',
  },
  {
    id: 'p-spf',
    name: 'Invisible Fluid SPF 50',
    brand: 'Bioré',
    category: 'Sunscreen',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=500&q=80',
    concern: 'Sun protection',
    reason: 'Daily UV defense to lock in pigmentation progress under high UV exposure.',
    routineFit: 'morning',
    match: 94,
    stepIds: ['spf-reapply'],
    compatibility: ['High UV fit', 'No white cast', 'AM routine'],
    scanFit: 'Protects tone progress and dark spot recovery.',
    environmentFit: 'Recommended for today’s high UV environment.',
    affiliateUrl: 'https://khumaar.app/affiliate/biore-invisible-fluid-spf50',
    source: 'curated',
  },
  {
    id: 'p-spf-lrp',
    name: 'Anthelios UV Mune SPF 50+',
    brand: 'La Roche-Posay',
    category: 'Sunscreen',
    priceTier: '$$$',
    imageUrl:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=500&q=80',
    concern: 'High protection',
    reason: 'Broad-spectrum protection with a finish that works well under makeup.',
    routineFit: 'morning',
    match: 91,
    stepIds: ['spf-reapply'],
    compatibility: ['Broad spectrum', 'Makeup-friendly', 'High protection'],
    scanFit: 'Protects pigmentation progress from your scan goals.',
    environmentFit: 'Top pick for today’s high UV reading.',
    affiliateUrl: 'https://khumaar.app/affiliate/lrp-anthelios-spf50',
    source: 'curated',
  },
  {
    id: 'p-spf-boj',
    name: 'Relief Sun Rice + Probiotics SPF 50+',
    brand: 'Beauty of Joseon',
    category: 'Sunscreen',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80',
    concern: 'Daily wear',
    reason: 'Lightweight, glow-friendly SPF that feels comfortable for everyday reapplication.',
    routineFit: 'morning',
    match: 89,
    stepIds: ['spf-reapply'],
    compatibility: ['No white cast', 'Daily wear', 'Glow finish'],
    scanFit: 'Keeps tone-evening progress protected outdoors.',
    environmentFit: 'Easy to reapply through the day in strong sun.',
    affiliateUrl: 'https://khumaar.app/affiliate/boj-relief-sun',
    source: 'curated',
  },
  {
    id: 'p-retinoid',
    name: 'Retinol 0.3% Night Treatment',
    brand: 'The Ordinary',
    category: 'Retinoid',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=500&q=80',
    concern: 'Texture & ageing',
    reason: 'Gradually smooths texture and supports cell turnover. Start 2× per week.',
    routineFit: 'night',
    match: 85,
    stepIds: ['serum'],
    compatibility: ['Texture support', 'Night only', 'Slow start'],
    scanFit: 'Helps smooth the texture concerns in your skin profile.',
    environmentFit: 'Use at night and pair with SPF the next morning.',
    affiliateUrl: 'https://khumaar.app/affiliate/the-ordinary-retinol-03',
    source: 'curated',
  },
  {
    id: 'p-eye',
    name: 'Caffeine Eye Serum',
    brand: 'The Inkey List',
    category: 'Serum',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=500&q=80',
    concern: 'Under-eye circles',
    reason: 'De-puffs and brightens the under-eye area highlighted in your facial scan.',
    routineFit: 'both',
    match: 88,
    stepIds: ['serum'],
    compatibility: ['Eye area', 'De-puffing', 'AM + PM'],
    scanFit: 'Targets under-eye fatigue from the facial scan.',
    environmentFit: 'Helpful after poor sleep or screen-heavy days.',
    affiliateUrl: 'https://khumaar.app/affiliate/inkey-list-caffeine-eye-serum',
    source: 'curated',
  },
  {
    id: 'p-exfoliant',
    name: 'Mandelic Acid 5% Skin Prep Water',
    brand: 'By Wishtrend',
    category: 'Exfoliant',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=500&q=80',
    concern: 'Texture & congestion',
    reason: 'A gentler exfoliant option for smoothing texture without over-stripping.',
    routineFit: 'night',
    match: 87,
    stepIds: ['exfoliant'],
    compatibility: ['Gentle acid', 'Texture support', 'Weekly'],
    scanFit: 'Supports smoother skin texture while respecting sensitivity.',
    environmentFit: 'Best used at night, away from high UV exposure.',
    affiliateUrl: 'https://khumaar.app/affiliate/by-wishtrend-mandelic-acid',
    source: 'curated',
  },
  {
    id: 'p-exfoliant-bha',
    name: 'Skin Perfecting 2% BHA Liquid',
    brand: "Paula's Choice",
    category: 'Exfoliant',
    priceTier: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80',
    concern: 'Pores & texture',
    reason: 'Clears congestion inside pores while keeping the surface smooth.',
    routineFit: 'night',
    match: 84,
    stepIds: ['exfoliant'],
    compatibility: ['BHA', 'Pore care', 'Weekly'],
    scanFit: 'Targets texture and congestion from your scan.',
    environmentFit: 'Use at night; follow with SPF the next morning.',
    affiliateUrl: 'https://khumaar.app/affiliate/paulas-choice-bha',
    source: 'curated',
  },
  {
    id: 'p-exfoliant-lactic',
    name: 'Lactic Acid 5% + HA',
    brand: 'The Ordinary',
    category: 'Exfoliant',
    priceTier: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=500&q=80',
    concern: 'Dullness',
    reason: 'Gentle surface exfoliation with hydration support for brighter skin.',
    routineFit: 'night',
    match: 82,
    stepIds: ['exfoliant'],
    compatibility: ['Gentle acid', 'Brightening', 'Budget pick'],
    scanFit: 'Improves dullness without aggressive irritation.',
    environmentFit: 'Best as a weekly night treatment.',
    affiliateUrl: 'https://khumaar.app/affiliate/the-ordinary-lactic-acid',
    source: 'curated',
  },
];

/* ----------------------------------------------------------------------------
 * Routine adherence
 * ------------------------------------------------------------------------- */

export const routineAdherence = {
  consistency: 78,
  completedThisWeek: 11,
  totalThisWeek: 14,
  missed: ['Night serum (Tue)', 'Sunscreen reapply (Thu)'],
  nextAction: 'Apply your evening retinol treatment',
};

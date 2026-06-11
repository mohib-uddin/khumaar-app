import {
  productRecommendations,
  type ProductCategory,
  type ProductRecommendation,
  type RoutineFit,
} from '@/features/skin-profile';

import { searchOpenBeautyFactsProducts } from './openBeautyFacts';

type RoutineProductConfig = {
  stepIds: string[];
  label: string;
  category: ProductCategory;
  searchTerms: string;
  routineFit: RoutineFit;
  concern: string;
  scanFit: string;
  environmentFit: string;
  compatibility: string[];
  baseMatch: number;
};

const ROUTINE_PRODUCT_CONFIG: RoutineProductConfig[] = [
  {
    stepIds: ['cleanser', 'makeup-remover'],
    label: 'Recommended cleanser',
    category: 'Cleanser',
    searchTerms: 'cleanser',
    routineFit: 'both',
    concern: 'Dryness & barrier',
    scanFit: 'Protects the moisture barrier flagged in your scan.',
    environmentFit: 'Gentle enough for high-UV days when skin feels stressed.',
    compatibility: ['Barrier-safe', 'Non-stripping', 'AM + PM'],
    baseMatch: 96,
  },
  {
    stepIds: ['toner'],
    label: 'Recommended toner',
    category: 'Toner',
    searchTerms: 'toner',
    routineFit: 'both',
    concern: 'Hydration & glow',
    scanFit: 'Supports the hydration focus from your latest analysis.',
    environmentFit: 'Good for dry indoor air and high UV exposure.',
    compatibility: ['Hydration boost', 'Oil-balanced', 'Scan focus'],
    baseMatch: 95,
  },
  {
    stepIds: ['serum'],
    label: 'Recommended serum',
    category: 'Serum',
    searchTerms: 'serum',
    routineFit: 'morning',
    concern: 'Dark spots & tone',
    scanFit: 'Matches the dark spot and uneven tone signals from the scan.',
    environmentFit: 'Pairs well with SPF when UV is high.',
    compatibility: ['Tone support', 'AM routine', 'Antioxidant'],
    baseMatch: 92,
  },
  {
    stepIds: ['moisturizer'],
    label: 'Recommended moisturizer',
    category: 'Moisturizer',
    searchTerms: 'moisturizer',
    routineFit: 'both',
    concern: 'Hydration',
    scanFit: 'Adds moisture without overloading oily areas.',
    environmentFit: 'Useful after sun and dry-air exposure.',
    compatibility: ['Oil-free', 'Lightweight', 'Barrier support'],
    baseMatch: 90,
  },
  {
    stepIds: ['spf-reapply'],
    label: 'Recommended SPF',
    category: 'Sunscreen',
    searchTerms: 'sunscreen',
    routineFit: 'morning',
    concern: 'Sun protection',
    scanFit: 'Protects tone progress and dark spot recovery.',
    environmentFit: 'Recommended for today’s high UV environment.',
    compatibility: ['High UV fit', 'No white cast', 'AM routine'],
    baseMatch: 94,
  },
  {
    stepIds: ['exfoliant'],
    label: 'Recommended exfoliant',
    category: 'Exfoliant',
    searchTerms: 'exfoliant',
    routineFit: 'night',
    concern: 'Texture & congestion',
    scanFit: 'Supports smoother skin texture while respecting sensitivity.',
    environmentFit: 'Best used at night, away from high UV exposure.',
    compatibility: ['Gentle acid', 'Texture support', 'Weekly'],
    baseMatch: 87,
  },
];

const productCache = new Map<string, ProductRecommendation[]>();

function configForStep(stepId: string) {
  return ROUTINE_PRODUCT_CONFIG.find((config) => config.stepIds.includes(stepId));
}

function dedupeProducts(products: ProductRecommendation[]) {
  const seen = new Set<string>();
  return products.filter((product) => {
    const key = `${product.brand}-${product.name}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getRoutineProductEntry(stepId: string) {
  const config = configForStep(stepId);
  if (!config) return null;

  const picks = getFallbackProductsForRoutineStep(stepId);
  const pickCount = Math.min(Math.max(picks.length, 1), MIN_STEP_PRODUCTS);

  return {
    label: config.label,
    category: config.category,
    pickCount,
  };
}

export function getFallbackProductsForRoutineStep(stepId: string) {
  const config = configForStep(stepId);

  return productRecommendations
    .filter(
      (product) =>
        product.stepIds.includes(stepId) ||
        (config ? product.category === config.category : false),
    )
    .sort((a, b) => b.match - a.match);
}

const MIN_STEP_PRODUCTS = 3;

function ensureMinimumProducts(
  products: ProductRecommendation[],
  stepId: string,
  config: RoutineProductConfig,
) {
  if (products.length >= MIN_STEP_PRODUCTS) {
    return products.slice(0, MIN_STEP_PRODUCTS);
  }

  const padded = dedupeProducts([
    ...products,
    ...getFallbackProductsForRoutineStep(stepId),
    ...productRecommendations.filter((product) => product.category === config.category),
  ]);

  return padded.slice(0, MIN_STEP_PRODUCTS);
}

export async function loadProductsForRoutineStep(stepId: string) {
  const config = configForStep(stepId);
  if (!config) return [];

  const cached = productCache.get(stepId);
  if (cached) return cached;

  const liveProducts = await searchOpenBeautyFactsProducts(config.searchTerms, {
    baseMatch: config.baseMatch,
    category: config.category,
    compatibility: config.compatibility,
    concern: config.concern,
    environmentFit: config.environmentFit,
    routineFit: config.routineFit,
    scanFit: config.scanFit,
    stepIds: config.stepIds,
  });
  const fallbackProducts = getFallbackProductsForRoutineStep(stepId);
  const products = ensureMinimumProducts(
    dedupeProducts([...liveProducts, ...fallbackProducts]),
    stepId,
    config,
  );

  productCache.set(stepId, products);
  return products;
}

export async function loadFeaturedProductRecommendations() {
  const stepIds = ['cleanser', 'toner', 'moisturizer', 'spf-reapply', 'serum'];
  const groups = await Promise.all(stepIds.map((stepId) => loadProductsForRoutineStep(stepId)));
  return dedupeProducts(groups.flat()).slice(0, 12);
}

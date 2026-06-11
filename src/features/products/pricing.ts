import type { ProductCategory, ProductRecommendation, PriceTier } from '@/features/skin-profile';

const TIER_FALLBACK: Record<PriceTier, string> = {
  '$': '$12.99',
  '$$': '$24.99',
  '$$$': '$38.99',
};

const CURATED_PRICES: Record<string, string> = {
  'p-cleanser': '$14.99',
  'p-cleanser-lrp': '$16.99',
  'p-cleanser-vanicream': '$9.99',
  'p-toner': '$27.00',
  'p-toner-cosrx': '$18.00',
  'p-toner-klairs': '$22.00',
  'p-vitc': '$42.99',
  'p-moist': '$13.49',
  'p-moist-cerave': '$15.99',
  'p-moist-hydro': '$19.97',
  'p-spf': '$17.99',
  'p-spf-lrp': '$36.99',
  'p-spf-boj': '$15.00',
  'p-retinoid': '$8.90',
  'p-eye': '$11.00',
  'p-exfoliant': '$22.00',
  'p-exfoliant-bha': '$35.00',
  'p-exfoliant-lactic': '$8.70',
};

const CATEGORY_BASE_PRICE: Partial<Record<ProductCategory, number>> = {
  Cleanser: 13.99,
  Toner: 21.99,
  Moisturizer: 17.49,
  Sunscreen: 19.99,
  Serum: 24.99,
  'Vitamin C': 38.99,
  Retinoid: 9.99,
  Exfoliant: 21.99,
  Mask: 18.99,
  Mist: 14.99,
  'Spot Treatment': 12.99,
};

/** Human-readable retail price for product cards and sheets. */
export function formatProductPrice(product: Pick<ProductRecommendation, 'id' | 'priceLabel' | 'priceTier' | 'category'>): string {
  if (product.priceLabel) return product.priceLabel;
  if (CURATED_PRICES[product.id]) return CURATED_PRICES[product.id];
  return TIER_FALLBACK[product.priceTier];
}

/** Estimated shelf price for live Open Beauty Facts products (no price in API). */
export function estimateLiveProductPrice(category: ProductCategory, index: number) {
  const base = CATEGORY_BASE_PRICE[category] ?? 19.99;
  const price = base + index * 4.25;
  return `$${price.toFixed(2)}`;
}

import type {
  ProductCategory,
  ProductRecommendation,
  RoutineFit,
} from '@/features/skin-profile';

import { estimateLiveProductPrice } from './pricing';

type OpenBeautyFactsProduct = {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  image_front_url?: string;
  image_url?: string;
  labels_tags?: string[];
  categories_tags?: string[];
  url?: string;
};

type OpenBeautyFactsSearchResponse = {
  products?: OpenBeautyFactsProduct[];
};

type NormalizeOptions = {
  category: ProductCategory;
  routineFit: RoutineFit;
  stepIds: string[];
  concern: string;
  scanFit: string;
  environmentFit: string;
  compatibility: string[];
  baseMatch: number;
};

const BASE_URL = 'https://world.openbeautyfacts.org/cgi/search.pl';
const REQUEST_TIMEOUT_MS = 4500;

function firstBrand(value?: string) {
  return value?.split(',')[0]?.trim() || 'Verified brand';
}

function cleanName(product: OpenBeautyFactsProduct) {
  return product.product_name_en?.trim() || product.product_name?.trim();
}

function productUrl(product: OpenBeautyFactsProduct) {
  if (product.url) return product.url;
  if (product.code) return `https://world.openbeautyfacts.org/product/${product.code}`;
  return 'https://world.openbeautyfacts.org/';
}

function mockAffiliateUrl(product: OpenBeautyFactsProduct) {
  const productId = product.code || cleanName(product)?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `https://khumaar.app/affiliate/open-beauty-facts/${productId ?? 'product'}`;
}

function normalizeProduct(
  product: OpenBeautyFactsProduct,
  index: number,
  options: NormalizeOptions,
): ProductRecommendation | null {
  const name = cleanName(product);
  const imageUrl = product.image_front_url || product.image_url;

  if (!name || !imageUrl) return null;

  return {
    id: `obf-${product.code ?? `${options.category}-${index}`}`,
    name,
    brand: firstBrand(product.brands),
    category: options.category,
    priceTier: index === 0 ? '$$' : '$',
    priceLabel: estimateLiveProductPrice(options.category, index),
    imageUrl,
    concern: options.concern,
    reason: `Live product match from Open Beauty Facts for your ${options.category.toLowerCase()} step.`,
    routineFit: options.routineFit,
    match: Math.max(options.baseMatch - index * 3, 82),
    stepIds: options.stepIds,
    compatibility: options.compatibility,
    scanFit: options.scanFit,
    environmentFit: options.environmentFit,
    affiliateUrl: mockAffiliateUrl(product),
    source: 'open-beauty-facts',
    sourceUrl: productUrl(product),
  };
}

export async function searchOpenBeautyFactsProducts(
  searchTerms: string,
  options: NormalizeOptions,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const params = new URLSearchParams({
    action: 'process',
    fields: 'code,product_name,product_name_en,brands,image_front_url,image_url,labels_tags,categories_tags,url',
    json: '1',
    page_size: '12',
    search_simple: '1',
    search_terms: searchTerms,
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Khumaar/1.0 (hello@khumaar.app)',
      },
      signal: controller.signal,
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as OpenBeautyFactsSearchResponse;
    return (payload.products ?? [])
      .map((product, index) => normalizeProduct(product, index, options))
      .filter((product): product is ProductRecommendation => Boolean(product))
      .slice(0, 3);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

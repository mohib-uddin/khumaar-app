/**
 * Public env for the Expo app. Never put Anthropic or service-role keys here.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
const revenueCatApiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim() ?? '';

export const env = {
  supabaseUrl: url,
  supabaseAnonKey: anonKey,
  revenueCatApiKey,
  isSupabaseConfigured: Boolean(url && anonKey),
  isRevenueCatConfigured: Boolean(revenueCatApiKey),
} as const;

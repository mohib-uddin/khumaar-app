/**
 * Public env for the Expo app. Never put Anthropic or service-role keys here.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

export const env = {
  supabaseUrl: url,
  supabaseAnonKey: anonKey,
  isSupabaseConfigured: Boolean(url && anonKey),
} as const;

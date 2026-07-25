import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { env } from '@/lib/env';
import { getSupabase } from '@/lib/supabase';
import type { OnboardingStep, ProfileRow, SkinFeel } from '@/lib/database.types';
import type { AnalysisMetric, RoutinePlan, ScanAnalysisRow } from '@/lib/database.types';
import type { ScanPose } from '@/features/onboarding/constants';

WebBrowser.maybeCompleteAuthSession();

export function createAuthRedirectUri() {
  return makeRedirectUri({
    scheme: 'khumaar',
    path: 'auth/callback',
  });
}

async function createSessionFromUrl(url: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;
  if (!access_token) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token: refresh_token ?? '',
  });
  if (error) throw error;
  return data.session;
}

export async function signInWithOAuthProvider(provider: 'google' | 'apple') {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const redirectTo = createAuthRedirectUri();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;
  if (!data.url) throw new Error('No OAuth URL returned');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') {
    throw new Error('Sign-in was cancelled');
  }
  return createSessionFromUrl(result.url);
}

/** Native Apple Sign In (iOS) → Supabase id token. */
export async function signInWithAppleNative() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error('No identity token from Apple');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  });
  if (error) throw error;

  const fullName = [credential.fullName?.givenName, credential.fullName?.familyName]
    .filter(Boolean)
    .join(' ');
  if (fullName && data.user) {
    await supabase.from('profiles').update({ display_name: fullName }).eq('id', data.user.id);
  }

  return data.session;
}

export async function signInWithApple() {
  if (Platform.OS === 'ios') {
    try {
      return await signInWithAppleNative();
    } catch (error) {
      // Fall back to OAuth web flow if native is unavailable / misconfigured
      if (__DEV__) {
        console.warn('Native Apple sign-in failed, trying OAuth', error);
      }
    }
  }
  return signInWithOAuthProvider('apple');
}

export async function signInWithGoogle() {
  return signInWithOAuthProvider('google');
}

/** Dev-only path so onboarding can be tested without OAuth client IDs. */
export async function signInDevAnonymous() {
  if (!__DEV__) {
    throw new Error('Dev sign-in is only available in development');
  }
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function ensureProfile(userId: string, displayName?: string | null) {
  const existing = await fetchProfile(userId);
  if (existing) return existing;

  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      display_name: displayName ?? null,
      onboarding_step: 'consent',
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function updateOnboardingStep(userId: string, step: OnboardingStep) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase.from('profiles').update({ onboarding_step: step }).eq('id', userId);
  if (error) throw error;
}

export async function saveConsents(userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const now = new Date().toISOString();
  const types = ['terms', 'privacy', 'wellness_disclaimer', 'photo_ai'] as const;

  const { error: eventsError } = await supabase.from('consent_events').insert(
    types.map((consent_type) => ({
      user_id: userId,
      consent_type,
      accepted: true,
    })),
  );
  if (eventsError) throw eventsError;

  const { error } = await supabase
    .from('profiles')
    .update({
      terms_accepted_at: now,
      privacy_accepted_at: now,
      wellness_disclaimer_accepted_at: now,
      photo_ai_consent_at: now,
      onboarding_step: 'concerns',
    })
    .eq('id', userId);
  if (error) throw error;
}

export async function saveConcerns(userId: string, concerns: string[]) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase
    .from('profiles')
    .update({ concerns, onboarding_step: 'feel' })
    .eq('id', userId);
  if (error) throw error;
}

export async function saveSkinFeel(userId: string, skinFeel: SkinFeel) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase
    .from('profiles')
    .update({ skin_feel: skinFeel, onboarding_step: 'prep' })
    .eq('id', userId);
  if (error) throw error;
}

export async function uploadScanPose(params: {
  userId: string;
  batchId: string;
  pose: ScanPose;
  localUri: string;
}) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const path = `${params.userId}/onboarding/${params.batchId}/${params.pose}.jpg`;
  // RN fetch(fileUri).blob() often reports type text/plain; Storage rejects that.
  // Upload raw bytes with an explicit JPEG content type instead.
  const response = await fetch(params.localUri);
  if (!response.ok) {
    throw new Error(`Failed to read scan photo (${response.status})`);
  }
  const bytes = await response.arrayBuffer();

  const { error: uploadError } = await supabase.storage.from('scan-photos').upload(path, bytes, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('scans')
    .insert({
      user_id: params.userId,
      view: params.pose,
      storage_path: path,
      status: 'uploaded',
      batch_id: params.batchId,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function invokeOnboardingAnalyze(batchId: string): Promise<ScanAnalysisRow> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');

  const { data, error } = await supabase.functions.invoke('onboarding-analyze', {
    body: { batch_id: batchId },
  });
  if (error) throw error;

  const analysis = (data as { analysis?: ScanAnalysisRow })?.analysis;
  if (!analysis) {
    throw new Error('Analysis returned no result');
  }
  return {
    ...analysis,
    metrics: (analysis.metrics ?? []) as AnalysisMetric[],
    routine_plan: (analysis.routine_plan ?? null) as RoutinePlan | null,
    fitzpatrick_type:
      typeof analysis.fitzpatrick_type === 'number' ? analysis.fitzpatrick_type : null,
  };
}

export async function fetchLatestAnalysis(userId: string): Promise<ScanAnalysisRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('scan_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    metrics: (data.metrics ?? []) as AnalysisMetric[],
    routine_plan: (data.routine_plan ?? null) as RoutinePlan | null,
    fitzpatrick_type: typeof data.fitzpatrick_type === 'number' ? data.fitzpatrick_type : null,
  };
}

export async function fetchAnalysisByBatchId(
  userId: string,
  batchId: string,
): Promise<ScanAnalysisRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('scan_analyses')
    .select('*')
    .eq('user_id', userId)
    .eq('batch_id', batchId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    metrics: (data.metrics ?? []) as AnalysisMetric[],
    routine_plan: (data.routine_plan ?? null) as RoutinePlan | null,
    fitzpatrick_type: typeof data.fitzpatrick_type === 'number' ? data.fitzpatrick_type : null,
  };
}

export async function completeOnboarding(userId: string, ritualId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured');
  const { error } = await supabase
    .from('profiles')
    .update({
      onboarding_step: 'done',
      starter_ritual_id: ritualId,
    })
    .eq('id', userId);
  if (error) throw error;
}

export function isBackendReady() {
  return env.isSupabaseConfigured;
}

# Onboarding setup (Khumaar)

Project: [`kppuwckmuoapvcycovqd`](https://supabase.com/dashboard/project/kppuwckmuoapvcycovqd)

## App env

Copy `.env.example` → `.env` (already seeded with project URL + anon key for local):

```
EXPO_PUBLIC_SUPABASE_URL=https://kppuwckmuoapvcycovqd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<Project Settings → API → anon / publishable>
```

Restart Expo after changing env (`npx expo start -c`).

## Supabase Auth providers

In [Authentication → Providers](https://supabase.com/dashboard/project/kppuwckmuoapvcycovqd/auth/providers):

1. **Apple** — enable; add Services ID / key from Apple Developer (required for production Sign in with Apple).
2. **Google** — enable; add Web client ID + secret from Google Cloud Console.
3. **Anonymous** (optional, recommended for local QA) — enable so **Dev continue (anonymous)** works in `__DEV__`.

Redirect URLs (Authentication → URL configuration):

- `khumaar://auth/callback`
- `exp://127.0.0.1:8081/--/auth/callback` (Expo Go / dev)
- Your Expo auth session redirect from `makeRedirectUri({ scheme: 'khumaar', path: 'auth/callback' })`

## Edge Function secret (Claude)

Dashboard → Edge Functions → Secrets:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Function: `onboarding-analyze`  
Without the key, analysis still completes using a **heuristic** from concerns + skin feel so onboarding stays testable.

## Face scanner (VisionCamera)

Onboarding scan uses:
- `react-native-vision-camera` v5 (no Expo config plugin — set camera permission strings in `app.json` `ios.infoPlist` / `android.permissions`)
- `@noma4i/vision-camera-face-detector` (iOS: VisionCamera object output; Android: Nitro ML Kit)
- **Yaw-based** left/right cheek gating in `src/features/onboarding/scanQuality.ts` (not bbox aspect hacks)
- A `patch-package` patch exposes `yawAngle` from iOS `ScannedFace` / Android ML Kit `headEulerAngleY` (`patches/@noma4i+vision-camera-face-detector+3.0.1.patch`)

Requires a **native rebuild** after install or after updating the face-detector patch:

```bash
npx expo run:ios
# or
npx expo run:android
```

Expo Go is not supported for this scanner. Auto-capture needs face size + head yaw in the target band; side poses soft-unlock the shutter after ~12s so users cannot get stuck.

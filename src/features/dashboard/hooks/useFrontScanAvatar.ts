import { useEffect, useState } from 'react';

import { useAuth } from '@/features/onboarding';
import { getSupabase } from '@/lib/supabase';

/** Signed URL for the latest front-facing scan photo (PNG fallback handled by UI). */
export function useFrontScanAvatar(batchId?: string | null) {
  const { user } = useAuth();
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!user?.id) {
        setUri(null);
        return;
      }
      const supabase = getSupabase();
      if (!supabase) return;

      let query = supabase
        .from('scans')
        .select('storage_path, created_at')
        .eq('user_id', user.id)
        .eq('view', 'front')
        .order('created_at', { ascending: false })
        .limit(1);

      if (batchId) {
        query = supabase
          .from('scans')
          .select('storage_path, created_at')
          .eq('user_id', user.id)
          .eq('view', 'front')
          .eq('batch_id', batchId)
          .limit(1);
      }

      const { data } = await query.maybeSingle();
      if (!data?.storage_path) {
        if (!cancelled) setUri(null);
        return;
      }

      const { data: signed } = await supabase.storage
        .from('scan-photos')
        .createSignedUrl(data.storage_path, 60 * 60);
      if (!cancelled) setUri(signed?.signedUrl ?? null);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, batchId]);

  return uri;
}

import { createClient } from "@supabase/supabase-js";
import type { SiteStats } from "@/lib/types";

// Use the anon key — service_role returns 403 in this project.
// site_stats has a public read RLS policy so anon key is sufficient.
function getReadClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function getSiteStatsAdmin(): Promise<SiteStats | null> {
  try {
    const { data, error } = await getReadClient()
      .from("site_stats")
      .select("*")
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    return data as SiteStats;
  } catch {
    return null;
  }
}

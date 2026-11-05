import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SiteStats } from "@/lib/types";

export async function getSiteStatsAdmin(): Promise<SiteStats | null> {
  try {
    const { data, error } = await supabaseAdmin
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

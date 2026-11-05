import { createClient } from "@/lib/supabase/server";
import type { SiteStats } from "@/lib/types";

export async function getSiteStats(): Promise<SiteStats | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_stats")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      console.error("Error fetching site_stats:", error);
      return null;
    }
    return data as SiteStats;
  } catch (err) {
    console.error("Failed to getSiteStats:", err);
    return null;
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function updateSiteStats(
  eventsCompleted: number,
  totalVolunteers: number
) {
  try {
    const supabase = await createClient();
    const updateData = {
      events_completed: eventsCompleted,
      total_volunteers: totalVolunteers,
      updated_at: new Date().toISOString(),
    };

    const userRes = await supabase
      .from("site_stats")
      .update(updateData)
      .eq("id", 1);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("site_stats")
        .update(updateData)
        .eq("id", 1);

      if (adminRes.error) {
        console.error("Error updating site stats:", userRes.error || adminRes.error);
        return { success: false, error: userRes.error?.message || adminRes.error.message };
      }
    }

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to updateSiteStats:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

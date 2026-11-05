"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function upsertPlottingRow(
  formId: string,
  row: { id?: string; person_name: string; quota: number }
) {
  try {
    const payload: {
      id?: string;
      form_id: string;
      person_name: string;
      quota: number;
    } = {
      form_id: formId,
      person_name: row.person_name,
      quota: row.quota,
    };

    if (row.id) {
      payload.id = row.id;
    }

    const supabase = await createClient();
    let data = null;

    const userRes = await supabase
      .from("plotting")
      .upsert(payload)
      .select()
      .single();

    if (!userRes.error && userRes.data) {
      data = userRes.data;
    } else {
      const adminRes = await supabaseAdmin
        .from("plotting")
        .upsert(payload)
        .select()
        .single();

      if (adminRes.error) {
        console.error("Error upserting plotting row:", userRes.error || adminRes.error);
        return { success: false, error: userRes.error?.message || adminRes.error.message };
      }
      data = adminRes.data;
    }

    revalidatePath("/admin/plotting");
    return { success: true, data };
  } catch (err: unknown) {
    console.error("Failed to upsertPlottingRow:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function deletePlottingRow(id: string) {
  try {
    const supabase = await createClient();
    const userRes = await supabase
      .from("plotting")
      .delete()
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("plotting")
        .delete()
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error deleting plotting row:", userRes.error || adminRes.error);
        return { success: false, error: userRes.error?.message || adminRes.error.message };
      }
    }

    revalidatePath("/admin/plotting");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to deletePlottingRow:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

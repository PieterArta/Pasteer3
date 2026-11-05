"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cloudinary } from "@/lib/cloudinary";
import type { Event } from "@/lib/types";

export async function upsertEvent(data: Partial<Event>) {
  try {
    const payload = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const supabase = await createClient();

    // 1. Try with user client (has RLS authenticated admin permissions)
    let result = null;
    const userRes = await supabase
      .from("events")
      .upsert(payload)
      .select()
      .single();

    if (!userRes.error && userRes.data) {
      result = userRes.data;
    } else {
      // 2. Fallback to supabaseAdmin
      const adminRes = await supabaseAdmin
        .from("events")
        .upsert(payload)
        .select()
        .single();

      if (adminRes.error) {
        console.error("Error upserting event:", userRes.error || adminRes.error);
        return {
          success: false,
          error: userRes.error?.message || adminRes.error.message,
        };
      }
      result = adminRes.data;
    }

    revalidatePath("/admin/kegiatan");
    revalidatePath("/events");
    revalidatePath("/");
    return { success: true, data: result };
  } catch (err: unknown) {
    console.error("Failed to upsertEvent:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function deleteEvent(id: string, imagePublicId?: string) {
  try {
    const supabase = await createClient();
    const userRes = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("events")
        .delete()
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error deleting event:", userRes.error || adminRes.error);
        return {
          success: false,
          error: userRes.error?.message || adminRes.error.message,
        };
      }
    }

    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (cloudErr) {
        console.error("Cloudinary destroy error:", cloudErr);
      }
    }

    revalidatePath("/admin/kegiatan");
    revalidatePath("/events");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to deleteEvent:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

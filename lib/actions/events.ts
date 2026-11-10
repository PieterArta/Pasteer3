"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import type { Event } from "@/lib/types";

export async function upsertEvent(data: Partial<Event>) {
  try {
    const supabase = await createClient();

    // If updating existing event and image was changed, cleanup the old image from Cloudinary
    if (data.id && data.image_public_id) {
      try {
        const { data: existing } = await supabase
          .from("events")
          .select("image_public_id, image_url")
          .eq("id", data.id)
          .maybeSingle();

        if (
          existing &&
          existing.image_public_id &&
          existing.image_public_id !== data.image_public_id
        ) {
          await deleteCloudinaryImage(existing.image_public_id);
        }
      } catch (checkErr) {
        console.warn("Could not check old event image for cleanup:", checkErr);
      }
    }

    const payload = {
      ...data,
      updated_at: new Date().toISOString(),
    };

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

    // 1. Cari data gambar sebelum baris dihapus dari Supabase
    let targetImage = imagePublicId;
    if (!targetImage) {
      const { data: existing } = await supabase
        .from("events")
        .select("image_public_id, image_url")
        .eq("id", id)
        .maybeSingle();

      if (existing) {
        targetImage = existing.image_public_id || existing.image_url;
      } else {
        const { data: adminExisting } = await supabaseAdmin
          .from("events")
          .select("image_public_id, image_url")
          .eq("id", id)
          .maybeSingle();
        if (adminExisting) {
          targetImage = adminExisting.image_public_id || adminExisting.image_url;
        }
      }
    }

    // 2. Hapus baris dari tabel Supabase
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

    // 3. Hapus foto dari Cloudinary secara otomatis
    if (targetImage) {
      await deleteCloudinaryImage(targetImage);
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

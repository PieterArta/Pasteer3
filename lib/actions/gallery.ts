"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cloudinary } from "@/lib/cloudinary";
import type { GalleryPhoto } from "@/lib/types";

export async function upsertGalleryPhoto(data: Partial<GalleryPhoto>) {
  try {
    const supabase = await createClient();
    let result = null;

    const userRes = await supabase
      .from("gallery")
      .upsert(data)
      .select()
      .single();

    if (!userRes.error && userRes.data) {
      result = userRes.data;
    } else {
      const adminRes = await supabaseAdmin
        .from("gallery")
        .upsert(data)
        .select()
        .single();

      if (adminRes.error) {
        console.error("Error upserting gallery photo:", userRes.error || adminRes.error);
        return {
          success: false,
          error: userRes.error?.message || adminRes.error.message,
        };
      }
      result = adminRes.data;
    }

    revalidatePath("/admin/galeri");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true, data: result };
  } catch (err: unknown) {
    console.error("Failed to upsertGalleryPhoto:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function deleteGalleryPhoto(id: string, imagePublicId?: string) {
  try {
    const supabase = await createClient();
    const userRes = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("gallery")
        .delete()
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error deleting gallery photo:", userRes.error || adminRes.error);
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

    revalidatePath("/admin/galeri");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to deleteGalleryPhoto:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function updateSortOrder(
  updates: { id: string; sort_order: number }[]
) {
  try {
    const supabase = await createClient();
    for (const item of updates) {
      const userRes = await supabase
        .from("gallery")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);

      if (userRes.error) {
        const adminRes = await supabaseAdmin
          .from("gallery")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id);

        if (adminRes.error) {
          console.error(`Error updating sort order for ${item.id}:`, userRes.error || adminRes.error);
        }
      }
    }

    revalidatePath("/admin/galeri");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to updateSortOrder:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

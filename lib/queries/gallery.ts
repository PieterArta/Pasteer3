import { createClient } from "@/lib/supabase/server";
import type { GalleryPhoto } from "@/lib/types";

export async function getGallery(): Promise<GalleryPhoto[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) {
      console.error("Error fetching gallery:", error);
      return [];
    }
    return data as GalleryPhoto[];
  } catch (err) {
    console.error("Failed to getGallery:", err);
    return [];
  }
}

export async function getGalleryPreview(limit = 6): Promise<GalleryPhoto[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error || !data) {
      console.error("Error fetching gallery preview:", error);
      return [];
    }
    return data as GalleryPhoto[];
  } catch (err) {
    console.error("Failed to getGalleryPreview:", err);
    return [];
  }
}

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public_id from a Cloudinary URL if available.
 * Handles: https://res.cloudinary.com/<cloud>/image/upload/v1234/folder/name.ext
 */
export function extractCloudinaryPublicId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let rest = parts[1].replace(/^v\d+\//, "");
    const lastDot = rest.lastIndexOf(".");
    if (lastDot !== -1) {
      rest = rest.substring(0, lastDot);
    }
    return decodeURIComponent(rest);
  } catch {
    return null;
  }
}

/**
 * Deletes an image from Cloudinary using either public_id or its full Cloudinary URL.
 */
export async function deleteCloudinaryImage(
  publicIdOrUrl?: string | null
): Promise<{ success: boolean; result?: string; error?: unknown }> {
  if (!publicIdOrUrl) return { success: true };

  let publicId = publicIdOrUrl.trim();
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    const extracted = extractCloudinaryPublicId(publicId);
    if (!extracted) {
      return { success: true };
    }
    publicId = extracted;
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return { success: true, result: res.result };
  } catch (error) {
    console.error(`Gagal menghapus gambar dari Cloudinary (${publicId}):`, error);
    return { success: false, error };
  }
}

export { cloudinary };

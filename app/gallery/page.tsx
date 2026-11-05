import type { Metadata } from "next";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import CtaBand from "@/components/home/CtaBand";
import { getGallery } from "@/lib/queries/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri Kami | PASTEER3",
  description:
    "Dokumentasi kegiatan PASTEER3, komunitas volunteer dari Lampung.",
};

export default async function GalleryPage() {
  const photos = await getGallery();
  const safePhotos = photos && photos.length > 0 ? photos : [];

  return (
    <main>
      <GalleryHero />
      <GalleryGrid initialPhotos={safePhotos} />
      <CtaBand />
    </main>
  );
}

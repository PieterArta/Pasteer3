import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Events from "@/components/home/Events";
import GalleryPreview from "@/components/home/GalleryPreview";
import CtaBand from "@/components/home/CtaBand";
import type { Metadata } from "next";
import { getSiteStats } from "@/lib/queries/stats";
import { getRecentEvents } from "@/lib/queries/events";
import { getGalleryPreview } from "@/lib/queries/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PASTEER3 | Pasukan Volunteer Lampung",
  description:
    "Komunitas volunteer dari Lampung yang menyediakan tenaga relawan untuk berbagai acara. Bukan sekadar menyalurkan tenaga, tapi kami menyalurkan kebahagiaan.",
  openGraph: {
    title: "PASTEER3 | Pasukan Volunteer Lampung",
    description:
      "Komunitas volunteer dari Lampung yang menyediakan tenaga relawan untuk berbagai acara.",
    url: "https://pasteer3.id",
    siteName: "PASTEER3",
    locale: "id_ID",
    type: "website",
  },
};

export default async function Home() {
  const [stats, recentEvents, galleryPhotos] = await Promise.all([
    getSiteStats(),
    getRecentEvents(3),
    getGalleryPreview(6),
  ]);

  const siteStats = stats ?? {
    id: 1,
    events_completed: 0,
    total_volunteers: 0,
  };
  const events = recentEvents && recentEvents.length > 0 ? recentEvents : [];
  const photos = galleryPhotos && galleryPhotos.length > 0 ? galleryPhotos : [];

  return (
    <main>
      {/* 1. Hero – full bleed, overlapped by Navbar */}
      <Hero />

      {/* 2. Tentang */}
      <About stats={siteStats} />

      {/* 3. Kegiatan – light surface background */}
      <Events events={events} />

      {/* 4. Galeri preview */}
      <GalleryPreview photos={photos} />

      {/* 5. CTA Band */}
      <CtaBand />
    </main>
  );
}
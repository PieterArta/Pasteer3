import { getGallery } from "@/lib/queries/gallery";
import { getEvents } from "@/lib/queries/events";
import GalleryClient from "@/components/admin/GalleryClient";

export const dynamic = "force-dynamic";

export default async function AdminGaleriPage() {
  const [gallery, events] = await Promise.all([getGallery(), getEvents()]);

  return <GalleryClient initialPhotos={gallery} events={events} />;
}

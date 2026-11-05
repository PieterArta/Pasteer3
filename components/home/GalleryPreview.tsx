import Image from "next/image";
import Link from "next/link";
import { galleryPhotos as fallbackPhotos } from "@/lib/data";
import type { GalleryPhoto } from "@/lib/types";

/** Circled letter + label + rule */
function SectionMarker({
  letter,
  label,
  rightSlot,
}: {
  letter: string;
  label: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-6 place-items-center rounded-full border border-ink text-xs font-semibold shrink-0">
        {letter}
      </span>
      <span className="text-xs font-semibold tracking-widest uppercase text-ink">
        {label}
      </span>
      <div className="flex-1 h-px bg-line" />
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}

export default function GalleryPreview({
  photos: initialPhotos,
}: {
  photos?: GalleryPhoto[] | null;
}) {
  const sourcePhotos =
    initialPhotos && initialPhotos.length >= 6
      ? initialPhotos.slice(0, 6)
      : fallbackPhotos.slice(0, 6);

  const photos = sourcePhotos.map((p, i) => {
    const src =
      ("image_url" in p && p.image_url) ||
      ("src" in p && typeof p.src === "string" && p.src) ||
      fallbackPhotos[i]?.src ||
      "/images/placeholder/gallery-1.jpg";
    const alt =
      ("alt" in p && typeof p.alt === "string" && p.alt) ||
      p.caption ||
      fallbackPhotos[i]?.alt ||
      "Dokumentasi PASTEER3";
    const tag =
      ("tag" in p && typeof p.tag === "string" && p.tag) ||
      fallbackPhotos[i]?.tag;

    return {
      id: p.id || `gallery-p-${i}`,
      src,
      alt,
      caption: p.caption || fallbackPhotos[i]?.caption,
      tag,
    };
  });

  return (
    <section
      aria-labelledby="gallery-heading"
      className="container-site py-16 md:py-24"
    >
      <SectionMarker
        letter="C"
        label="GALERI"
        rightSlot={
          <Link
            href="/gallery"
            className="text-xs md:text-sm font-semibold text-ink hover:text-primary transition-colors flex items-center gap-1"
          >
            Lihat Galeri →
          </Link>
        }
      />

      <h2 id="gallery-heading" className="sr-only">
        Galeri Foto PASTEER3
      </h2>

      {/* Bento grid: 6 photos, 8px gap, 4px radius */}
      <div className="mt-8 flex flex-col gap-2">
        {/* Top block: Large photo left (40%), 2x2 grid right (60%) on desktop. On mobile, first photo spans both columns */}
        <div className="grid grid-cols-2 gap-2 md:grid-cols-12">
          {/* Photo 0 – Large photo (approx 40% on desktop, full width on mobile) */}
          <div className="relative col-span-2 overflow-hidden rounded-[4px] aspect-[4/3] md:aspect-auto md:col-span-5 md:min-h-[440px] group">
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4">
              {photos[0].tag && (
                <span className="block text-[11px] font-bold text-accent tracking-wider uppercase mb-1">
                  {photos[0].tag}
                </span>
              )}
              {photos[0].caption && (
                <p className="font-display text-lg md:text-xl text-white uppercase leading-tight">
                  {photos[0].caption}
                </p>
              )}
            </div>
          </div>

          {/* Photos 1-4 – 2x2 grid of 4 smaller photos (~60% on desktop) */}
          <div className="col-span-2 grid grid-cols-2 gap-2 md:col-span-7">
            {photos.slice(1, 5).map((photo) => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-[4px] aspect-[4/3] sm:aspect-square md:aspect-[4/3] group"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Photo 5 – Full-width panoramic wide photo at bottom */}
        <div className="relative w-full overflow-hidden rounded-[4px] aspect-[16/7] md:aspect-[16/4] group">
          <Image
            src={photos[5].src}
            alt={photos[5].alt}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          {photos[5].caption && (
            <p className="absolute bottom-4 left-4 text-xs md:text-sm font-semibold text-white drop-shadow-sm">
              {photos[5].caption}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

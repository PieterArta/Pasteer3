"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowDownToLine } from "lucide-react";
import { galleryPhotos as fallbackData } from "@/lib/data";
import type { GalleryPhoto } from "@/lib/types";
import GalleryPopup from "./GalleryPopup";

// 12 photos cycling through the 6 placeholder files
const PHOTO_COUNT = 12;
const fallbackPhotos = Array.from({ length: PHOTO_COUNT }, (_, i) => {
  const base = fallbackData[i % fallbackData.length];
  return {
    ...base,
    id: `gallery-photo-${i + 1}`,
    alt:
      i < fallbackData.length
        ? base.alt
        : `${base.alt} (${Math.floor(i / fallbackData.length) + 1})`,
  };
});

export default function GalleryGrid({
  initialPhotos,
}: {
  initialPhotos?: GalleryPhoto[] | null;
}) {
  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  const photos = useMemo(() => {
    if (initialPhotos && initialPhotos.length > 0) {
      return initialPhotos.map((p, i) => ({
        id: p.id,
        src: p.image_url,
        alt: p.caption || `Foto Galeri PASTEER3 ${i + 1}`,
        caption: p.caption || undefined,
      }));
    }
    return fallbackPhotos;
  }, [initialPhotos]);

  const openPopup = useCallback((i: number) => setPopupIndex(i), []);
  const closePopup = useCallback(() => setPopupIndex(null), []);
  const navigate = useCallback((i: number) => setPopupIndex(i), []);

  const handleLoadMore = () => {
    console.log("Muat Lebih Banyak clicked");
  };

  return (
    <section
      aria-labelledby="gallery-section-label"
      className="relative bg-white"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(14,14,14,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="container-site py-12 md:py-16">
        {/* Section line marker */}
        <div className="mb-8 flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-ink"
          >
            <span className="font-display text-[11px] leading-none text-ink">A</span>
          </div>
          <span
            id="gallery-section-label"
            className="text-xs font-semibold uppercase tracking-widest text-ink"
          >
            SEMUA FOTO
          </span>
          <div className="flex-1 border-t border-line" aria-hidden="true" />
        </div>

        {/* Square photo grid: 3 cols mobile, 4 cols desktop, 4px gap */}
        <div
          className="grid grid-cols-3 gap-1 md:grid-cols-4"
          role="list"
          aria-label="Galeri foto PASTEER3"
        >
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              role="listitem"
              className="aspect-square"
            >
              <button
                type="button"
                onClick={() => openPopup(index)}
                aria-label={`Buka foto: ${photo.alt}`}
                className="
                  group relative block size-full overflow-hidden rounded-[4px]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                "
              >
                {/* Photo — object-cover fills the square */}
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-none"
                  sizes="(max-width: 767px) 33vw, 25vw"
                  priority={index < 8}
                />

                {/* Desktop hover overlay — dark + lime arrow icon, 200ms fade */}
                {/* @media(hover:hover) ensures no hover state on touch devices */}
                <span
                  className="
                    pointer-events-none absolute inset-0 flex items-center justify-center
                    bg-black/0 opacity-0 transition-all duration-200
                    [@media(hover:hover)]:group-hover:bg-black/50 [@media(hover:hover)]:group-hover:opacity-100
                  "
                  aria-hidden="true"
                >
                  <span
                    className="
                      flex size-9 items-center justify-center rounded-[4px]
                      bg-accent text-ink
                    "
                  >
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Load more button */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            id="gallery-load-more"
            onClick={handleLoadMore}
            className="
              flex h-12 min-w-[220px] items-center justify-between rounded-sm
              border border-ink bg-transparent
              text-sm font-semibold uppercase tracking-wide text-ink
              transition-colors hover:bg-ink/5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
              md:min-w-[280px]
            "
          >
            <span className="flex-1 px-6 text-left">Muat Lebih Banyak</span>
            <span className="grid size-12 shrink-0 place-items-center rounded-r-sm bg-accent text-ink">
              <ArrowDownToLine size={18} strokeWidth={2.5} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>

      {/* Photo popup */}
      {popupIndex !== null && (
        <GalleryPopup
          photos={photos}
          currentIndex={popupIndex}
          onClose={closePopup}
          onNavigate={navigate}
        />
      )}
    </section>
  );
}

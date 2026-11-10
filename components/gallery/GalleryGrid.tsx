"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowDownToLine, Grid3X3, Layers, Images } from "lucide-react";
import type { GalleryPhoto } from "@/lib/types";
import GalleryPopup from "./GalleryPopup";

const PAGE_SIZE = 12;

export default function GalleryGrid({
  initialPhotos,
}: {
  initialPhotos?: GalleryPhoto[] | null;
}) {
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const photos = useMemo(() => {
    if (!initialPhotos || initialPhotos.length === 0) {
      return [];
    }
    return initialPhotos.map((p, i) => ({
      id: p.id,
      src: p.image_url,
      alt: p.caption || `Foto Galeri PASTEER3 ${i + 1}`,
      caption: p.caption || undefined,
    }));
  }, [initialPhotos]);

  const displayedPhotos = useMemo(() => {
    return photos.slice(0, visibleCount);
  }, [photos, visibleCount]);

  const openPopup = useCallback((i: number) => setPopupIndex(i), []);
  const closePopup = useCallback(() => setPopupIndex(null), []);
  const navigate = useCallback((i: number) => setPopupIndex(i), []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  if (photos.length === 0) {
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
        <div className="container-site py-16 md:py-24 text-center">
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

          <div className="mx-auto flex max-w-sm flex-col items-center justify-center py-12">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-line bg-surface text-muted">
              <Images size={22} />
            </div>
            <p className="text-sm font-semibold text-ink">Belum ada foto di galeri</p>
            <p className="mt-1 text-xs text-muted">
              Foto kegiatan yang diunggah melalui dashboard admin akan ditampilkan di sini.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
      <div className="container-site py-8 md:py-14">
        {/* Section Header: Aligned with site container */}
        <div className="mb-5 md:mb-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
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
              <span className="rounded-[4px] border border-line bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
                {photos.length}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted font-medium">
              <Grid3X3 size={14} />
            </div>
          </div>
          <div className="mt-3 border-t border-line" aria-hidden="true" />
        </div>

        {/* 
          Grid Container:
          - Mobile: -mx-[var(--container-pad)] expands edge-to-edge (0 margin, 100% viewport width)
          - Desktop: md:mx-0 aligns flush with the left container boundary, flowing left-to-right
        */}
        <div className="-mx-[var(--container-pad)] md:mx-0">
          <div
            className="grid grid-cols-3 gap-[2px] md:grid-cols-4 md:gap-2 lg:gap-3"
            role="list"
            aria-label="Galeri foto PASTEER3"
          >
            {displayedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                role="listitem"
                className="relative aspect-[4/5] overflow-hidden bg-surface"
              >
                <button
                  type="button"
                  onClick={() => openPopup(index)}
                  aria-label={`Buka foto: ${photo.alt}`}
                  className="
                    group relative block size-full overflow-hidden
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
                  "
                >
                  {/* Photo: 4/5 portrait ratio, object-cover */}
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 767px) 33.3vw, (max-width: 1200px) 25vw, 22vw"
                    priority={index < 6}
                  />

                  {/* Top-right Instagram-style media badge */}
                  <div
                    aria-hidden="true"
                    className="
                      absolute top-1.5 right-1.5 z-10 flex size-5.5 md:size-6.5 items-center justify-center
                      rounded-[3px] bg-black/45 text-white/95 backdrop-blur-[2px] pointer-events-none
                    "
                  >
                    <Layers size={12} className="md:size-3.5" />
                  </div>

                  {/* Desktop hover overlay with caption & view icon */}
                  <span
                    className="
                      pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-3 text-center
                      bg-black/0 opacity-0 transition-all duration-200
                      [@media(hover:hover)]:group-hover:bg-black/55 [@media(hover:hover)]:group-hover:opacity-100
                    "
                    aria-hidden="true"
                  >
                    <span className="flex size-9 items-center justify-center rounded-[4px] bg-accent text-ink shadow-md">
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </span>
                    {photo.caption && (
                      <p className="mt-2 line-clamp-2 text-xs font-semibold text-white drop-shadow">
                        {photo.caption}
                      </p>
                    )}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Load more button (only show when there are more photos to load) */}
          {photos.length > visibleCount && (
            <div className="mt-8 md:mt-12 flex justify-center px-4">
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
          )}
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

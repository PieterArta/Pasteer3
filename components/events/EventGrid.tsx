"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Event } from "@/lib/types";
import EventModal from "./EventModal";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventGrid({
  initialEvents,
}: {
  initialEvents?: Event[] | null;
}) {
  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  const openPopup = useCallback((index: number) => setPopupIndex(index), []);
  const closePopup = useCallback(() => setPopupIndex(null), []);
  const navigatePopup = useCallback((index: number) => setPopupIndex(index), []);

  const gridItems = useMemo(() => {
    if (!initialEvents || initialEvents.length === 0) return [];
    return initialEvents.map((ev) => ({
      id: ev.id,
      title: ev.title,
      date: ev.date || "",
      location: ev.location || "Bandar Lampung",
      image: ev.image_url || "/images/placeholder/event-locomotive.jpg",
      description:
        ev.description ||
        `Dokumentasi dan koordinasi volunteer PASTEER3 untuk ${ev.title}.`,
      status: (ev.status === "mendatang" ? "upcoming" : "completed") as
        | "upcoming"
        | "completed",
    }));
  }, [initialEvents]);

  if (gridItems.length === 0) {
    return (
      <section
        aria-labelledby="events-section-label"
        className="relative bg-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(14,14,14,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="container-site py-16 md:py-24">
          <div className="mb-8 flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full border border-ink"
            >
              <span className="font-display text-[11px] leading-none text-ink">A</span>
            </div>
            <span
              id="events-section-label"
              className="text-xs font-semibold uppercase tracking-widest text-ink"
            >
              SEMUA EVENT
            </span>
            <div className="flex-1 border-t border-line" aria-hidden="true" />
          </div>
          <p className="text-center text-sm text-muted py-16">
            Belum ada event yang tersedia.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="events-section-label"
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
            id="events-section-label"
            className="text-xs font-semibold uppercase tracking-widest text-ink"
          >
            SEMUA EVENT
          </span>
          <div className="flex-1 border-t border-line" aria-hidden="true" />
        </div>

        {/* Event grid: 2 cols mobile (gap 3px), 4 cols desktop (gap 4px) */}
        <div className="grid grid-cols-2 gap-[3px] md:grid-cols-4 md:gap-1" role="list">
          {gridItems.map((item, index) => {
            const isFeatured = index === 0;

            if (isFeatured) {
              return (
                <div
                  key={item.id}
                  role="listitem"
                  className="col-span-2 aspect-square md:col-span-1"
                >
                  <button
                    onClick={() => openPopup(0)}
                    className="
                      group relative block size-full overflow-hidden rounded-[6px]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                    "
                    aria-label={`Buka detail event: ${item.title}`}
                  >
                    {/* Photo */}
                    <Image
                      src={item.image}
                      alt={`Foto event ${item.title}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 767px) 100vw, 25vw"
                      priority
                    />

                    {/* Dark gradient overlay covering bottom 50% */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0F23]/85 via-[#0A0F23]/40 to-transparent"
                      aria-hidden="true"
                    />

                    {/* Top-right arrow button */}
                    <div
                      className="
                        absolute top-0 right-0 m-2 flex size-8 items-center justify-center rounded-[6px]
                        border border-white/20 bg-white/20 text-white backdrop-blur-sm
                        transition-colors group-hover:bg-[#CCFF00] group-hover:text-ink
                      "
                      aria-hidden="true"
                    >
                      <ArrowUpRight size={18} strokeWidth={2.5} />
                    </div>

                    {/* Content pinned to bottom-left */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                      <p className="font-display text-[20px] uppercase leading-tight text-white line-clamp-2">
                        {item.title}
                      </p>
                      {item.date && (
                        <p className="mt-1 font-sans text-[13px] text-white/70">
                          {formatDate(item.date)}
                        </p>
                      )}
                      <div className="mt-0.5 flex items-center gap-1 font-sans text-[13px] text-white/70">
                        <MapPin size={12} className="shrink-0 text-[#CCFF00]" aria-hidden="true" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </button>
                </div>
              );
            }

            return (
              <div key={item.id} role="listitem" className="aspect-square">
                <button
                  onClick={() => openPopup(index)}
                  className="
                    group relative block aspect-square size-full overflow-hidden rounded-[6px]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
                  "
                  aria-label={`Buka detail event: ${item.title}`}
                >
                  <Image
                    src={item.image}
                    alt={`Foto event ${item.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 767px) 50vw, 25vw"
                  />

                  {/* Desktop hover: small lime arrow button */}
                  <div
                    className="
                      absolute top-0 right-0 m-2 hidden size-8 items-center justify-center rounded-[6px]
                      bg-[#CCFF00] text-ink opacity-0 transition-opacity duration-200
                      group-hover:opacity-100 md:flex
                    "
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event modal */}
      {popupIndex !== null && (
        <EventModal
          events={gridItems}
          currentIndex={popupIndex}
          onClose={closePopup}
          onNavigate={navigatePopup}
        />
      )}
    </section>
  );
}

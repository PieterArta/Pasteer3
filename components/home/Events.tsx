"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin, Calendar } from "lucide-react";
import { events as fallbackEvents } from "@/lib/data";
import type { Event } from "@/lib/types";

/** Circled letter + label + rule */
function SectionMarker({
  letter,
  label,
}: {
  letter: string;
  label: string;
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
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Events({
  events: initialEvents,
}: {
  events?: Event[] | null;
}) {
  const displayedEvents =
    initialEvents && initialEvents.length > 0
      ? initialEvents.slice(0, 3)
      : fallbackEvents.slice(0, 3);
  const [active, setActive] = useState(
    displayedEvents.length > 1 ? 1 : 0
  ); // center card by default

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const scrollToCard = useCallback((idx: number) => {
    const card = cardRefs.current[idx];
    if (card && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetLeft =
        card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== active) {
      setActive(closestIndex);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    dragDistance.current = 0;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    startScrollLeft.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    dragDistance.current = Math.abs(walk);
    scrollContainerRef.current.scrollLeft = startScrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const prev = () => {
    const prevIdx = active > 0 ? active - 1 : displayedEvents.length - 1;
    scrollToCard(prevIdx);
  };

  const next = () => {
    const nextIdx = active < displayedEvents.length - 1 ? active + 1 : 0;
    scrollToCard(nextIdx);
  };

  // Center on middle card initially
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCard(1);
    }, 100);
    return () => clearTimeout(timer);
  }, [scrollToCard]);

  return (
    <section
      aria-labelledby="events-heading"
      className="bg-surface py-16 md:py-24 overflow-hidden"
    >
      <div className="container-site">
        <SectionMarker letter="B" label="KEGIATAN" />
        <h2
          id="events-heading"
          className="mt-6 font-display text-[32px] uppercase leading-tight md:text-[48px] text-ink sr-only"
        >
          Kegiatan Terbaru
        </h2>
      </div>

      {/* Horizontally scrollable container with CSS scroll-snap */}
      <div className="relative mt-8 w-full">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="flex gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar select-none py-6 cursor-grab active:cursor-grabbing px-[10vw] md:px-[calc(50%-240px)]"
          style={{
            touchAction: "pan-x pan-y",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {displayedEvents.map((event, idx) => (
            <div
              key={event.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onClick={() => {
                if (dragDistance.current > 8) return;
                scrollToCard(idx);
              }}
              className={`shrink-0 snap-center w-[80vw] max-w-[340px] md:max-w-none md:w-[480px] transition-all duration-300 cursor-pointer ${
                idx === active
                  ? "scale-100 opacity-100 shadow-xl"
                  : "scale-[0.93] opacity-65 md:opacity-75 hover:opacity-90"
              }`}
              role="group"
              aria-label={`Event ${idx + 1} dari ${displayedEvents.length}: ${event.title}`}
            >
              <EventCard event={event} isActive={idx === active} />
            </div>
          ))}
        </div>

        {/* Controls: Prev / Next + Dots */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={prev}
            aria-label="Event sebelumnya"
            className="grid size-10 place-items-center rounded-[4px] bg-white border border-line text-ink shadow-sm hover:bg-surface transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {displayedEvents.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                aria-label={`Ke event ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-primary" : "w-2 bg-line hover:bg-muted/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Event berikutnya"
            className="grid size-10 place-items-center rounded-[4px] bg-white border border-line text-ink shadow-sm hover:bg-surface transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  isActive,
}: {
  event: Event | (typeof fallbackEvents)[0];
  isActive: boolean;
}) {
  const imageUrl =
    ("image_url" in event && event.image_url) ||
    ("image" in event && typeof event.image === "string" && event.image) ||
    "/images/placeholder/event-locomotive.jpg";
  const isUpcoming =
    event.status === "upcoming" || event.status === "mendatang";

  return (
    <article className="rounded-[4px] overflow-hidden bg-white shadow-sm border border-line/60">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 80vw, 480px"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          {isUpcoming ? (
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              TERBARU
            </span>
          ) : (
            <span className="inline-flex items-center rounded-[4px] bg-ink/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              SELESAI
            </span>
          )}
        </div>

        {/* Date + location overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/90">
            {event.date && (
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formatDate(event.date)}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3
          className={`font-semibold leading-snug text-ink transition-all ${
            isActive ? "text-lg md:text-xl" : "text-base"
          }`}
        >
          {event.title}
        </h3>
        <p className="mt-1.5 text-xs md:text-sm text-muted line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>
    </article>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, CalendarDays, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { events as defaultEvents, type Event } from "@/lib/data";

export interface EventModalProps {
  events?: Event[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: Event["status"] }) {
  if (status === "upcoming") {
    return (
      <span
        className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink"
        style={{ backgroundColor: "#CCFF00" }}
      >
        MENDATANG
      </span>
    );
  }
  return (
    <span
      className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white border border-white/20"
    >
      SELESAI
    </span>
  );
}


export default function EventModal({
  events: providedEvents,
  currentIndex,
  onClose,
  onNavigate,
}: EventModalProps) {
  const events = providedEvents && providedEvents.length > 0 ? providedEvents : defaultEvents;
  const total = events.length;
  const safeIndex = ((currentIndex % total) + total) % total;
  const currentEvent = events[safeIndex];

  const [isClosing, setIsClosing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const prevIndex = (safeIndex - 1 + total) % total;
  const nextIndex = (safeIndex + 1) % total;

  // Handle animated close
  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  }, [onClose]);

  // Navigate prev/next
  const handleNavigate = useCallback(
    (idx: number) => {
      if (onNavigate) {
        onNavigate(idx);
      }
    },
    [onNavigate]
  );

  // Esc and Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerClose();
      } else if (e.key === "ArrowLeft") {
        handleNavigate(prevIndex);
      } else if (e.key === "ArrowRight") {
        handleNavigate(nextIndex);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerClose, handleNavigate, prevIndex, nextIndex]);

  // Lock body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Auto focus close button on open
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [safeIndex]);

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      triggerClose();
    }
  };

  const formattedCounter = `${String(safeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 md:items-center ${isClosing ? "opacity-0" : "opacity-100"
        }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Event: ${currentEvent.title}`}
    >
      {/* Bottom Sheet on Mobile / Centered Modal on Desktop */}
      <div
        ref={sheetRef}
        className={`
          z-50 flex w-full flex-col overflow-hidden rounded-t-[28px] border-t border-white/[0.12]
          bg-[#0F142D]/85 backdrop-blur-xl transition-all duration-300 ease-out
          md:static md:mx-auto md:w-[480px] md:max-w-[480px] md:rounded-[28px] md:border
          ${isClosing
            ? "translate-y-full md:scale-95 md:opacity-0"
            : "translate-y-0 md:scale-100 md:opacity-100"
          }
        `}
        style={{
          height: "85svh",
          maxHeight: "85svh",
          borderColor: "rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Drag handle at the top center: w-10 h-1 bg-white/30 rounded-full, margin 12px auto */}
        <div
          aria-hidden="true"
          className="mx-auto my-3 h-1 w-10 shrink-0 rounded-full bg-white/30"
        />

        {/* Scrollable inside (overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-6">
          {/* 1. Photo: aspect-[4/3], w-full, rounded-2xl, object-cover, relative */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src={currentEvent.image}
              alt={currentEvent.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
              priority
            />

            {/* Glass close button (X) absolute top-3 right-3: w-9 h-9, rounded-full, bg-white/20, backdrop-blur-md, border border-white/25, white X icon centered */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={triggerClose}
              aria-label="Tutup modal"
              className="
                absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full
                border border-white/25 bg-white/20 text-white backdrop-blur-md
                transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
              "
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* 2. Status badge (below photo, mt-3) */}
          <div className="mt-3">
            <StatusBadge status={currentEvent.status} />
          </div>

          {/* 3. Title (mt-2): Anton font, uppercase, text-white, text-[32px], leading-[1.1], line-clamp-2 */}
          <h2 className="mt-2 font-display text-[32px] uppercase leading-[1.1] text-white line-clamp-2">
            {currentEvent.title}
          </h2>

          {/* 4. Date row (mt-3): calendar icon (lucide CalendarDays, 16px, text-white/60) + date in Indonesian format */}
          <div className="mt-3 flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-white/60" aria-hidden="true" />
            <time
              dateTime={currentEvent.date}
              className="text-[14px] text-white/80"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {formatDate(currentEvent.date)}
            </time>
          </div>

          {/* 5. Location row (mt-1): pin icon (lucide MapPin, same style) + location name */}
          <div className="mt-1 flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-white/60" aria-hidden="true" />
            <span
              className="text-[14px] text-white/80"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {currentEvent.location}
            </span>
          </div>

          {/* 6. Description (mt-3): Inter text-[14px] text-white/70, leading-relaxed, line-clamp-4 */}
          <p
            className="mt-3 text-[14px] leading-relaxed text-white/70 line-clamp-4"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {currentEvent.description}
          </p>

          {/* 7. Bottom bar (mt-4, flex, justify-between, items-center) */}
          <div className="mt-4 flex items-center justify-between">
            {/* Left: page counter "01 / 12" in Inter text-[13px] text-white/50 */}
            <span
              className="text-[13px] text-white/50"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {formattedCounter}
            </span>

            {/* Right: two glass arrow buttons "←" "→", each w-10 h-10, rounded-xl, bg-white/10, backdrop-blur-md, border border-white/20 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavigate(prevIndex)}
                aria-label="Event sebelumnya"
                className="
                  flex size-10 items-center justify-center rounded-xl
                  border border-white/20 bg-white/10 text-white backdrop-blur-md
                  transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                "
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => handleNavigate(nextIndex)}
                aria-label="Event berikutnya"
                className="
                  flex size-10 items-center justify-center rounded-xl
                  border border-white/20 bg-white/10 text-white backdrop-blur-md
                  transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                "
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

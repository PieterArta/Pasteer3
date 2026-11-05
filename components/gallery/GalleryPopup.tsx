"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import type { GalleryPhoto } from "@/lib/data";

export interface GalleryPopupProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryPopup({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryPopupProps) {
  const total = photos.length;
  const safeIndex = ((currentIndex % total) + total) % total;
  const photo = photos[safeIndex];

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const prevIndex = (safeIndex - 1 + total) % total;
  const nextIndex = (safeIndex + 1) % total;

  // Close on Esc, navigate on arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onNavigate(prevIndex);
      else if (e.key === "ArrowRight") onNavigate(nextIndex);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate, prevIndex, nextIndex]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus close button on open / navigation
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, [safeIndex]);

  // Focus trap
  const handleKeyDownTrap = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;
      const modal = modalRef.current;
      if (!modal) return;
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    []
  );

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto galeri: ${photo.alt}`}
      onKeyDown={handleKeyDownTrap}
    >
      {/* Modal box */}
      <div
        ref={modalRef}
        className="relative flex items-center justify-center"
        style={{
          width: "100vw",
          height: "100svh",
        }}
      >
        {/* On desktop: constrained box; on mobile: full-screen */}
        <div
          className="
            relative flex items-center justify-center
            w-full h-full
            md:w-auto md:h-auto
            md:max-w-[80vw] md:max-h-[90vh]
          "
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
          }}
        >
          {/* Photo — natural aspect ratio, object-contain */}
          <div
            className="relative w-full h-full md:w-auto md:h-auto"
            style={{
              maxWidth: "80vw",
              maxHeight: "90vh",
              /* Let the image determine its own size on desktop */
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={900}
              className="
                block w-full h-full object-contain
                md:max-w-[80vw] md:max-h-[90vh]
              "
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              sizes="(max-width: 767px) 100vw, 80vw"
              priority
            />

            {/* Glass close button — top right of the photo area */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup galeri foto"
              className="
                absolute top-3 right-3 z-10 flex size-11 items-center justify-center rounded-sm
                border border-white/25 bg-white/15 text-white backdrop-blur-md
                transition-colors hover:bg-white/30
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
              "
            >
              <X size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>

          {/* Prev button — left edge of viewport / photo area */}
          <button
            type="button"
            onClick={() => onNavigate(prevIndex)}
            aria-label="Foto sebelumnya"
            className="
              absolute left-3 top-1/2 -translate-y-1/2 z-10
              flex size-11 items-center justify-center rounded-sm
              border border-white/25 bg-white/15 text-white backdrop-blur-md
              transition-colors hover:bg-white/30
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
              md:left-4
            "
          >
            <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>

          {/* Next button — right edge */}
          <button
            type="button"
            onClick={() => onNavigate(nextIndex)}
            aria-label="Foto berikutnya"
            className="
              absolute right-3 top-1/2 -translate-y-1/2 z-10
              flex size-11 items-center justify-center rounded-sm
              border border-white/25 bg-white/15 text-white backdrop-blur-md
              transition-colors hover:bg-white/30
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
              md:right-4
            "
          >
            <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        {/* Counter at bottom */}
        <span
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[13px] text-white/60 tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {String(safeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

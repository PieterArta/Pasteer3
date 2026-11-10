"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

  const [isClosing, setIsClosing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const currentDragY = useRef<number>(0);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const prevIndex = (safeIndex - 1 + total) % total;
  const nextIndex = (safeIndex + 1) % total;

  // Notify global navbar to hide on mount and restore on unmount/close
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("popup-open"));
    return () => {
      window.dispatchEvent(new CustomEvent("popup-close"));
    };
  }, []);

  // Handle animated close
  const triggerClose = useCallback(() => {
    setIsClosing(true);
    setDragOffset(0);
    setIsDragging(false);
    setTimeout(() => {
      onClose();
      window.dispatchEvent(new CustomEvent("popup-close"));
    }, 280);
  }, [onClose]);

  // Touch handlers for swipe-down-to-close on mobile drag handle area
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    touchStartY.current = e.touches[0].clientY;
    currentDragY.current = 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      currentDragY.current = diff;
      setDragOffset(diff);
    } else {
      currentDragY.current = 0;
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null) return;
    const finalDiff = currentDragY.current;
    touchStartY.current = null;
    setIsDragging(false);

    if (finalDiff > 80) {
      triggerClose();
    } else {
      setDragOffset(0);
    }
  };

  // Close on Esc, navigate on arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerClose();
      else if (e.key === "ArrowLeft") onNavigate(prevIndex);
      else if (e.key === "ArrowRight") onNavigate(nextIndex);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerClose, onNavigate, prevIndex, nextIndex]);

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) triggerClose();
  };

  const formattedCounter = `${String(safeIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-200 md:items-center ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto galeri: ${photo.alt}`}
    >
      {/* 
        MOBILE: Bottom sheet (md:hidden)
      */}
      <div
        ref={sheetRef}
        className={`
          z-50 flex w-full flex-col overflow-hidden rounded-t-[28px] border-t border-white/[0.12]
          bg-[#0F142D]/90 backdrop-blur-xl md:hidden
          ${
            isClosing
              ? "translate-y-full transition-all duration-300 ease-out"
              : isDragging
              ? ""
              : "translate-y-0 transition-all duration-200 ease-out"
          }
        `}
        style={{
          height: "75svh",
          maxHeight: "75svh",
          transform: !isClosing && dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
        }}
      >
        {/* Drag handle area (top 40px of sheet) for swipe-down-to-close */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="flex h-10 w-full shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
          aria-hidden="true"
        >
          <div className="h-1 w-10 rounded-full bg-white/30" />
        </div>

        {/* Scrollable content inside bottom sheet */}
        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-6 pt-1">
          {/* Photo container */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-black/20">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={900}
              className="max-h-full w-full object-contain"
              sizes="(max-width: 767px) 100vw, 80vw"
              priority
            />

            {/* Glass close button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={triggerClose}
              aria-label="Tutup modal"
              className="
                absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full
                border border-white/25 bg-white/20 text-white backdrop-blur-md
                transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
              "
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Caption text below photo */}
          {photo.caption && (
            <p className="mt-3 text-[13px] leading-relaxed text-white/70">
              {photo.caption}
            </p>
          )}

          {/* Bottom Bar: Counter + Prev/Next buttons */}
          <div className="mt-4 flex items-center justify-between">
            <span
              className="text-[13px] tabular-nums text-white/50"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {formattedCounter}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate(prevIndex)}
                aria-label="Foto sebelumnya"
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
                onClick={() => onNavigate(nextIndex)}
                aria-label="Foto berikutnya"
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

      {/* 
        DESKTOP: Centered modal (hidden md:flex)
      */}
      <div
        className={`
          relative hidden md:flex flex-col items-center justify-center
          max-w-[80vw] max-h-[90vh] transition-all duration-300 ease-out
          ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {/* Main image container */}
        <div className="relative flex flex-col items-center max-w-[80vw] max-h-[80vh]">
          {/* Glass close button top right */}
          <button
            type="button"
            onClick={triggerClose}
            aria-label="Tutup galeri foto"
            className="
              absolute -top-12 right-0 z-20 flex size-10 items-center justify-center rounded-full
              border border-white/25 bg-white/15 text-white backdrop-blur-md
              transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
            "
          >
            <X size={20} strokeWidth={2.5} aria-hidden="true" />
          </button>

          {/* Photo */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={1600}
              height={1200}
              className="block max-h-[75vh] max-w-[80vw] w-auto h-auto object-contain"
              sizes="80vw"
              priority
            />
          </div>

          {/* Caption text below photo */}
          {photo.caption && (
            <p className="mt-3 text-center text-[14px] leading-relaxed text-white/70 max-w-[60vw]">
              {photo.caption}
            </p>
          )}

          {/* Counter below */}
          <span
            className="mt-2 text-[13px] tabular-nums text-white/50"
            aria-live="polite"
          >
            {formattedCounter}
          </span>
        </div>

        {/* Prev button on left edge */}
        <button
          type="button"
          onClick={() => onNavigate(prevIndex)}
          aria-label="Foto sebelumnya"
          className="
            fixed left-6 top-1/2 -translate-y-1/2 z-20
            flex size-12 items-center justify-center rounded-2xl
            border border-white/20 bg-white/10 text-white backdrop-blur-md
            transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
          "
        >
          <ArrowLeft size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Next button on right edge */}
        <button
          type="button"
          onClick={() => onNavigate(nextIndex)}
          aria-label="Foto berikutnya"
          className="
            fixed right-6 top-1/2 -translate-y-1/2 z-20
            flex size-12 items-center justify-center rounded-2xl
            border border-white/20 bg-white/10 text-white backdrop-blur-md
            transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
          "
        >
          <ArrowRight size={22} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

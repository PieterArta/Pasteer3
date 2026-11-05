import { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const heroAlt =
    "Relawan PASTEER3 bertugas di water station acara lari di Lampung, menuangkan minuman untuk peserta dengan semangat kebersamaan";

  const common = {
    alt: heroAlt,
    sizes: "100vw",
    quality: 90,
    priority: true,
    fill: true,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: "/images/home/hero-desktop.jpg",
  });

  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({
    ...common,
    src: "/images/home/hero-mobile.jpg",
  });

  return (
    <section
      aria-label="Hero – PASTEER3"
      className="relative w-full overflow-hidden bg-primary-deep h-svh min-h-[560px]"
    >
      {/* ── Art-directed Hero Image (Next.js getImageProps + <picture>) ── */}
      <picture className="absolute inset-0 z-0 size-full">
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />
        <img
          {...rest}
          alt={heroAlt}
          sizes="100vw"
          fetchPriority="high"
          className="size-full object-cover object-[62%_center] md:object-center"
        />
      </picture>

      {/* ── Subtle dark gradient behind navbar for readability ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
        aria-hidden="true"
      />

      {/* ── Subtle dark gradient behind bottom card for readability ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-52 bg-gradient-to-t from-black/60 via-black/25 to-transparent"
        aria-hidden="true"
      />

      {/* ── Glass card – bottom left (respects mobile safe-area-inset-bottom) ── */}
      <div
        className="absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-4 z-[2] max-w-[260px] md:bottom-10 md:left-8"
        style={{
          background: "rgba(255,255,255,0.16)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.30)",
          borderRadius: "16px",
          padding: "16px 20px",
        }}
      >
        <p className="mb-2 text-xs font-medium tracking-wider text-white/70">
          — SEJAK 2024
        </p>
        <p className="mb-4 text-sm font-medium leading-snug text-white">
          Bukan Sekadar Menyalurkan Tenaga, Tapi Kami Menyalurkan Kebahagiaan
        </p>
        {/* TODO: wire these to a real carousel or modal */}
        <div className="flex gap-2">
          <button
            aria-label="Sebelumnya"
            className="grid size-9 place-items-center rounded-sm border border-white/20 bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <ArrowRight size={14} className="rotate-180" />
          </button>
          <button
            aria-label="Berikutnya"
            className="grid size-9 place-items-center rounded-sm border border-white/20 bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Accessible h1 (screen-reader only, visual headline is part of the photo) ── */}
      <h1 className="sr-only">PASTEER3 — Pasukan Volunteer Lampung</h1>
    </section>
  );
}

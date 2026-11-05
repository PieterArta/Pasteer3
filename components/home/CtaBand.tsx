import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function CtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-primary-deep"
    >
      <div className="container-site py-16 md:py-24 text-center">
        {/* Pill badge */}
        <div className="inline-block rounded-sm border border-accent px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent mb-8">
          OPEN RECRUITMENT 2026
        </div>

        {/* Headline */}
        <h2
          id="cta-heading"
          className="font-display text-[40px] md:text-[64px] uppercase text-white leading-tight mb-6"
        >
          SIAP JADI BAGIAN
          <br />
          DARI KAMI?
        </h2>

        {/* Body text */}
        <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-md mx-auto mb-10">
          Setiap acara punya cerita, dan kamu bisa jadi bagian dari ceritanya.
          Datang dengan semangat, pulang dengan pengalaman dan teman baru.
        </p>

        {/* CTA button */}
        <Link
          href="/join-us"
          className="inline-flex items-center gap-0 rounded-sm bg-white text-ink font-semibold text-sm h-12 hover:bg-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <span className="px-6">Daftar Sekarang</span>
          <span className="grid h-12 w-12 place-items-center rounded-r-sm bg-accent text-ink shrink-0">
            <ChevronRight size={18} strokeWidth={2.5} />
          </span>
        </Link>
      </div>
    </section>
  );
}

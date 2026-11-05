import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteStats as fallbackStats } from "@/lib/data";
import type { SiteStats } from "@/lib/types";
import { CountUp } from "./CountUp";

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

export default function About({ stats }: { stats?: SiteStats | null }) {
  const volunteers = stats?.total_volunteers ?? fallbackStats.volunteers;
  const eventsCompleted = stats?.events_completed ?? fallbackStats.eventsCompleted;
  return (
    <section
      aria-labelledby="about-heading"
      className="container-site py-16 md:py-24"
    >
      <SectionMarker letter="A" label="TENTANG" />

      <h2
        id="about-heading"
        className="mt-6 font-display text-[32px] uppercase leading-tight md:text-[48px] text-ink"
      >
        EVERY EVENT NEEDS,{" "}
        <br className="hidden md:block" />
        PEOPLE YOU NEVER SEE
      </h2>

      {/* Asymmetric layout: Desktop 60/40 2-column, Mobile stacked */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 items-start">
        {/* Left column: Large crowd photo (~60% width) */}
        <div className="relative overflow-hidden rounded-[4px] aspect-[4/5] sm:aspect-square md:aspect-[4/5] lg:aspect-[5/6] md:col-span-7 w-full">
          <Image
            src="/images/home/about-crowd.jpg"
            alt="Ratusan volunteer PASTEER3 memadati sebuah acara"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-center"
          />
          {/* Dark glass chip – bottom left */}
          <div
            className="absolute bottom-4 left-4 flex items-center gap-3 rounded-[4px] px-3.5 py-2.5 shadow-md"
            style={{
              background: "rgba(14,14,14,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <div>
              <p className="font-display text-[26px] leading-none text-accent">
                <CountUp end={volunteers} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-medium text-white/90">Volunteer Aktif</p>
            </div>
            <button
              aria-label="Lihat detail volunteer"
              className="ml-2 grid size-8 place-items-center rounded-[4px] bg-primary text-white hover:bg-primary-bright transition-colors shrink-0"
            >
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Right column: Small photo, 25+ event counter, divider, bullets (~40% width) */}
        <div className="flex flex-col md:col-span-5 w-full">
          {/* Small team photo */}
          <div className="relative overflow-hidden rounded-[4px] aspect-[16/10] w-full">
            <Image
              src="/images/home/about-team.jpg"
              alt="Tim volunteer PASTEER3 berbaris di lokasi acara"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>

          {/* Stat block: 25+ Event */}
          <div className="mt-6 flex items-center gap-5">
            <p
              className="font-display text-[64px] leading-none text-accent md:text-[84px] shrink-0"
              aria-label={`${eventsCompleted} lebih`}
            >
              <CountUp end={eventsCompleted} suffix="+" />
            </p>
            <div>
              <p className="font-display text-lg md:text-xl uppercase text-ink leading-tight">
                Event
              </p>
              <p className="text-xs md:text-sm text-muted">
                Diselenggarakan di Lampung
              </p>
            </div>
          </div>

          {/* Thin divider */}
          <div className="my-5 h-px w-full bg-line" />

          {/* 3 Bullets */}
          <ul className="space-y-3 text-xs md:text-sm text-ink" role="list">
            {[
              "Komunitas volunteer yang solid dan terstruktur",
              "Mengasah kerja lapangan dan kerja tim di acara nyata",
              "Terbuka untuk semua pemuda yang ingin berkontribusi",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 size-1.5 shrink-0 bg-ink rounded-full"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

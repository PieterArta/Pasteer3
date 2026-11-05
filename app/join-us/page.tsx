import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Us | PASTEER3",
  description:
    "Open Recruitment PASTEER Vol 3 akan segera hadir. Tungguin ya!",
};

export default function JoinUsPage() {
  return (
    <main
      className="relative flex min-h-svh flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 60% 55% at 88% 4%,  rgba(195,220,255,0.80) 0%, rgba(100,160,255,0.30) 40%, transparent 65%), " +
          "radial-gradient(ellipse 70% 50% at 12% 100%, rgba(4,12,80,0.85)  0%, transparent 55%), " +
          "radial-gradient(ellipse 45% 35% at 88% 98%, rgba(4,12,80,0.70)  0%, transparent 50%), " +
          "radial-gradient(ellipse 100% 25% at 50% 100%, rgba(6,18,90,0.60) 0%, transparent 40%), " +
          "#1652d4",
      }}
    >
      {/* SEO heading */}
      <h1 className="sr-only">Open Recruitment PASTEER Vol 3 — Tungguin Ya!</h1>

      {/* Decorative lime dot — floats center-right */}
      <div
        aria-hidden="true"
        className="absolute size-[60px] rounded-full bg-accent"
        style={{ top: "52%", left: "57%" }}
      />

      {/* Staggered editorial headline block */}
      {/*
        Layout mirrors screenshot:
          "IYA, KAMU BISA IKUT"  — small, right of center
          "OPEN"                  — very large, left
          "RECRUITMENT"           — very large, right-aligned
          "PASTEER"               — very large, left (slight indent)
          "VOL 3"                 — very large, left (same indent)
          "TUNGGUIN YA.."         — medium, slight indent below VOL 3
      */}
      <div
        className="relative z-10 flex flex-1 flex-col justify-center pt-28 pb-36 md:pt-36 md:pb-44"
        aria-hidden="true"
      >
        {/* Line 1 — IYA, KAMU BISA IKUT — small, right */}
        <div className="flex justify-end pr-[3vw] md:pr-[4vw]">
          <span
            className="font-display uppercase leading-none text-white/90 whitespace-nowrap"
            style={{
              fontSize: "clamp(14px, 2.5vw, 38px)",
              textShadow: "0 1px 8px rgba(0,0,0,0.55), 0 0 24px rgba(0,0,0,0.35)",
            }}
          >
            IYA, KAMU BISA IKUT
          </span>
        </div>

        {/* Line 2 — OPEN — very large, left */}
        <div className="mt-[-0.05em] pl-[3vw] md:pl-[4vw]">
          <span
            className="font-display uppercase leading-none text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(60px, 14vw, 210px)",
              textShadow:
                "0 2px 6px rgba(0,0,0,0.55), 0 6px 32px rgba(0,0,0,0.45), 0 0 80px rgba(0,30,120,0.6)",
            }}
          >
            OPEN
          </span>
        </div>

        {/* Line 3 — RECRUITMENT — very large, right */}
        <div className="mt-[-0.12em] flex justify-end pr-[1vw] md:pr-[2vw]">
          <span
            className="font-display uppercase leading-none text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(32px, 9vw, 136px)",
              textShadow:
                "0 2px 6px rgba(0,0,0,0.55), 0 6px 32px rgba(0,0,0,0.45), 0 0 80px rgba(0,30,120,0.6)",
            }}
          >
            RECRUITMENT
          </span>
        </div>

        {/* Line 4 — PASTEER — very large, left */}
        <div className="mt-[-0.08em] pl-[2vw] md:pl-[3vw]">
          <span
            className="font-display uppercase leading-none text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(52px, 12vw, 180px)",
              textShadow:
                "0 2px 6px rgba(0,0,0,0.55), 0 6px 32px rgba(0,0,0,0.45), 0 0 80px rgba(0,30,120,0.6)",
            }}
          >
            PASTEER
          </span>
        </div>

        {/* Line 5 — VOL 3 — very large, left */}
        <div className="mt-[-0.1em] pl-[2vw] md:pl-[3vw]">
          <span
            className="font-display uppercase leading-none text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(56px, 14vw, 210px)",
              textShadow:
                "0 2px 6px rgba(0,0,0,0.55), 0 6px 32px rgba(0,0,0,0.45), 0 0 80px rgba(0,30,120,0.6)",
            }}
          >
            VOL 3
          </span>
        </div>

        {/* Line 6 — TUNGGUIN YA.. — medium, left */}
        <div className="mt-[0.1em] pl-[2vw] md:pl-[3vw]">
          <span
            className="font-display uppercase leading-none text-white whitespace-nowrap"
            style={{
              fontSize: "clamp(22px, 4vw, 60px)",
              textShadow:
                "0 1px 4px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.45), 0 0 40px rgba(0,30,120,0.5)",
            }}
          >
            TUNGGUIN YA..
          </span>
        </div>
      </div>

      {/* Footer bleed — smooth non-linear fade into bg-primary-deep (#0b2f7a) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[380px]"
        style={{
          background:
            "linear-gradient(to bottom, " +
            "rgba(11, 47, 122, 0) 0%, " +
            "rgba(11, 47, 122, 0.08) 25%, " +
            "rgba(11, 47, 122, 0.28) 50%, " +
            "rgba(11, 47, 122, 0.60) 72%, " +
            "rgba(11, 47, 122, 0.88) 88%, " +
            "#0b2f7a 100%)",
        }}
      />
    </main>
  );
}

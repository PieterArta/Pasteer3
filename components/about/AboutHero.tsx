export default function AboutHero() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative flex min-h-[580px] w-full flex-col justify-center overflow-hidden bg-primary-deep md:min-h-[720px] lg:min-h-[820px] lg:h-svh"
    >
      {/* Background photo – desktop */}
      <div
        className="absolute inset-0 z-0 hidden md:block"
        style={{
          backgroundImage: "url('/images/about/hero-desktop.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
        aria-hidden="true"
      />
      {/* Background photo – mobile */}
      <div
        className="absolute inset-0 z-0 md:hidden"
        style={{
          backgroundImage: "url('/images/about/hero-mobile.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
        aria-hidden="true"
      />

      {/* Dark navy overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "rgba(11, 47, 122, 0.55)" }}
        aria-hidden="true"
      />

      {/* Top gradient for fixed navbar readability */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-36 bg-gradient-to-b from-primary-deep/80 via-primary-deep/40 to-transparent"
        aria-hidden="true"
      />

      {/* Bottom gradient – seamlessly blends into the TIM section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-44 bg-gradient-to-t from-primary-deep via-primary-deep/70 to-transparent"
        aria-hidden="true"
      />

      {/* Text content rendered directly in code */}
      <div className="relative z-[3] w-full pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container-site">
          {/* Giant headline: "ABOUT " in white + "US." in lime */}
          <h1
            id="about-hero-heading"
            className="font-display uppercase leading-[0.85] tracking-tight"
            style={{ fontSize: "clamp(64px, 11vw, 160px)" }}
          >
            <span className="block text-white md:inline">ABOUT </span>
            <span className="block text-accent md:inline">US.</span>
          </h1>

          {/* Subtitle paragraph */}
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base md:mt-6 md:max-w-lg md:text-lg">
            Terbentuk pada Desember 2024, PASTEER3 adalah wadah bagi anak muda
            Lampung untuk belajar dan terjun langsung ke dunia event, lewat
            pengalaman nyata sebagai tenaga di balik layar.
          </p>
        </div>
      </div>
    </section>
  );
}

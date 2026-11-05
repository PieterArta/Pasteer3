import { getImageProps } from "next/image";

export default function EventsHero() {
  const common = {
    alt: "",
    sizes: "100vw",
    quality: 90,
    priority: true,
    fill: true,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: "/images/events/hero-desktop.png" });

  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({ ...common, src: "/images/events/hero-mobile.png" });

  return (
    <section
      aria-label="Event Kami hero"
      className="relative w-full overflow-hidden bg-primary-deep"
      style={{ height: "clamp(360px, 42svh, 520px)" }}
    >
      {/* SEO heading */}
      <h1 className="sr-only">Event Kami | PASTEER3</h1>

      {/* Art-directed background photo */}
      <picture className="absolute inset-0 z-0 size-full">
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />
        <img
          {...rest}
          alt=""
          aria-hidden="true"
          sizes="100vw"
          fetchPriority="high"
          className="size-full object-cover object-center"
        />
      </picture>

      {/* Subtle top vignette so the glass navbar stays readable */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black/50 via-black/15 to-transparent"
        aria-hidden="true"
      />

      {/* Giant display text – centered, overlapping photo bottom */}
      {/* Giant display text – centered, single line */}
      <div
        className="absolute inset-0 z-[2] flex flex-row items-center justify-center gap-2 md:gap-4 select-none px-4 text-center"
        aria-hidden="true"
      >
        {/* "EVENT" – white */}
        <span
          className="font-display uppercase leading-none text-white whitespace-nowrap"
          style={{
            fontSize: "clamp(44px, 9vw, 130px)",
            textShadow: "0 4px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.7)",
            letterSpacing: "-0.01em",
          }}
        >
          EVENT
        </span>
        {/* "KAMI." – accent lime */}
        <span
          className="font-display uppercase leading-none text-accent whitespace-nowrap"
          style={{
            fontSize: "clamp(44px, 9vw, 130px)",
            textShadow: "0 4px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.6)",
            letterSpacing: "-0.01em",
          }}
        >
          KAMI.
        </span>
      </div>
    </section>
  );
}

import { getImageProps } from "next/image";

export default function GalleryHero() {
  const common = {
    alt: "",
    sizes: "100vw",
    quality: 90,
    priority: true,
    fill: true,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: "/images/gallery/hero-desktop.png" });

  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({ ...common, src: "/images/gallery/hero-mobile.png" });

  return (
    <section
      aria-label="Galeri Kami hero"
      className="relative w-full overflow-hidden bg-primary-deep"
      style={{ height: "clamp(380px, 48svh, 560px)" }}
    >
      {/* SEO-only heading */}
      <h1 className="sr-only">Galeri Kami | PASTEER3</h1>

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

      {/* Top vignette so glass navbar stays readable */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-black/55 via-black/20 to-transparent"
        aria-hidden="true"
      />

      {/* Bottom gradient for text readability */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-3/5 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
        aria-hidden="true"
      />

      {/* Giant display text — two stacked lines, bottom-left */}
      <div
        className="container-site absolute inset-x-0 bottom-0 z-[2] pb-8 select-none md:pb-10"
        aria-hidden="true"
      >
        <p
          className="font-display uppercase leading-none text-white"
          style={{
            fontSize: "clamp(56px, 11vw, 160px)",
            textShadow: "0 4px 28px rgba(0,0,0,0.60), 0 1px 4px rgba(0,0,0,0.75)",
            letterSpacing: "-0.01em",
          }}
        >
          GALERI
        </p>
        <p
          className="font-display uppercase leading-none text-white"
          style={{
            fontSize: "clamp(56px, 11vw, 160px)",
            textShadow: "0 4px 28px rgba(0,0,0,0.60), 0 1px 4px rgba(0,0,0,0.75)",
            letterSpacing: "-0.01em",
          }}
        >
          KAMI.
        </p>
      </div>
    </section>
  );
}

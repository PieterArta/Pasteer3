import { getImageProps } from "next/image";
import type { ReactNode } from "react";

interface PageHeroProps {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  srOnlyTitle: string;
  /** "full" = h-svh min-h-[560px] (default). "auto" = natural aspect ratio. */
  heightMode?: "full" | "auto";
  /**
   * Optional overlay content rendered above the photo (e.g. a headline).
   * Positioned absolutely over the image — wrap in a container with z-[2].
   * When provided the sr-only h1 is omitted (the caller should include a
   * visible h1 inside children instead).
   */
  children?: ReactNode;
}

export default function PageHero({
  desktopSrc,
  mobileSrc,
  alt,
  srOnlyTitle,
  heightMode = "full",
  children,
}: PageHeroProps) {
  const common = {
    alt,
    sizes: "100vw",
    quality: 90,
    priority: true,
    fill: true,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktopSrc });

  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({ ...common, src: mobileSrc });

  const heightClass =
    heightMode === "auto"
      ? "aspect-[2/1] md:aspect-[2/1]"
      : "h-svh min-h-[560px]";

  return (
    <section
      aria-label={srOnlyTitle}
      className={`relative w-full overflow-hidden bg-primary-deep ${heightClass}`}
    >
      {/* Art-directed image via <picture> */}
      <picture className="absolute inset-0 z-0 size-full">
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />
        <img
          {...rest}
          alt={alt}
          sizes="100vw"
          fetchPriority="high"
          className="size-full object-cover object-top"
        />
      </picture>

      {/* Subtle top gradient for navbar readability */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
        aria-hidden="true"
      />

      {/* Bottom gradient for text readability (visible when children are present) */}
      {children && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          aria-hidden="true"
        />
      )}

      {/* Overlay content slot (e.g. headline) */}
      {children}

      {/* Screen-reader only h1 — omitted when children include a visible heading */}
      {!children && <h1 className="sr-only">{srOnlyTitle}</h1>}
    </section>
  );
}

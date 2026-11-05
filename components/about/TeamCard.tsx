import Image from "next/image";

export interface TeamCardImage {
  src: string;
  width: number;
  height: number;
}

export interface TeamCardProps {
  name: string;
  role: string;
  image: TeamCardImage;
  /** "light" = white glass + ink text (default); "dark" = navy glass + white text */
  tone?: "light" | "dark";
  priority?: boolean;
  sizes?: string;
}

/**
 * Reusable TeamCard — used for every founder and organizer card on every layout.
 *
 * Structure rules (prevents the plate from escaping the card):
 *  1. The wrapper is `relative overflow-hidden` with container-type: inline-size.
 *     Its height is set naturally by the <img> in normal flow — NOT by a fixed
 *     aspect-ratio or a fill Image.  This guarantees the wrapper's box model
 *     matches the visible photo precisely.
 *  2. The <img> is rendered as display:block / w-full / h-auto.  A block image
 *     eliminates the 4-6 px baseline gap that an inline <img> leaves below itself.
 *     Without that gap the wrapper is exactly as tall as the photo and there is
 *     no "extra room" below the image for the plate to slide into.
 *  3. The plate is `position:absolute` inside the wrapper, anchored with
 *     left / bottom via CSS variables (cqw units).  Because the wrapper is the
 *     only container-type:inline-size ancestor, every cqw value resolves against
 *     the card's rendered width — never the viewport or a parent section.
 *  4. overflow-hidden on the wrapper clips any accidental overflow.
 *
 * Do NOT:
 *  - add extra padding/margin to the wrapper
 *  - use Image fill (it makes the img position:absolute, removing it from flow)
 *  - add a second container-type to any ancestor
 */
export default function TeamCard({
  name,
  role,
  image,
  tone = "light",
  priority = false,
  sizes,
}: TeamCardProps) {
  const dark = tone === "dark";

  return (
    <div
      className="team-card relative w-full self-start overflow-hidden max-w-[560px]"
      style={{ aspectRatio: "4/5", containerType: "inline-size" }}
    >
      {/*
        The wrapper has aspect-ratio 4/5 and align-self: start, ensuring every card
        in a row shares the exact same height, width, and top edge.
        The image fills the wrapper completely with object-cover and object-center.
      */}
      <Image
        src={image.src}
        alt={`${name}, ${role}`}
        width={image.width}
        height={image.height}
        quality={90}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        className="block w-full h-full object-cover object-center"
      />

      {/* Liquid glass nameplate — glued inside the card with cqw offsets */}
      <div
        className="team-nameplate absolute z-10"
        style={{
          left: "var(--plate-left)",
          bottom: "var(--plate-bottom)",
          width: "max-content",
          maxWidth: "var(--plate-max-w, 92cqw)",
          padding: "var(--plate-pad-y) var(--plate-pad-x)",
          borderRadius: "var(--plate-radius)",
          // Light glass: translucent white fill, saturated blur, white border + highlight
          // Dark glass: navy fill, white text — for cards where dark text has poor contrast
          backgroundColor: dark
            ? "rgba(20, 25, 45, 0.70)"
            : "rgba(255, 255, 255, 0.38)",
          backdropFilter: "blur(16px) saturate(1.6)",
          WebkitBackdropFilter: "blur(16px) saturate(1.6)",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.55)",
        }}
      >
        <p
          style={{
            fontSize: "var(--plate-name)",
            fontWeight: 600,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            color: dark ? "#ffffff" : "#0e0e0e",
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontSize: "var(--plate-role)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginTop: "var(--plate-gap)",
            whiteSpace: "nowrap",
            color: dark ? "rgba(255,255,255,0.75)" : "#5b6470",
          }}
        >
          {role}
        </p>
      </div>
    </div>
  );
}

export { TeamCard };

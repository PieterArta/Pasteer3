# PASTEER3 Design System

Design system for the PASTEER3 (Pasukan Volunteer Lampung) company profile website and its admin dashboard. The visual direction comes from a sports academy landing page: a huge condensed headline over a full-bleed action photo, sharp editorial sections, and one bright accent color. All UI copy is in Indonesian.

## 1. Brand Feel

- Energetic, bold, and trustworthy. A community that moves, not a corporate brochure.
- Photo-led. Real documentation of PASTEER3 volunteers in action is the main decoration.
- Big type, few colors, lots of white space. One memorable element per section.
- Sharp and confident: small corner radius, thin lines, no heavy shadows.

## 2. Colors

The blues are taken from the PASTEER3 logo (a circle with a gradient from dark navy on the left to royal blue on the right, with a white people icon). The hex values are estimated from the logo image, so swap in the exact values if you have them. Accent lime and the neutrals come from the layout reference.

| Token | Hex | Use |
|---|---|---|
| primary | #1B55C4 | Hero backgrounds, links, focus rings, primary actions in the dashboard |
| primary-deep | #0B2F7A | Dark end of the logo. Photo overlays, footer, dashboard sidebar |
| primary-bright | #2A68D6 | Light end of the logo. Hover states, highlights on dark backgrounds |
| accent | #B6E24B | Stat numbers, arrow icons, status highlights. Never as body text on white |
| ink | #0E0E0E | Headings, body text, primary buttons |
| white | #FFFFFF | Page background, text on dark |
| surface | #F4F5F7 | Dashboard background, form sections |
| border | #E3E5E8 | Thin dividers, input borders |
| muted | #5B6470 | Secondary text |
| success | #2E9E5B | Positive states |
| danger | #D64545 | Errors, shortage highlights |

Rules:
- Logo mark: a circle filled with a horizontal gradient from primary-deep (left) to primary-bright (right), with the white people icon. This is the only gradient in the system. On dark backgrounds the logo is used as is.
- Accent lime appears only on dark or blue backgrounds, or as a very large numeral on white.
- White sections use a very subtle dot-grid texture (1px dots, 24px spacing, ink at 6% opacity).
- Text over photos needs a dark gradient overlay of at least 40% for readability.

## 3. Typography

- **Display:** Anton (fallback: Bebas Neue, Impact). Uppercase, tight leading (0.9 to 1.0), no letter spacing. Used for hero headline, section headings, and big numbers.
- **Body and UI:** Inter (fallback: Helvetica, Arial). Regular and Medium.

| Role | Font | Size (desktop / mobile) | Notes |
|---|---|---|---|
| Hero headline | Display | clamp(72px, 14vw, 200px) | White, sits behind the main subject when the photo is a cutout |
| Section heading | Display | 48px / 32px | Ink, max two lines |
| Big number | Display | 120px / 72px | Accent lime |
| Card title | Inter Semibold | 18px | |
| Body | Inter Regular | 14px, line height 1.6 | Max 70 characters per line |
| Small and meta | Inter Regular | 12px | Muted |

## 4. Layout and Spacing

- Mobile first. Breakpoints: 360, 768, 1280. Max content width 1200px, 12-column grid.
- Spacing scale: 4, 8, 16, 24, 40, 64, 96. Sections are separated by 96px on desktop and 64px on mobile.
- Hero is full-bleed. The rest of the content sits inside the container, with photos allowed to bleed to the container edge.
- Photo layout is asymmetric: one large photo next to one small photo, with the stat chips overlapping the large one.

## 5. Shape, Surface, Effects

- Corner radius: 4px for buttons, inputs, chips, and photos. 8px for glass cards. Nothing fully round except the section letter marker.
- Shadows: none by default. Separation comes from color blocks, photos, and thin lines.
- Glass panels: white at 14% or ink at 55% fill, backdrop blur 12px, 1px white border at 20%.

## 6. Components

**Navbar**
- Overlays the hero as a glass bar, 56px high, 16px from the screen edges. Logo left, links center (12px, white), button right.
- On scroll it becomes solid white with ink text.
- Mobile: logo and hamburger, full-screen menu.

**Buttons**
- Primary: ink background, white text, 44px high, with a small lime square (20px) holding an ink arrow icon. Used for "Gabung Sekarang" and "Daftar".
- On hero: white background, ink text, lime arrow square.
- Outline: 1px ink border, transparent.
- Square arrow controls (carousel previous and next): 40px, white background, ink arrow.

**Section marker**
- A 24px circle with a letter (A, B, C), a small label next to it, and a 1px line running to the right edge. It sits above every section heading.

**Hero**
- Full-bleed photo with a blue sky tone, the giant display headline across the full width, and a glass card at the bottom left with a short tagline and two square arrow buttons.
- Headline copy example: "BERGERAK BERSAMA."

**Stat chip**
- Dark glass rectangle over a photo. Number in display font, lime, 28px. Label in white Inter Medium 14px.
- Only two stats are used on the site: kegiatan terselesaikan and volunteer yang berpartisipasi.
- A large lime number with a short label ("Kegiatan Terselesaikan") can sit beside the photo as in the reference.

**Event card**
- Photo on top (4:5 or 16:10), title below, date and location as meta. No border, no shadow.
- Status badge on the photo, top left: "Mendatang" (lime background, ink text) or "Selesai" (ink background, white text).
- Cards are not clickable. There is no event detail page.

**Event carousel**
- The center card is larger and sharp. The side cards are partly visible and slightly blurred. Square arrow controls sit on the center card.

**Gallery grid**
- Masonry grid, 4px radius, 8px gap. Clicking a photo opens a full-screen viewer. Subtle zoom (1.03) on hover.

**Join Us form**
- White card on a surface background. Inputs 48px high, 1px border, 4px radius, label above, blue focus ring.
- Fields: Nama Lengkap, Email, Nomor WhatsApp, Username Instagram, Size Jersey, Asal Domisili / Instansi, Upload CV, Alasan Bergabung.
- Upload CV: dashed border drop zone, PDF only, max 2 MB, shows the file name after selecting.
- States: error text in danger color under the field, success message after submit.

**Footer**
- primary-deep background, white text. Logo, short description, navigation links, social icons (Instagram, TikTok, YouTube), WhatsApp, email, Lampung location. Links turn lime on hover.
- A floating WhatsApp button stays at the bottom right on all public pages.

## 7. Admin Dashboard

Same tokens, calmer style so the data stays readable.

- Sidebar in primary-deep with white text: Dashboard, Kegiatan, Galeri, Form Pendaftaran, Pendaftar, Plotting. The active item has a lime left bar.
- Content area on surface background. Cards and tables on white, 1px border, 8px radius.
- Primary actions use primary blue. Display font only for page titles.
- Plotting table: columns Penanggung Jawab, Total Diterima, Total Dibutuhkan, Kurang, plus a bold total row. "Kurang" above 0 has a danger tint, 0 has a success tint.
- Applicant list: name, WhatsApp, "Lihat CV" button, "Plot ke" dropdown, "Terima" button. Status chip: Menunggu or Diterima.

## 8. Imagery

- Real photos of PASTEER3 activities: volunteers in motion, group shots, close-ups of faces. Bright, saturated, with a cool blue grade to match the palette.
- The hero photo is ideally a cutout of a volunteer so the headline can sit behind them.
- No generic stock photos and no illustrations of people.

## 9. Motion

- Counters count up once when they enter the screen.
- Carousel slides in 400ms ease-out. Buttons and links have a 150ms hover transition.
- No scroll animations on every section. Respect prefers-reduced-motion.

## 10. Accessibility

- Text contrast at least 4.5:1. Visible focus state on every interactive element.
- Alt text on all photos. Touch targets at least 44px.

## 11. Voice

- Indonesian, short, active, and warm. Buttons say what happens: "Gabung Sekarang", "Daftar", "Lihat Galeri".
- Example headlines: "Bergerak Bersama", "Siap Jadi Bagian dari Kami?", "Kegiatan Terbaru".
- Errors say what is wrong and how to fix it, for example "File CV harus PDF dan maksimal 2 MB."

## 12. Do and Don't

Do
- Let the headline and the photo carry each section.
- Use lime sparingly, only for numbers and arrow icons.
- Keep the two-photo asymmetric layout in About.

Don't
- Don't use gradients (except the logo mark), heavy shadows, or rounded pill buttons.
- Don't add more than the two stats on Home.
- Don't use lime text on white backgrounds.
- Don't add testimonials, blog, or event detail pages. They are outside the scope in the PRD.

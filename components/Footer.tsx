"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const WA_NUMBER = "6282178904321";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/join-us", label: "Contact" },
];

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <>
      <footer className="bg-primary-deep text-white">
        <div className="container-site py-12 md:py-16">
          {/* Top grid: 4 columns on desktop, stacked on mobile */}
          <div className="grid gap-10 md:grid-cols-4">
            {/* Column 1: Brand */}
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-ink shadow-sm"
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                </div>
                <span className="font-display text-xl tracking-wide text-white">
                  PASTEER3
                </span>
              </div>
              <p className="max-w-[240px] text-sm leading-relaxed text-white/70">
                Wadah kolaborasi pemuda Lampung dalam aksi sosial, edukasi
                kemanusiaan, dan pelestarian lingkungan.
              </p>
            </div>

            {/* Column 2: Quick links */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
                TAUTAN CEPAT
              </p>
              <ul className="space-y-2 text-sm text-white/75">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
                KONTAK
              </p>
              <ul className="space-y-2 text-sm text-white/75">
                <li>Bandar Lampung, Lampung, Indonesia</li>
                <li>
                  <a
                    href="mailto:halo@pasteer3.org"
                    className="transition-colors hover:text-accent"
                  >
                    halo@pasteer3.org
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Social */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
                MEDIA SOSIAL
              </p>
              <div className="flex gap-2.5">
                <a
                  href="https://instagram.com/pasteer3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram PASTEER3"
                  className="grid size-10 place-items-center rounded-md border border-white/20 bg-[#163872]/60 text-white/80 transition-colors hover:border-accent hover:text-accent"
                >
                  <CameraIcon />
                </a>
                <a
                  href="https://youtube.com/@pasteer3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube PASTEER3"
                  className="grid size-10 place-items-center rounded-md border border-white/20 bg-[#163872]/60 text-white/80 transition-colors hover:border-accent hover:text-accent"
                >
                  <VideoIcon />
                </a>
                <a
                  href="mailto:halo@pasteer3.org"
                  aria-label="Email PASTEER3"
                  className="grid size-10 place-items-center rounded-md border border-white/20 bg-[#163872]/60 text-white/80 transition-colors hover:border-accent hover:text-accent"
                >
                  <MailIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 border-t border-white/10" />

          {/* Bottom bar */}
          <p className="mt-6 text-xs text-white/50">
            © 2025 Pasukan Volunteer Lampung (PASTEER3). Seluruh hak cipta
            dilindungi.
          </p>
        </div>
      </footer>

      {/* Floating chat button – green rounded-2xl squircle matching screenshot */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp PASTEER3"
        className="fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-2xl bg-[#10a37f] text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:size-14"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01" />
          <path d="M12 10h.01" />
          <path d="M16 10h.01" />
        </svg>
      </a>
    </>
  );
}
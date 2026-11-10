"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, X, Menu } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Tentang" },
  { href: "/events", label: "Kegiatan" },
  { href: "/gallery", label: "Galeri" },
  { href: "/join-us", label: "Join Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  // Listen for popup-open and popup-close custom events
  useEffect(() => {
    const handlePopupOpen = () => setPopupOpen(true);
    const handlePopupClose = () => setPopupOpen(false);

    window.addEventListener("popup-open", handlePopupOpen);
    window.addEventListener("popup-close", handlePopupClose);

    return () => {
      window.removeEventListener("popup-open", handlePopupOpen);
      window.removeEventListener("popup-close", handlePopupClose);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle ESC key and resize to desktop width
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  // Manage accessibility focus
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    } else {
      hamburgerButtonRef.current?.focus();
    }
  }, [open]);

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-3 z-50 transition-opacity duration-150 ${
          popupOpen
            ? "pointer-events-none opacity-0"
            : open
            ? "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100"
            : "pointer-events-auto opacity-100"
        }`}
      >
        <div className="container-site">
          <nav
            className="flex h-14 w-full items-center justify-between rounded-2xl px-4 text-white"
            style={{
              backgroundColor: "var(--nav-glass-bg)",
              backdropFilter: "blur(var(--nav-glass-blur)) saturate(150%)",
              WebkitBackdropFilter: "blur(var(--nav-glass-blur)) saturate(150%)",
              border: "1px solid var(--nav-glass-border)",
              boxShadow:
                "inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 8px 32px 0 rgba(0, 0, 0, 0.20)",
            }}
          >
            {/* Logo */}
            <Link href="/" aria-label="PASTEER3 – Beranda" className="shrink-0">
              <Image
                src="/logo-wordmark.svg"
                alt="PASTEER3"
                width={120}
                height={32}
                style={{ width: "auto" }}
                className="h-8 w-auto brightness-0 invert"
                priority
              />
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-8 text-xs font-medium md:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`text-white transition-opacity ${
                      pathname === l.href
                        ? "border-b-2 border-accent pb-1 opacity-100"
                        : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <Link
              href="/join-us"
              className="hidden h-9 items-center gap-2 rounded-sm bg-white px-3 text-xs font-semibold text-ink transition-colors hover:bg-white/90 md:flex"
            >
              {pathname === "/join-us" ? "Daftar Relawan" : "Gabung Sekarang"}
              <span className="grid size-5 place-items-center rounded-sm bg-accent text-ink">
                <ArrowUpRight size={12} />
              </span>
            </Link>

            {/* Mobile hamburger */}
            <button
              ref={hamburgerButtonRef}
              className="grid size-11 place-items-center rounded-sm text-white md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Buka menu"
              aria-expanded={open}
            >
              <Menu size={22} />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile full-screen menu panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-primary-deep text-white transition-opacity duration-200 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Mobile Header: Logo wordmark left, large close button right */}
        <div className="flex h-16 items-center justify-between px-6 pt-2">
          <Link
            href="/"
            aria-label="PASTEER3 – Beranda"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/logo-wordmark.svg"
              alt="PASTEER3"
              width={120}
              height={32}
              style={{ width: "auto" }}
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <button
            ref={closeButtonRef}
            className="grid size-12 min-h-[44px] min-w-[44px] place-items-center rounded-sm text-white transition-colors hover:bg-white/10 active:scale-95"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={28} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-1 flex-col justify-center px-8">
          <ul className="flex flex-col gap-2">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`relative inline-flex items-center gap-3 py-3 font-display text-4xl uppercase tracking-wide transition-colors ${
                      isActive ? "text-accent" : "text-white hover:text-accent"
                    }`}
                  >
                    {isActive && (
                      <span
                        className="inline-block size-3 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                    )}
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom CTA with safe area awareness */}
        <div className="px-8 pt-4">
          <Link
            href="/join-us"
            onClick={() => setOpen(false)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-white text-sm font-semibold text-ink transition-transform active:scale-[0.99]"
          >
            {pathname === "/join-us" ? "Daftar Relawan" : "Gabung Sekarang"}
            <span className="grid size-6 place-items-center rounded-sm bg-accent text-ink">
              <ArrowUpRight size={14} />
            </span>
          </Link>

          <p className="mt-4 text-center text-xs text-white/40">
            © 2026 PASTEER3 (Pasukan Volunteer Lampung)
          </p>
        </div>
      </div>
    </>
  );
}
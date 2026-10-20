"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/join-us", label: "Join Us" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <header className="fixed inset-x-3 top-3 z-50 md:inset-x-6">
            <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-lg border border-white/30 bg-primary-deep/85 px-4 text-white backdrop-blur-xl">
                <Link href="/" className="font-display text-xl tracking-wide">
                    PASTEER3
                </Link>

                <ul className="hidden items-center gap-8 text-xs md:flex">
                    {links.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className={
                                    pathname === l.href
                                        ? "border-b-2 border-accent pb-1"
                                        : "opacity-80 hover:opacity-100"
                                }
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <Link
                    href="/join-us"
                    className="hidden items-center gap-2 rounded-sm bg-white px-3 py-2 text-xs font-medium text-ink md:flex"
                >
                    Gabung Sekarang
                    <span className="grid size-5 place-items-center rounded-sm bg-accent">→</span>
                </Link>

                <button
                    className="grid size-11 place-items-center md:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Menu"
                >
                    {open ? "✕" : "☰"}
                </button>
            </nav>

            {open && (
                <div className="mx-auto mt-2 max-w-[1200px] rounded-lg bg-primary-deep p-4 text-white md:hidden">
                    <ul className="flex flex-col gap-1">
                        {links.map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="block py-3 font-display text-2xl uppercase"
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
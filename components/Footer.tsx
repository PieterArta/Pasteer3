import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary-deep text-white">
            <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 md:grid-cols-4">
                <div>
                    <p className="font-display text-2xl">PASTEER3</p>
                    <p className="mt-3 text-sm text-white/70">
                        Pasukan Volunteer Lampung. Menyediakan tenaga relawan di balik
                        layar untuk acara di bumi Ruwa Jurai.
                    </p>
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-wider">NAVIGASI CEPAT</p>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                        <li><Link href="/about">Tentang Kami</Link></li>
                        <li><Link href="/events">Agenda Kegiatan</Link></li>
                        <li><Link href="/gallery">Galeri Dokumentasi</Link></li>
                        <li><Link href="/join-us">Pendaftaran Volunteer</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-wider">KONTAK</p>
                    <ul className="mt-3 space-y-2 text-sm text-white/70">
                        <li>+62 821-7890-4321</li>
                        <li>volunteer@pasteer3.org</li>
                        <li>Senin - Sabtu: 08:00 - 17:00</li>
                    </ul>
                </div>
                <div>
                    <p className="text-xs font-semibold tracking-wider">MEDIA SOSIAL</p>
                    <p className="mt-3 text-sm text-white/70">
                        Ikuti dokumentasi kegiatan langsung lewat kanal kami.
                    </p>
                </div>
            </div>
            <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/60">
                © 2026 PASTEER3 (Pasukan Volunteer Lampung). All rights reserved.
            </div>
        </footer>
    );
}
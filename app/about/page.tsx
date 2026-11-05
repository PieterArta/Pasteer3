import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import Team from "@/components/about/Team";

export const metadata: Metadata = {
  title: "Tentang Kami | PASTEER3",
  description:
    "Terbentuk pada Desember 2024, PASTEER3 adalah wadah bagi anak muda Lampung untuk belajar dan terjun langsung ke dunia event, lewat pengalaman nyata sebagai tenaga di balik layar.",
  openGraph: {
    title: "Tentang Kami | PASTEER3",
    description:
      "Mengenal lebih dekat PASTEER3 — komunitas volunteer Lampung yang bergerak di balik setiap acara.",
    url: "https://pasteer3.id/about",
    siteName: "PASTEER3",
    locale: "id_ID",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main>
      {/* 1. Hero – full screen with coded text */}
      <AboutHero />

      {/* 2. Tim section */}
      <Team />

      {/* Footer is rendered by layout.tsx */}
    </main>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { Anton, Inter, Baloo_Tammudu_2 } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const balooTammudu2 = Baloo_Tammudu_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
});

export const metadata: Metadata = {
  title: "PASTEER3 | Pasukan Volunteer Lampung",
  description:
    "Komunitas volunteer dari Lampung yang menyediakan tenaga relawan untuk berbagai acara.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${anton.variable} ${inter.variable} ${balooTammudu2.variable}`}>
      <body className="bg-white font-sans text-ink antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  status: "upcoming" | "completed";
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  /** Path to the card image in /public */
  image: string;
  /** Natural width in px (for correct aspect ratio) */
  width: number;
  /** Natural height in px */
  height: number;
  /**
   * Nameplate contrast override.
   * "light" = translucent white glass + dark ink text (default).
   * "dark"  = translucent dark navy glass + white text (use when card background makes dark text illegible).
   */
  tone?: "light" | "dark";
}

export interface TeamData {
  founder: TeamMember[];
  organizer: TeamMember[];
}

export const teamData: TeamData = {
  founder: [
    {
      name: "Pieter Wenesdy",
      role: "Founder",
      image: "/images/about/team-pieter.png",
      width: 424,
      height: 520,
    },
    {
      name: "Angel Mutiara Hasan",
      role: "Founder",
      image: "/images/about/team-angel.png",
      width: 1632,
      height: 2016,
    },
    {
      name: "Made Bintang",
      role: "Founder",
      image: "/images/about/team-made.png",
      width: 1632,
      height: 2016,
    },
  ],
  organizer: [
    {
      name: "Azhfar Tsaqib",
      role: "Organizer",
      image: "/images/about/team-aqib.png",
      width: 431,
      height: 529,
    },
    {
      name: "Azarine E Alesha",
      role: "CO-Organizer",
      image: "/images/about/team-ale.png",
      width: 1724,
      height: 2115,
    },
  ],
};

export const siteStats = {
  eventsCompleted: 25,
  volunteers: 300,
};

export const events: Event[] = [
  {
    id: "locomotive-2026",
    title: "Locomotive 2026",
    description:
      "Event lari tahunan bertajuk Locomotive, diselenggarakan di pusat kota Bandar Lampung.",
    date: "2026-03-15",
    location: "Bandar Lampung",
    image: "/images/placeholder/event-locomotive.jpg",
    status: "upcoming",
  },
  {
    id: "grand-matsuri-2025",
    title: "Grand Matsuri 2025",
    description:
      "Festival budaya terbesar di Lampung dengan ribuan pengunjung dan ratusan volunteer.",
    date: "2025-11-20",
    location: "Bandar Lampung",
    image: "/images/placeholder/event-matsuri.jpg",
    status: "completed",
  },
  {
    id: "grand-marathon-premier",
    title: "Grand Marathon Premier",
    description:
      "Lari maraton skala nasional yang membutuhkan koordinasi volunteer di berbagai titik.",
    date: "2025-08-10",
    location: "Bandar Lampung",
    image: "/images/placeholder/event-gmp.jpg",
    status: "completed",
  },
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "gallery-1",
    src: "/images/placeholder/gallery-1.jpg",
    alt: "Volunteer PASTEER3 di water station acara Locomotive 2026",
    caption: "LOCOMOTIVE 2026",
    tag: "WATER STATION",
  },
  {
    id: "gallery-2",
    src: "/images/placeholder/gallery-2.jpg",
    alt: "Volunteer muda PASTEER3 dengan vest merah",
    caption: "Volunteer in Action",
  },
  {
    id: "gallery-3",
    src: "/images/placeholder/gallery-3.jpg",
    alt: "Tim PASTEER3 berfoto bersama di acara",
    caption: "Tim PASTEER3",
  },
  {
    id: "gallery-4",
    src: "/images/placeholder/gallery-4.jpg",
    alt: "Volunteer perempuan PASTEER3 sedang bertugas",
    caption: "Bertugas dengan Semangat",
  },
  {
    id: "gallery-5",
    src: "/images/placeholder/gallery-5.jpg",
    alt: "Dua volunteer PASTEER3 berfoto bersama",
    caption: "Bersama Lebih Kuat",
  },
  {
    id: "gallery-6",
    src: "/images/placeholder/gallery-6.jpg",
    alt: "Tim volunteer PASTEER3 mengenakan jaket official",
    caption: "Pasteer Need You Vol 2",
  },
];

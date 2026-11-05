import type { Metadata } from "next";
import EventsHero from "@/components/events/EventsHero";
import EventGrid from "@/components/events/EventGrid";
import CtaBand from "@/components/home/CtaBand";
import { getEvents } from "@/lib/queries/events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event Kami | PASTEER3",
  description:
    "Daftar event yang didukung oleh PASTEER3, komunitas volunteer dari Lampung.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const safeEvents = events && events.length > 0 ? events : [];

  return (
    <main>
      <EventsHero />
      <EventGrid initialEvents={safeEvents} />
      <CtaBand />
    </main>
  );
}

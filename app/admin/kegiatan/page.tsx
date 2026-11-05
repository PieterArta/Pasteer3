import { getEvents } from "@/lib/queries/events";
import EventsClient from "@/components/admin/EventsClient";

export const dynamic = "force-dynamic";

export default async function AdminKegiatanPage() {
  const events = await getEvents();
  return <EventsClient initialEvents={events} />;
}

import { getForms } from "@/lib/queries/forms";
import { getEvents } from "@/lib/queries/events";
import FormsClient from "@/components/admin/FormsClient";

export const dynamic = "force-dynamic";

export default async function AdminFormPendaftaranPage() {
  const [forms, events] = await Promise.all([getForms(), getEvents()]);

  return <FormsClient initialForms={forms} events={events} />;
}

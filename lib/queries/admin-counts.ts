import { createClient } from "@supabase/supabase-js";

// Use the anon key for read-only counts — service_role key returns 403 in this project.
// RLS policies on these tables allow public SELECT so the anon key is sufficient.
function getReadClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export interface DashboardCounts {
  totalEvents: number;
  totalGallery: number;
  openForms: number;
  pendingApplicants: number;
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const db = getReadClient();
    const [eventsRes, galleryRes, openFormsRes, pendingRes] = await Promise.all([
      db.from("events").select("*", { count: "exact", head: true }),
      db.from("gallery").select("*", { count: "exact", head: true }),
      db.from("registration_forms").select("*", { count: "exact", head: true }).eq("is_open", true),
      db.from("applicants").select("*", { count: "exact", head: true }).eq("status", "menunggu"),
    ]);

    return {
      totalEvents: eventsRes.count ?? 0,
      totalGallery: galleryRes.count ?? 0,
      openForms: openFormsRes.count ?? 0,
      pendingApplicants: pendingRes.count ?? 0,
    };
  } catch (err) {
    console.error("Failed getDashboardCounts:", err);
    return { totalEvents: 0, totalGallery: 0, openForms: 0, pendingApplicants: 0 };
  }
}

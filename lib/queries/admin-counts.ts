import { supabaseAdmin } from "@/lib/supabase/admin";

export interface DashboardCounts {
  totalEvents: number;
  totalGallery: number;
  openForms: number;
  pendingApplicants: number;
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  try {
    const [eventsRes, galleryRes, openFormsRes, pendingRes] = await Promise.all([
      supabaseAdmin.from("events").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("gallery").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("registration_forms").select("id", { count: "exact", head: true }).eq("is_open", true),
      supabaseAdmin.from("applicants").select("id", { count: "exact", head: true }).eq("status", "menunggu"),
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

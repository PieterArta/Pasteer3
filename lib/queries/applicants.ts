import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Applicant, ApplicantStatus } from "@/lib/types";

export async function getApplicants(
  formId?: string,
  status?: ApplicantStatus
): Promise<Applicant[]> {
  try {
    let query = supabaseAdmin
      .from("applicants")
      .select("*")
      .order("created_at", { ascending: false });

    if (formId) {
      query = query.eq("form_id", formId);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error || !data) {
      console.error("Error fetching applicants:", error);
      return [];
    }
    return data as Applicant[];
  } catch (err) {
    console.error("Failed to getApplicants:", err);
    return [];
  }
}

export async function getApplicantById(id: string): Promise<Applicant | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("applicants")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error(`Error fetching applicant ${id}:`, error);
      return null;
    }
    return data as Applicant;
  } catch (err) {
    console.error(`Failed to getApplicantById for ${id}:`, err);
    return null;
  }
}

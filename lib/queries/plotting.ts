import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Plotting } from "@/lib/types";

export async function getPlottingByForm(formId: string): Promise<Plotting[]> {
  try {
    // Fetch plotting rows
    const { data: plottingRows, error: plottingError } = await supabaseAdmin
      .from("plotting")
      .select("*")
      .eq("form_id", formId)
      .order("created_at", { ascending: true });

    if (plottingError || !plottingRows) {
      console.error("Error fetching plotting:", plottingError);
      return [];
    }

    // Fetch accepted applicants count for this form
    const { data: acceptedApplicants, error: applicantError } = await supabaseAdmin
      .from("applicants")
      .select("plotting_id")
      .eq("form_id", formId)
      .eq("status", "diterima");

    if (applicantError) {
      console.error("Error counting accepted applicants:", applicantError);
    }

    const counts: Record<string, number> = {};
    (acceptedApplicants || []).forEach((item) => {
      if (item.plotting_id) {
        counts[item.plotting_id] = (counts[item.plotting_id] || 0) + 1;
      }
    });

    return plottingRows.map((row) => ({
      ...row,
      accepted_count: counts[row.id] || 0,
    })) as Plotting[];
  } catch (err) {
    console.error("Failed to getPlottingByForm:", err);
    return [];
  }
}

export async function getAllPlottings(): Promise<Plotting[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("plotting")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return data as Plotting[];
  } catch (err) {
    console.error("Failed to getAllPlottings:", err);
    return [];
  }
}


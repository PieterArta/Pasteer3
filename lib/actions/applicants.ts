"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function acceptApplicant(id: string, plottingId: string) {
  try {
    const supabase = await createClient();
    const updateData = {
      status: "diterima",
      plotting_id: plottingId,
      updated_at: new Date().toISOString(),
    };

    const userRes = await supabase
      .from("applicants")
      .update(updateData)
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("applicants")
        .update(updateData)
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error accepting applicant:", userRes.error || adminRes.error);
        return { success: false, error: userRes.error?.message || adminRes.error.message };
      }
    }

    revalidatePath("/admin/pendaftar");
    revalidatePath("/admin/plotting");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to acceptApplicant:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function rejectApplicant(id: string) {
  try {
    const supabase = await createClient();
    const updateData = {
      status: "ditolak",
      plotting_id: null,
      updated_at: new Date().toISOString(),
    };

    const userRes = await supabase
      .from("applicants")
      .update(updateData)
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("applicants")
        .update(updateData)
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error rejecting applicant:", userRes.error || adminRes.error);
        return { success: false, error: userRes.error?.message || adminRes.error.message };
      }
    }

    revalidatePath("/admin/pendaftar");
    revalidatePath("/admin/plotting");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to rejectApplicant:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function resetApplicantStatus(id: string) {
  try {
    const supabase = await createClient();
    const updateData = {
      status: "menunggu",
      plotting_id: null,
      updated_at: new Date().toISOString(),
    };

    const userRes = await supabase
      .from("applicants")
      .update(updateData)
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("applicants")
        .update(updateData)
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error resetting applicant:", userRes.error || adminRes.error);
        return { success: false, error: userRes.error?.message || adminRes.error.message };
      }
    }

    revalidatePath("/admin/pendaftar");
    revalidatePath("/admin/plotting");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to resetApplicantStatus:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function deleteApplicant(id: string) {
  try {
    const supabase = await createClient();
    const userRes = await supabase
      .from("applicants")
      .delete()
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("applicants")
        .delete()
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error deleting applicant:", userRes.error || adminRes.error);
        return { success: false, error: userRes.error?.message || adminRes.error.message };
      }
    }

    revalidatePath("/admin/pendaftar");
    revalidatePath("/admin/plotting");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to deleteApplicant:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

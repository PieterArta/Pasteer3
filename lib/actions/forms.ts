"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { RegistrationForm } from "@/lib/types";

export async function upsertForm(data: Partial<RegistrationForm>) {
  try {
    const payload = {
      ...data,
    };

    const supabase = await createClient();
    let result = null;

    const userRes = await supabase
      .from("registration_forms")
      .upsert(payload)
      .select()
      .single();

    if (!userRes.error && userRes.data) {
      result = userRes.data;
    } else {
      const adminRes = await supabaseAdmin
        .from("registration_forms")
        .upsert(payload)
        .select()
        .single();

      if (adminRes.error) {
        console.error("Error upserting form:", userRes.error || adminRes.error);
        return {
          success: false,
          error: userRes.error?.message || adminRes.error.message,
        };
      }
      result = adminRes.data;
    }

    revalidatePath("/admin/form-pendaftaran");
    return { success: true, data: result };
  } catch (err: unknown) {
    console.error("Failed to upsertForm:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function toggleFormStatus(id: string, isOpen: boolean) {
  try {
    const supabase = await createClient();
    const userRes = await supabase
      .from("registration_forms")
      .update({ is_open: isOpen })
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("registration_forms")
        .update({ is_open: isOpen })
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error toggling form status:", userRes.error || adminRes.error);
        return {
          success: false,
          error: userRes.error?.message || adminRes.error.message,
        };
      }
    }

    revalidatePath("/admin/form-pendaftaran");
    revalidatePath("/admin/dashboard");
    revalidatePath("/join-us");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to toggleFormStatus:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

export async function deleteForm(id: string) {
  try {
    const supabase = await createClient();
    const userRes = await supabase
      .from("registration_forms")
      .delete()
      .eq("id", id);

    if (userRes.error) {
      const adminRes = await supabaseAdmin
        .from("registration_forms")
        .delete()
        .eq("id", id);

      if (adminRes.error) {
        console.error("Error deleting form:", userRes.error || adminRes.error);
        return {
          success: false,
          error: userRes.error?.message || adminRes.error.message,
        };
      }
    }

    revalidatePath("/admin/form-pendaftaran");
    return { success: true };
  } catch (err: unknown) {
    console.error("Failed to deleteForm:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Internal server error",
    };
  }
}

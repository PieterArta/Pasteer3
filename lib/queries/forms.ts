import { createClient } from "@/lib/supabase/server";
import type { RegistrationForm } from "@/lib/types";

export async function getForms(): Promise<RegistrationForm[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("registration_forms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error fetching forms:", error);
      return [];
    }
    return data as RegistrationForm[];
  } catch (err) {
    console.error("Failed to getForms:", err);
    return [];
  }
}

export async function getFormById(id: string): Promise<RegistrationForm | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("registration_forms")
      .select("*, plotting(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error(`Error fetching form ${id}:`, error);
      return null;
    }
    return data as RegistrationForm;
  } catch (err) {
    console.error(`Failed to getFormById for ${id}:`, err);
    return null;
  }
}

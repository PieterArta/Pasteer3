"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !data?.user) {
    return {
      error: signInError?.message || "Email atau kata sandi salah.",
    };
  }

  // Check if user is registered in the admins table
  let isAdmin = false;

  const { data: adminRecord, error: adminError } = await supabaseAdmin
    .from("admins")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!adminError && adminRecord) {
    isAdmin = true;
  } else {
    // Fallback: check via authenticated SECURITY DEFINER RPC in case of table grant restrictions
    const { data: rpcAdmin } = await supabase.rpc("is_admin");
    if (rpcAdmin) {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "Akun ini tidak terdaftar sebagai admin." };
  }

  redirect("/admin/dashboard");
}

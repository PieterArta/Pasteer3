import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function verifyAdmin(request?: NextRequest): Promise<boolean> {
  try {
    let supabase;
    if (request) {
      supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {},
          },
        }
      );
    } else {
      supabase = await createClient();
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return false;

    const { data, error } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && data) return true;

    // Fallback in case of service_role table grant restrictions
    const { data: userAdminRecord } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (userAdminRecord) return true;

    const { data: rpcAdmin } = await supabase.rpc("is_admin");
    if (rpcAdmin) return true;

    return false;
  } catch {
    return false;
  }
}

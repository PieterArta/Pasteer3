import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const reqCookies = request.cookies.getAll();
    let cookiesToUse = reqCookies;
    if (cookiesToUse.length === 0) {
      try {
        const { cookies } = await import("next/headers");
        const nextCookies = await cookies();
        cookiesToUse = nextCookies.getAll();
      } catch {
        // ignore
      }
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookiesToUse;
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const { data: adminRecord, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminRecord && !adminError) {
      return NextResponse.json({ isAdmin: true });
    }

    const { data: userAdminRecord } = await supabase
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (userAdminRecord) {
      return NextResponse.json({ isAdmin: true });
    }

    const { data: rpcAdmin } = await supabase.rpc("is_admin");
    if (rpcAdmin) {
      return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json({ isAdmin: false });
  } catch (err) {
    console.error("Check admin error:", err);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}

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
      console.error("CV URL auth failure:", userError);
      return NextResponse.json(
        { error: userError?.message || "Unauthorized" },
        { status: 401 }
      );
    }

    let isAdmin = false;
    const { data: adminRecord, error: adminError } = await supabaseAdmin
      .from("admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!adminError && adminRecord) {
      isAdmin = true;
    } else {
      const { data: userAdminRecord } = await supabase
        .from("admins")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (userAdminRecord) {
        isAdmin = true;
      } else {
        const { data: rpcAdmin } = await supabase.rpc("is_admin");
        if (rpcAdmin) {
          isAdmin = true;
        }
      }
    }

    if (!isAdmin) {
      console.error("User is not an admin:", user.id);
      return NextResponse.json(
        { error: "Akun ini bukan admin (Forbidden)." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Query parameter 'path' diperlukan." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.storage
      .from("cv")
      .createSignedUrl(path, 3600);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message || "Gagal membuat signed URL." },
        { status: 500 }
      );
    }

    // If accessed directly in browser navigation, redirect to signed URL
    const acceptHeader = request.headers.get("accept") || "";
    if (acceptHeader.includes("text/html")) {
      return NextResponse.redirect(data.signedUrl);
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err: unknown) {
    console.error("Generate CV signed URL error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error." },
      { status: 500 }
    );
  }
}

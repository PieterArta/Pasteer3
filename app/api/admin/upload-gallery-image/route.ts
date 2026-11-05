import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { cloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
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
      console.error("Upload gallery image auth failure:", userError);
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Field 'file' diperlukan." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Format file harus berupa gambar." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5 MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "pasteer3/gallery",
            resource_type: "image",
          },
          (error, res) => {
            if (error || !res) {
              reject(error);
            } else {
              resolve({
                secure_url: res.secure_url,
                public_id: res.public_id,
              });
            }
          }
        );
        stream.end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err: unknown) {
    console.error("Upload gallery image error:", err);
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
        ? String((err as { message: unknown }).message)
        : "Gagal mengunggah gambar galeri.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

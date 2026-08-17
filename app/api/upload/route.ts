import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient, BUCKETS } from "@/lib/supabase";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase server client not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided in form data." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          error: `Unsupported file format (${file.name}). Please upload JPG, PNG, or WEBP images.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `File is too large (${sizeMb}MB). Maximum allowed image size is 5MB.`,
        },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const uniqueId = Math.random().toString(36).substring(2, 9);
    const targetPath = `products/${Date.now()}-${uniqueId}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(BUCKETS.PRODUCT_IMAGES)
      .upload(targetPath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage Upload Error (Admin API):", error);
      return NextResponse.json(
        { error: `Failed to upload image to Supabase Storage: ${error.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKETS.PRODUCT_IMAGES)
      .getPublicUrl(data.path);

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
        path: publicUrlData.publicUrl,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error during image upload.";
    console.error("Upload API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase server client not configured." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const pathOrUrl = body.path;

    if (!pathOrUrl || pathOrUrl.startsWith("blob:") || pathOrUrl.startsWith("/")) {
      return NextResponse.json({ success: true });
    }

    let storagePath = pathOrUrl;
    if (pathOrUrl.includes(`/${BUCKETS.PRODUCT_IMAGES}/`)) {
      storagePath = pathOrUrl.split(`/${BUCKETS.PRODUCT_IMAGES}/`).pop()!;
    }

    const { error } = await supabase.storage
      .from(BUCKETS.PRODUCT_IMAGES)
      .remove([storagePath]);

    if (error) {
      console.warn("Supabase Storage Delete Warning (Admin API):", error);
      return NextResponse.json(
        { error: `Failed to delete image: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error during image delete.";
    console.error("Delete API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

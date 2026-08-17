import { getSupabaseAdminClient, BUCKETS } from "@/lib/supabase";

/**
 * Product Image Storage Service (Banat Halima)
 * Handles image validation, uploads via server API (/api/upload with service_role),
 * deletions, and public URL resolution.
 */

export interface StorageUploadResult {
  url: string;
  path: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validates uploaded file type and size.
 */
export function validateImageFile(file: File): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported file format (${file.name}). Please upload JPG, PNG, or WEBP images.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File is too large (${sizeMb}MB). Maximum allowed image size is 5MB.`,
    };
  }

  return { valid: true };
}

/**
 * Uploads a product image file via the server-side /api/upload endpoint (using service_role key to bypass client RLS).
 */
export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<StorageUploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid image file.");
  }

  // Client-side browser upload: Delegate to server API route
  if (typeof window !== "undefined") {
    const formData = new FormData();
    formData.append("file", file);
    if (productId) {
      formData.append("productId", productId);
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || `Upload failed with status ${res.status}`);
    }

    return {
      url: data.url,
      path: data.path || data.url,
    };
  }

  // Server-side fallback: Use Supabase admin client directly
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase client is not configured for image uploads.");
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
    console.error("Supabase Storage Upload Error:", error);
    throw new Error(`Failed to upload image to Supabase Storage: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKETS.PRODUCT_IMAGES)
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    path: publicUrlData.publicUrl,
  };
}

/**
 * Deletes a product image from Supabase Storage.
 */
export async function deleteProductImage(pathOrUrl: string): Promise<boolean> {
  if (!pathOrUrl || pathOrUrl.startsWith("blob:") || pathOrUrl.startsWith("/")) {
    return true;
  }

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathOrUrl }),
      });
      return res.ok;
    } catch (err) {
      console.warn("Error calling delete API:", err);
      return false;
    }
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return false;

  try {
    let storagePath = pathOrUrl;
    if (pathOrUrl.includes(`/${BUCKETS.PRODUCT_IMAGES}/`)) {
      storagePath = pathOrUrl.split(`/${BUCKETS.PRODUCT_IMAGES}/`).pop()!;
    }

    const { error } = await supabase.storage
      .from(BUCKETS.PRODUCT_IMAGES)
      .remove([storagePath]);

    if (error) {
      console.warn("Supabase Storage Delete Warning:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Supabase Storage delete exception:", err);
    return false;
  }
}

/**
 * Resolves full public URL for rendering product images.
 */
export function getProductImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("blob:") ||
    pathOrUrl.startsWith("/")
  ) {
    return pathOrUrl;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${BUCKETS.PRODUCT_IMAGES}/${pathOrUrl}`;
  }

  return `/${pathOrUrl}`;
}

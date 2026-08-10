import { getSupabaseAdminClient, BUCKETS } from "@/lib/supabase";

/**
 * Product Image Storage Abstraction Service (Banat Halima)
 * Handles image validation, uploads to Supabase Storage ('product-images' bucket),
 * deletions, and public URL resolution, with fallback for offline/local development.
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
 * Uploads a product image file to Supabase Storage if available,
 * otherwise creates a local Object URL preview.
 */
export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<StorageUploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid image file.");
  }

  const supabase = getSupabaseAdminClient();
  const fileExt = file.name.split(".").pop() || "jpg";
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const targetPath = `${productId || "products"}/${Date.now()}-${uniqueId}.${fileExt}`;

  if (supabase) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKETS.PRODUCT_IMAGES)
        .upload(targetPath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Supabase Storage Upload Error:", error);
        throw new Error(`Failed to upload to Supabase: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKETS.PRODUCT_IMAGES)
        .getPublicUrl(data.path);

      return {
        url: publicUrlData.publicUrl,
        path: publicUrlData.publicUrl,
      };
    } catch (err) {
      console.warn("Supabase Storage upload failed, falling back to local preview:", err);
    }
  }

  // Local object URL fallback
  const localPreviewUrl = URL.createObjectURL(file);
  return {
    url: localPreviewUrl,
    path: localPreviewUrl,
  };
}

/**
 * Deletes a product image from storage.
 */
export async function deleteProductImage(pathOrUrl: string): Promise<boolean> {
  if (pathOrUrl.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(pathOrUrl);
    } catch {
      // Ignore cleanup errors for local blobs
    }
    return true;
  }

  const supabase = getSupabaseAdminClient();
  if (supabase && (pathOrUrl.includes("/storage/v1/object/public/") || !pathOrUrl.startsWith("/"))) {
    try {
      const storagePath = pathOrUrl.includes("/product-images/")
        ? pathOrUrl.split("/product-images/").pop()!
        : pathOrUrl;

      const { error } = await supabase.storage
        .from(BUCKETS.PRODUCT_IMAGES)
        .remove([storagePath]);

      if (error) {
        console.error("Supabase Storage Delete Error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase Storage delete exception:", err);
    }
  }

  return true;
}

/**
 * Resolves full public URL for rendering product images in <img> tags.
 */
export function getProductImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "/product-teal.png";
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

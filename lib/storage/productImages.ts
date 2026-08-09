/**
 * Product Image Storage Abstraction Service (Banat Halima)
 * 
 * Modular service layer for handling product image validation, uploads,
 * deletions, and public URL resolution.
 * 
 * TEMPORARY DEVELOPMENT BEHAVIOR:
 * Generates local Object URLs (blobs) and path references for immediate UI previews.
 * 
 * FUTURE SUPABASE STORAGE INTEGRATION:
 * When Supabase is connected, replace the local blob handler with:
 * `supabase.storage.from('product-images').upload(filePath, file)`
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
 * Uploads a product image file.
 * Returns local object URL for preview and path reference.
 */
export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<StorageUploadResult> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid image file.");
  }

  // Generate unique filename identifier
  const fileExt = file.name.split(".").pop() || "jpg";
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const targetPath = `product-images/${productId || "new"}/${uniqueId}.${fileExt}`;

  // Local object URL for development preview
  const localPreviewUrl = URL.createObjectURL(file);

  /*
   * TODO: FUTURE SUPABASE STORAGE INTEGRATION
   * 
   * When Supabase is connected:
   * 1. Import getSupabaseAdminConfig or getSupabaseClient
   * 2. Upload file to Supabase bucket:
   *    const { data, error } = await supabase.storage
   *      .from('product-images')
   *      .upload(targetPath, file, { upsert: true });
   * 3. Get public URL:
   *    const { data: { publicUrl } } = supabase.storage
   *      .from('product-images')
   *      .getPublicUrl(targetPath);
   * 4. return { url: publicUrl, path: targetPath };
   */

  return {
    url: localPreviewUrl,
    path: localPreviewUrl, // Temporary preview reference
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
  }

  /*
   * TODO: FUTURE SUPABASE STORAGE INTEGRATION
   * 
   * When Supabase is connected:
   * const { error } = await supabase.storage
   *   .from('product-images')
   *   .remove([pathOrUrl]);
   * return !error;
   */

  return true;
}

/**
 * Resolves full public URL for rendering product images in <img> tags.
 * Supports local blob URLs, relative /public paths, http(s) URLs, and future Supabase Storage URLs.
 */
export function getProductImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "/product-teal.png";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("blob:") || pathOrUrl.startsWith("/")) {
    return pathOrUrl;
  }

  /*
   * TODO: FUTURE SUPABASE STORAGE INTEGRATION
   * 
   * If pathOrUrl is a Supabase Storage path (e.g. "product-images/p1/img.webp"):
   * return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${pathOrUrl}`;
   */

  return `/${pathOrUrl}`;
}

import type { Product } from "@/types/product";
import {
  getSupabaseAdminClient,
  TABLES,
  mapSupabaseRowToProduct,
  mapProductToSupabaseRow,
} from "@/lib/supabase";

// ─── Admin Data Access Layer for Products ──────────────────────────────────────
// Supabase is the sole source of truth. No fake/fallback data.

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.warn("Supabase client not configured in getProducts");
    return [];
  }

  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase admin getProducts error:", error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data || []).map(mapSupabaseRowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.warn("Supabase client not configured in getProductById");
    return null;
  }

  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase admin getProductById error:", error);
    throw new Error(`Failed to fetch product by ID: ${error.message}`);
  }

  return data ? mapSupabaseRowToProduct(data) : null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.warn("Supabase client not configured in getProductBySlug");
    return null;
  }

  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Supabase admin getProductBySlug error:", error);
    throw new Error(`Failed to fetch product by slug: ${error.message}`);
  }

  return data ? mapSupabaseRowToProduct(data) : null;
}

export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt"> & Partial<Pick<Product, "id">>
): Promise<Product> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  let finalSlug = product.slug;

  // Resolve duplicate slugs automatically so products with the same name can be created
  const { data: existing } = await supabase
    .from(TABLES.PRODUCTS)
    .select("id")
    .eq("slug", finalSlug);

  if (existing && existing.length > 0) {
    const suffix = Math.random().toString(36).substring(2, 6);
    finalSlug = `${finalSlug}-${suffix}`;
  }

  const now = new Date().toISOString();
  const dbRow = mapProductToSupabaseRow({
    ...product,
    slug: finalSlug,
    createdAt: now,
    updatedAt: now,
  });

  // If no specific ID provided, let Postgres DEFAULT generate it
  if (!dbRow.id) {
    delete dbRow.id;
  }

  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .insert([dbRow])
    .select()
    .single();

  if (error) {
    console.error("Supabase admin createProduct error:", error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Database insert returned no data.");
  }

  return mapSupabaseRowToProduct(data);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const dbRow = mapProductToSupabaseRow({
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  // Prevent modifying the ID
  delete dbRow.id;

  const { data, error } = await supabase
    .from(TABLES.PRODUCTS)
    .update(dbRow)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase admin updateProduct error:", error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  return data ? mapSupabaseRowToProduct(data) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { error } = await supabase
    .from(TABLES.PRODUCTS)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase admin deleteProduct error:", error);
    throw new Error(`Database delete failed: ${error.message}`);
  }

  return true;
}

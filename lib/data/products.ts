import {
  getProducts as dbGetProducts,
  getProductById as dbGetProductById,
  getProductBySlug as dbGetProductBySlug,
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
} from "@/lib/db";
import type { Product } from "@/types/product";
import {
  getSupabaseAdminClient,
  TABLES,
  mapSupabaseRowToProduct,
  mapProductToSupabaseRow,
} from "@/lib/supabase";

// ─── Admin Data Access Layer for Products ──────────────────────────────────────
// Uses Supabase DB when configured, falls back seamlessly to flat-file JSON DB.

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase admin getProducts error:", error);
      } else if (data) {
        return data.map(mapSupabaseRowToProduct);
      }
    } catch (err) {
      console.error("Supabase admin getProducts exception:", err);
    }
  }

  return dbGetProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase admin getProductById error:", error);
      } else if (data) {
        return mapSupabaseRowToProduct(data);
      }
    } catch (err) {
      console.error("Supabase admin getProductById exception:", err);
    }
  }

  return dbGetProductById(id);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Supabase admin getProductBySlug error:", error);
      } else if (data) {
        return mapSupabaseRowToProduct(data);
      }
    } catch (err) {
      console.error("Supabase admin getProductBySlug exception:", err);
    }
  }

  return dbGetProductBySlug(slug);
}

export async function createProduct(product: Product): Promise<Product> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
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

    const dbRow = mapProductToSupabaseRow({ ...product, slug: finalSlug });
    const { data, error } = await supabase
      .from(TABLES.PRODUCTS)
      .insert([dbRow])
      .select()
      .single();

    if (error) {
      console.error("Supabase admin createProduct error:", error);
      throw new Error(`Database insert failed: ${error.message}`);
    }

    if (data) {
      return mapSupabaseRowToProduct(data);
    }
  }

  return dbCreateProduct(product);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    const dbRow = mapProductToSupabaseRow({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

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

    if (data) {
      return mapSupabaseRowToProduct(data);
    }
  }

  return dbUpdateProduct(id, updates);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
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

  return dbDeleteProduct(id);
}


import {
  getProducts as dbGetProducts,
  getProductById as dbGetProductById,
  getProductBySlug as dbGetProductBySlug,
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
} from "@/lib/db";
import type { Product } from "@/types/product";

// ─── Admin Data Access Layer for Products ──────────────────────────────────────
// High-level data access layer for all product operations.
// Swapping from JSON/mock file DB to Supabase requires changing only this file.

export async function getProducts(): Promise<Product[]> {
  // Future Supabase: return (await supabase.from('products').select('*')).data;
  return dbGetProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  // Future Supabase: return (await supabase.from('products').select('*').eq('id', id).single()).data;
  return dbGetProductById(id);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return dbGetProductBySlug(slug);
}

export async function createProduct(product: Product): Promise<Product> {
  // Future Supabase: return (await supabase.from('products').insert([product]).select().single()).data;
  return dbCreateProduct(product);
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  // Future Supabase: return (await supabase.from('products').update(updates).eq('id', id).select().single()).data;
  return dbUpdateProduct(id, updates);
}

export async function deleteProduct(id: string): Promise<boolean> {
  // Future Supabase: await supabase.from('products').delete().eq('id', id); return true;
  return dbDeleteProduct(id);
}

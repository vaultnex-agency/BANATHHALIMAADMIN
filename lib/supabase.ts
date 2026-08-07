/**
 * Supabase Client Helper (Admin)
 * 
 * Centralized Supabase integration layer for banathalima-admin.
 * Configured with support for both public anon key and service role key
 * for administrative actions (e.g. bypassing RLS when updating orders or managing storage).
 * 
 * Integration Steps:
 * 1. Run `npm install @supabase/supabase-js`
 * 2. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY & SUPABASE_SERVICE_ROLE_KEY to .env.local
 * 3. Switch functions in `@/lib/data/products.ts` & `@/lib/data/orders.ts` to use Supabase.
 */

export interface SupabaseAdminConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export function getSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey, serviceRoleKey };
}

// Supabase Storage Bucket configuration for product image uploads
export const BUCKETS = {
  PRODUCT_IMAGES: "product-images",
} as const;

// Database table names
export const TABLES = {
  PRODUCTS: "products",
  ORDERS: "orders",
  ORDER_ITEMS: "order_items",
  USERS: "users",
} as const;

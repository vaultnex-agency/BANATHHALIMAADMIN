import type { Order } from "@/types/order";
import {
  getSupabaseAdminClient,
  TABLES,
  mapSupabaseRowToOrder,
} from "@/lib/supabase";

// ─── Admin Data Access Layer for Orders ────────────────────────────────────────
// Supabase is the sole source of truth. No fake/fallback data.

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.warn("Supabase client not configured in getOrders");
    return [];
  }

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase admin getOrders error:", error);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return (data || []).map(mapSupabaseRowToOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    console.warn("Supabase client not configured in getOrderById");
    return null;
  }

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase admin getOrderById error:", error);
    throw new Error(`Failed to fetch order by ID: ${error.message}`);
  }

  return data ? mapSupabaseRowToOrder(data) : null;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { data, error } = await supabase
    .from(TABLES.ORDERS)
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase admin updateOrderStatus error:", error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  return data ? mapSupabaseRowToOrder(data) : null;
}

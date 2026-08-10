import {
  getOrders as dbGetOrders,
  getOrderById as dbGetOrderById,
  updateOrderStatus as dbUpdateOrderStatus,
} from "@/lib/db";
import type { Order } from "@/types/order";
import {
  getSupabaseAdminClient,
  TABLES,
  mapSupabaseRowToOrder,
} from "@/lib/supabase";

// ─── Admin Data Access Layer for Orders ────────────────────────────────────────
// Centralized order data fetching & status mutations with Supabase integration.

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase admin getOrders error:", error);
      } else if (data && data.length > 0) {
        return data.map(mapSupabaseRowToOrder);
      }
    } catch (err) {
      console.error("Supabase admin getOrders exception:", err);
    }
  }

  return dbGetOrders();
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Supabase admin getOrderById error:", error);
      } else if (data) {
        return mapSupabaseRowToOrder(data);
      }
    } catch (err) {
      console.error("Supabase admin getOrderById exception:", err);
    }
  }

  return dbGetOrderById(id);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  const supabase = getSupabaseAdminClient();
  if (supabase) {
    try {
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
      } else if (data) {
        return mapSupabaseRowToOrder(data);
      }
    } catch (err) {
      console.error("Supabase admin updateOrderStatus exception:", err);
    }
  }

  return dbUpdateOrderStatus(id, status);
}

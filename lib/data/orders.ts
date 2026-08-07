import {
  getOrders as dbGetOrders,
  getOrderById as dbGetOrderById,
  updateOrderStatus as dbUpdateOrderStatus,
} from "@/lib/db";
import type { Order } from "@/types/order";

// ─── Admin Data Access Layer for Orders ────────────────────────────────────────
// Centralized order data fetching & status mutations.
// Easily replaceable with Supabase Client queries in the future.

export async function getOrders(): Promise<Order[]> {
  // Future Supabase: return (await supabase.from('orders').select('*').order('created_at', { ascending: false })).data;
  return dbGetOrders();
}

export async function getOrderById(id: string): Promise<Order | null> {
  // Future Supabase: return (await supabase.from('orders').select('*').eq('id', id).single()).data;
  return dbGetOrderById(id);
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order | null> {
  // Future Supabase: return (await supabase.from('orders').update({ status }).eq('id', id).select().single()).data;
  return dbUpdateOrderStatus(id, status);
}

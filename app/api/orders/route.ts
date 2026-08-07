import { NextResponse } from "next/server";
import { getOrders } from "@/lib/data/orders";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

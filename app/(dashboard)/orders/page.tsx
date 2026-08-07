import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { getOrders } from "@/lib/data/orders";
import { OrderStatusBadge } from "./OrderStatusBadge";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-amber-500" />
            <span>Order Management</span>
          </h1>
          <p className="text-sm text-zinc-400">
            View, track, and update customer order statuses
          </p>
        </div>
        <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg font-mono">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Phone / City</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-amber-400 font-semibold">
                    {order.orderNumber || order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.customer.fullName}</div>
                    <div className="text-xs text-zinc-500">{order.customer.email || "No email provided"}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="text-zinc-300">{order.customer.phone}</div>
                    <div className="text-zinc-500">{order.customer.city}, {order.customer.country}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    {order.total.toLocaleString("en-AE")} AED
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("en-AE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

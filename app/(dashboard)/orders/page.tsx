import Link from "next/link";
import { Eye } from "lucide-react";
import { getOrders } from "@/lib/data/orders";
import { OrderStatusBadge } from "./OrderStatusBadge";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
            Orders
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-normal">
            Track and manage customer orders and fulfillment status
          </p>
        </div>
        <div className="bg-white border border-neutral-200/80 px-4 py-2 rounded-xl text-xs text-neutral-600 font-medium shadow-2xs self-start sm:self-auto">
          Total Orders: <span className="font-bold text-neutral-900">{orders.length}</span>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-700 border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 text-[11px] uppercase tracking-wider text-neutral-400 font-semibold border-b border-neutral-100">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-neutral-900">
                    {order.orderNumber || order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-neutral-900 text-sm">
                      {order.customer.fullName}
                    </div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      {order.customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-neutral-600">
                    {order.items.length} item(s)
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-neutral-900">
                    AED {order.total.toLocaleString("en-AE")}
                  </td>
                  <td className="px-6 py-4 text-xs text-neutral-500 font-normal">
                    {new Date(order.createdAt).toLocaleDateString("en-AE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-700 font-medium px-3.5 py-1.5 rounded-xl transition-all shadow-2xs"
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

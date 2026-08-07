import Link from "next/link";
import { Package, ShoppingBag, DollarSign, TrendingUp, PlusCircle, ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { getOrders } from "@/lib/data/orders";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inStockProducts = products.filter((p) => p.inStock).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-zinc-400">
            Real-time analytics and store management summary
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {totalRevenue.toLocaleString("en-AE")} <span className="text-xs font-normal text-zinc-400">AED</span>
          </p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live store total
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Total Orders
            </span>
            <ShoppingBag className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{orders.length}</p>
          <span className="text-[11px] text-amber-400 font-mono">
            {pendingOrders} pending fulfillment
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Total Products
            </span>
            <Package className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{products.length}</p>
          <span className="text-[11px] text-zinc-400">
            {inStockProducts} in stock
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Supabase Status
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-sm font-semibold text-zinc-200">Data Abstraction Ready</p>
          <span className="text-[11px] text-zinc-400">
            Ready for Supabase Auth & Storage
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link
            href="/orders"
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/60 text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-amber-400">
                    {order.orderNumber || order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.customer.fullName}</div>
                    <div className="text-xs text-zinc-500">{order.customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {order.items.length} item(s)
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    {order.total.toLocaleString("en-AE")} AED
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs text-zinc-400 hover:text-amber-300 underline"
                    >
                      Manage
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

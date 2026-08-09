import Link from "next/link";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { getOrders } from "@/lib/data/orders";
import { OrderStatusBadge } from "../orders/OrderStatusBadge";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 font-normal">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: TOTAL REVENUE (Emphasized Black Card) */}
        <div className="bg-neutral-950 text-white rounded-2xl p-6 shadow-sm border border-neutral-900 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-white">
              AED {totalRevenue.toLocaleString("en-AE")}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {orders.length} total orders
            </p>
          </div>
        </div>

        {/* Card 2: PENDING ORDERS */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-neutral-900">
              {pendingOrders}
            </p>
            <p className="text-xs text-amber-700 font-medium mt-1">
              Awaiting confirmation
            </p>
          </div>
        </div>

        {/* Card 3: PRODUCTS */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              Products
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-neutral-900">
              {products.length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {inStockProducts} in stock
            </p>
          </div>
        </div>

        {/* Card 4: AVG. ORDER VALUE */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              Avg. Order Value
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-neutral-900">
              AED {avgOrderValue.toLocaleString("en-AE")}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Per successful order
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900">Recent Orders</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Latest customer transactions</p>
          </div>
          <Link
            href="/orders"
            className="text-xs font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1.5 hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-neutral-100">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="p-5 flex items-center justify-between hover:bg-neutral-50/60 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-semibold text-neutral-700 shrink-0">
                  {order.customer.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-neutral-900">
                      {order.orderNumber || order.id}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-sm font-medium text-neutral-900">
                      {order.customer.fullName}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString("en-AE", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <OrderStatusBadge status={order.status} />
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900 font-mono">
                    AED {order.total.toLocaleString("en-AE")}
                  </p>
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

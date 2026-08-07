import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Save } from "lucide-react";
import { getOrderById } from "@/lib/data/orders";
import { OrderStatusBadge } from "../OrderStatusBadge";
import type { Order } from "@/types/order";

type Params = { params: Promise<{ id: string }> };

export const revalidate = 0;

export default async function AdminOrderDetailPage({ params }: Params) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  async function updateStatusAction(formData: FormData) {
    "use server";
    const newStatus = formData.get("status") as Order["status"];
    if (newStatus && order) {
      const { updateOrderStatus } = await import("@/lib/data/orders");
      await updateOrderStatus(order.id, newStatus);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/orders"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white font-mono">Order #{order.orderNumber || order.id}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString("en-AE")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Customer & Shipping Details */}
        <div className="space-y-6 md:col-span-1">
          {/* Customer */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
              <User className="w-4 h-4 text-amber-500" />
              <span>Customer Information</span>
            </h3>
            <div className="space-y-2 text-sm text-zinc-300">
              <p className="font-semibold text-white">{order.customer.fullName}</p>
              <p className="text-zinc-400 font-mono text-xs">{order.customer.phone}</p>
              {order.customer.email && (
                <p className="text-zinc-400 text-xs">{order.customer.email}</p>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Shipping Address</span>
            </h3>
            <div className="space-y-1 text-sm text-zinc-300">
              <p>{order.customer.addressLine1}</p>
              {order.customer.addressLine2 && <p>{order.customer.addressLine2}</p>}
              <p>{order.customer.city}, {order.customer.emirate || order.customer.country}</p>
            </div>
          </div>

          {/* Status Update Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>Update Order Status</span>
            </h3>
            <form action={updateStatusAction} className="space-y-4">
              <select
                name="status"
                defaultValue={order.status}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Status</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Items & Pricing Breakdown */}
        <div className="space-y-6 md:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-3">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Ordered Items ({order.items.length})</span>
            </h3>

            <div className="divide-y divide-zinc-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.productImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-14 object-cover rounded-lg border border-zinc-800"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-white text-sm">{item.productName}</p>
                      <p className="text-xs text-zinc-400">
                        Size: {item.size || "Standard"} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-amber-400 font-semibold text-sm">
                    {(item.price * item.quantity).toLocaleString("en-AE")} AED
                  </p>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>{order.subtotal.toLocaleString("en-AE")} AED</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping Fee</span>
                <span>{order.shippingCost === 0 ? "FREE" : `${order.shippingCost} AED`}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-800">
                <span>Total Amount</span>
                <span className="text-amber-400">{order.total.toLocaleString("en-AE")} AED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

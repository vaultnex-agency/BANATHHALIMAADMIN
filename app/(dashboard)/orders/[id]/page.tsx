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
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/orders"
            className="p-2 rounded-xl bg-white border border-neutral-200/80 text-neutral-600 hover:text-neutral-900 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
                Order #{order.orderNumber || order.id}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString("en-AE")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Customer & Shipping Details */}
        <div className="space-y-6 md:col-span-1">
          {/* Customer */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
              <User className="w-4 h-4 text-amber-600" />
              <span>Customer Information</span>
            </h3>
            <div className="space-y-1.5 text-sm text-neutral-700">
              <p className="font-semibold text-neutral-900">{order.customer.fullName}</p>
              <p className="text-neutral-500 font-mono text-xs">{order.customer.phone}</p>
              {order.customer.email && (
                <p className="text-neutral-500 text-xs">{order.customer.email}</p>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Shipping Address</span>
            </h3>
            <div className="space-y-1 text-sm text-neutral-700">
              <p>{order.customer.addressLine1}</p>
              {order.customer.addressLine2 && <p>{order.customer.addressLine2}</p>}
              <p>{order.customer.city}, {order.customer.emirate || order.customer.country}</p>
            </div>
          </div>

          {/* Status Update Form */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Update Order Status</span>
            </h3>
            <form action={updateStatusAction} className="space-y-4">
              <select
                name="status"
                defaultValue={order.status}
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-900 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Status</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Items & Financial Breakdown */}
        <div className="space-y-6 md:col-span-2">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-3">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Ordered Items ({order.items.length})</span>
            </h3>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.productImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-14 h-14 object-cover rounded-xl border border-neutral-200 bg-neutral-50"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-neutral-900 text-sm">{item.productName}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Size: {item.size || "Standard"} | Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-neutral-900 font-semibold text-sm">
                    {(item.price * item.quantity).toLocaleString("en-AE")} AED
                  </p>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>AED {order.subtotal.toLocaleString("en-AE")}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping Fee</span>
                <span>{order.shippingCost === 0 ? "FREE" : `AED ${order.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-neutral-900 font-bold text-lg pt-3 border-t border-neutral-100 font-serif">
                <span>Total Amount</span>
                <span>AED {order.total.toLocaleString("en-AE")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

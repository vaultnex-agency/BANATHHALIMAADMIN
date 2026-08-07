import type { Order } from "@/types/order";

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  shipped: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  refunded: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function OrderStatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider border ${
        statusStyles[status] || "bg-zinc-800 text-zinc-400 border-zinc-700"
      }`}
    >
      {status}
    </span>
  );
}

import { StatusBadge } from "@/components/admin/StatusBadge";

export function OrderStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} />;
}

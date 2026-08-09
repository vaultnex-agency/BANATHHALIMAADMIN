import React from "react";

export type StatusType =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "in_stock"
  | "out_of_stock"
  | string;

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = "" }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let styles = "bg-neutral-100 text-neutral-700 border-neutral-200";
  let displayLabel = label || status;

  if (normalized === "pending") {
    styles = "bg-amber-50 text-amber-800 border-amber-200/80";
    displayLabel = label || "Pending";
  } else if (normalized === "processing") {
    styles = "bg-purple-50 text-purple-800 border-purple-200/80";
    displayLabel = label || "Processing";
  } else if (normalized === "shipped") {
    styles = "bg-sky-50 text-sky-800 border-sky-200/80";
    displayLabel = label || "Shipped";
  } else if (normalized === "delivered" || normalized === "in_stock" || normalized === "instock") {
    styles = "bg-emerald-50 text-emerald-800 border-emerald-200/80";
    displayLabel = label || (normalized.includes("stock") ? "In Stock" : "Delivered");
  } else if (normalized === "cancelled" || normalized === "refunded" || normalized === "out_of_stock") {
    styles = "bg-rose-50 text-rose-800 border-rose-200/80";
    displayLabel = label || (normalized.includes("stock") ? "Out of Stock" : normalized === "cancelled" ? "Cancelled" : "Refunded");
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize tracking-wide ${styles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {displayLabel}
    </span>
  );
}

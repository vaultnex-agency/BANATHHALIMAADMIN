"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  PlusCircle,
  LogOut,
  ExternalLink,
  Store,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/products",
    icon: Package,
  },
  {
    name: "Add Product",
    href: "/products/new",
    icon: PlusCircle,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "https://banathaleema.ae";

  return (
    <aside className="w-64 bg-zinc-900 text-white min-h-screen flex flex-col justify-between p-4 border-r border-zinc-800 shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-amber-500" />
            <span className="font-semibold text-lg tracking-wider text-amber-100">
              BANAT HALEEMA
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-widest bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-500/30">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-zinc-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Store Link / Logout */}
      <div className="space-y-2 pt-4 border-t border-zinc-800">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-medium text-zinc-400 hover:text-amber-300 rounded-lg hover:bg-zinc-800/40 transition-colors"
        >
          <span>View Customer Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

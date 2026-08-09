"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Plus,
  LogOut,
  ExternalLink,
  Store,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

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
    name: "Orders",
    href: "/orders",
    icon: ShoppingBag,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || "https://banathalima.ae";

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full p-6">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-5 border-b border-neutral-200/80">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/60 text-amber-600">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-neutral-900 leading-tight">
                  Banat Halima
                </h1>
                <p className="text-[11px] font-sans text-neutral-400 font-medium tracking-wide uppercase">
                  Admin Panel
                </p>
              </div>
            </div>
            {mobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Prominent Add Product Button */}
        <Link
          href="/products/new"
          onClick={() => setMobileOpen(false)}
          className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-medium py-3 px-4 rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all duration-200 text-sm tracking-wide"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Product</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1.5 pt-2">
          <div className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 px-3 mb-2">
            Navigation
          </div>
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
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Links */}
      <div className="pt-6 border-t border-neutral-200/80 space-y-1.5">
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-neutral-600 hover:text-amber-700 hover:bg-amber-50/60 rounded-xl transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Store className="w-3.5 h-3.5 text-neutral-400" />
            <span>View Customer Store</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </a>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50/70 transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-neutral-200/80 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <Store className="w-5 h-5 text-amber-600" />
          <span className="font-serif text-lg font-bold text-neutral-900">Banat Halima</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-80 bg-white min-h-full z-10 shadow-2xl flex flex-col">
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 bg-white text-neutral-900 min-h-screen flex-col border-r border-neutral-200/80 shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>
    </>
  );
}

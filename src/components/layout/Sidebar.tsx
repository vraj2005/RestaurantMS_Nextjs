"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Table,
  Menu,
  Utensils,
  Receipt,
  ChefHat,
  Users
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tables", href: "/tables", icon: Table },
  { name: "Menu", href: "/menu", icon: Menu },
  { name: "Orders", href: "/orders", icon: Receipt },
  { name: "Users", href: "/users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          DineFlow POS
        </h1>
        <p className="text-xs text-gray-500 mt-1">Restaurant Management</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                  : "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-gray-200 mt-4">
        <p className="text-xs text-gray-400 text-center">v1.0.0</p>
      </div>
    </aside>
  );
}

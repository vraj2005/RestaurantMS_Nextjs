"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, Users, Table, Menu, Receipt } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tables", href: "/tables", icon: Table },
  { name: "Menu Categories", href: "/menu-categories", icon: Menu },
  { name: "Menu Items", href: "/menu-items", icon: Utensils },
  { name: "Orders", href: "/orders", icon: Receipt },
  { name: "Users", href: "/users", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 min-h-screen p-4 flex flex-col">
      <div className="text-2xl font-bold text-blue-500 mb-8">DineFlow POS</div>

      <nav className="flex-1 space-y-1">
        {links.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-gray-800 text-blue-400 border-l-4 border-blue-500"
                  : "text-gray-300 hover:bg-gray-800 hover:text-blue-300"
              )}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

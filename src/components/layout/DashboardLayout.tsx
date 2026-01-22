"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Table,
  Users,
  LogOut,
  Building2,
  FolderOpen,
  UtensilsCrossed,
  Receipt,
  ShoppingCart,
  ChefHat,
} from "lucide-react";

const allLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["manager", "admin"] },
  { name: "Restaurants", href: "/restaurants", icon: Building2, roles: ["manager", "admin"] },
  { name: "Users", href: "/users", icon: Users, roles: ["manager", "admin"] },
  { name: "Tables", href: "/tables", icon: Table, roles: ["manager", "admin", "waiter", "cashier"] },
  { name: "Menu Categories", href: "/menu-categories", icon: FolderOpen, roles: ["manager", "admin"] },
  { name: "Menu Items", href: "/menu-items", icon: UtensilsCrossed, roles: ["manager", "admin"] },
  { name: "Orders", href: "/orders", icon: Receipt, roles: ["manager", "admin", "waiter", "kitchen", "chef", "cashier"] },
  { name: "Order Items", href: "/order-items", icon: ShoppingCart, roles: ["manager", "admin", "waiter", "kitchen", "chef", "cashier"] },
  { name: "Kitchen Orders", href: "/kitchen", icon: ChefHat, roles: ["manager", "admin", "kitchen", "chef"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedRole = localStorage.getItem("authRole");
    const storedName = localStorage.getItem("authUserName");
    setRole(storedRole);
    setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUserName");
    document.cookie = "authToken=;path=/;max-age=0";
    document.cookie = "authRole=;path=/;max-age=0";
    router.push("/login");
  };

  // Filter links based on role
  const links = allLinks.filter((link) => {
    if (!role) return false;
    return link.roles.includes(role.toLowerCase());
  });

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Dishly POS
          </h1>
          <p className="text-xs text-gray-500 mt-1">Restaurant Management</p>
        </div>

        {/* User Info */}
        {(userName || role) && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userName || "User"}</p>
            <p className="text-xs text-purple-600 capitalize">({role})</p>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                    : "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Portal` : "Dashboard"}
            </p>
            <p className="text-xs text-gray-500">Manage your restaurant</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold">
              {role?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">{role || "User"}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

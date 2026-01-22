"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { role, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Portal` : "Welcome"}
        </p>
        <p className="text-xs text-gray-500">Manage your restaurant</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
            {role?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 capitalize">{role}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} className="inline mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
}

"use client";

import { Table, ShoppingCart, TrendingUp, Users, ChefHat, Receipt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTables, getOrders } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  const { data: tables = [], isLoading: tablesLoading } = useQuery({ 
    queryKey: ["tables"], 
    queryFn: getTables,
    enabled: typeof window !== "undefined"
  });
  
  const { data: orders = [], isLoading: ordersLoading } = useQuery({ 
    queryKey: ["orders"], 
    queryFn: getOrders,
    enabled: typeof window !== "undefined"
  });

  const isLoading = tablesLoading || ordersLoading;
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.TotalAmount) || 0), 0);

  const stats = [
    { title: "Total Tables", value: tables.length.toString(), icon: Table },
    { title: "Total Orders", value: orders.length.toString(), icon: ShoppingCart },
    { title: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, icon: TrendingUp },
  ];

  const quickStats = [
    { label: "Pending Orders", value: orders.filter((o: any) => o.OrderStatus === "pending").length.toString(), icon: Receipt },
    { label: "In Kitchen", value: orders.filter((o: any) => o.OrderStatus === "preparing").length.toString(), icon: ChefHat },
    { label: "Active Tables", value: tables.filter((t: any) => t.TableStatus === "occupied").length.toString(), icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s your restaurant overview</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickStats.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Icon className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-xl font-semibold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

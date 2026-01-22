"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderItems, updateOrder, getMenuItems } from "@/lib/api";
import { useState } from "react";
import { ChefHat, Clock, Eye, EyeOff, ImageOff, RefreshCw } from "lucide-react";
import { useToast } from "@/components/Toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function KitchenPage() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [openId, setOpen] = useState<number | null>(null);

  const { data: list = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: typeof window !== "undefined",
    refetchInterval: 30000 // Auto refresh every 30 seconds
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    enabled: typeof window !== "undefined"
  });

  const updMut = useMutation({
    mutationFn: (p: any) => updateOrder(p.id, p.body),
    onSuccess: (data, variables) => {
      refetch();
      const status = variables.body.OrderStatus;
      addToast(
        status === "preparing" ? "Order started cooking" : "Order marked as served",
        "success"
      );
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to update order", "error");
    }
  });

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </DashboardLayout>
  );

  const queue = list.filter(
    (o: any) => o.OrderStatus === "pending" || o.OrderStatus === "preparing"
  );

  const pendingCount = list.filter((o: any) => o.OrderStatus === "pending").length;
  const preparingCount = list.filter((o: any) => o.OrderStatus === "preparing").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Kitchen Display</h2>
            <p className="text-sm text-gray-500 mt-1">Active orders ready for preparation</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
              <span className="text-sm font-semibold text-yellow-700">⏳ {pendingCount} Pending</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <span className="text-sm font-semibold text-blue-700">🔥 {preparingCount} Cooking</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
              <Clock className="text-orange-600" size={18} />
              <span className="text-sm font-semibold text-orange-700">{queue.length} Active</span>
            </div>
          </div>
        </div>

        {queue.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <ChefHat className="mx-auto text-green-600 mb-3" size={48} />
            <p className="text-lg font-semibold text-green-700">All Clear!</p>
            <p className="text-sm text-green-600 mt-1">No pending orders in the kitchen</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {queue.map((ord: any) => (
            <OrderCard
              key={ord.OrderID}
              order={ord}
              menuItems={menuItems}
              openId={openId}
              setOpen={setOpen}
              updMut={updMut}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function OrderCard({ order, menuItems, openId, setOpen, updMut }: any) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["order-items", order.OrderID],
    queryFn: () => getOrderItems(order.OrderID)
  });

  const isOpen = openId === order.OrderID;

  const handle = (st: string) => {
    updMut.mutate({
      id: order.OrderID,
      body: { OrderStatus: st }
    });
  };

  const isPending = order.OrderStatus === "pending";

  const getMenuItemImage = (menuItemId: number) => {
    const menuItem = menuItems.find((m: any) => m.MenuItemID === menuItemId);
    return menuItem?.MenuItemImagePath;
  };

  const getMenuItemName = (item: any) => {
    if (item.ItemName || item.MenuItemName) return item.ItemName || item.MenuItemName;
    const menuItem = menuItems.find((m: any) => m.MenuItemID === item.MenuItemID);
    return menuItem?.MenuItemName || `Item #${item.MenuItemID}`;
  };

  return (
    <div className={`border-2 rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-all ${
      isPending ? "border-yellow-300" : "border-blue-300"
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-bold text-xl text-gray-900">Order #{order.OrderID}</p>
          <p className="text-sm text-gray-600">Table {order.TableID}</p>
          {order.CreatedAt && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(order.CreatedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          order.OrderStatus === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-blue-100 text-blue-800"
        }`}>
          {order.OrderStatus === "pending" ? "⏳ Pending" : "🔥 Preparing"}
        </span>
      </div>

      <button
        className="w-full mb-4 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
        onClick={() => setOpen(isOpen ? null : order.OrderID)}
      >
        {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
        {isOpen ? "Hide Items" : `View Items (${items.length})`}
      </button>

      {isOpen && (
        <div className="border rounded-lg p-3 bg-gray-50 mb-4 space-y-2 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-2">No items</p>
          ) : items.map((it: any) => {
            const imagePath = it.MenuItemImagePath || getMenuItemImage(it.MenuItemID);
            return (
              <div key={it.OrderItemID} className="flex items-center gap-3 bg-white p-2 rounded border">
                {imagePath ? (
                  <img 
                    src={imagePath} 
                    alt={getMenuItemName(it)}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center ${imagePath ? 'hidden' : ''}`}>
                  <ImageOff className="text-gray-400" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{getMenuItemName(it)}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
                      Qty: {it.Quantity}
                    </span>
                    {it.Notes && <span className="truncate">📝 {it.Notes}</span>}
                  </div>
                </div>
                <span className="font-semibold text-purple-600 text-sm whitespace-nowrap">
                  ₹{it.SubTotal || it.Subtotal || 0}
                </span>
              </div>
            );
          })}
          {items.length > 0 && (
            <div className="border-t pt-2 mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Items: {items.reduce((sum: number, i: any) => sum + (i.Quantity || 0), 0)}</span>
              <span className="font-bold text-green-600">₹{order.TotalAmount}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {order.OrderStatus === "pending" && (
          <button
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm disabled:opacity-50 transition-all shadow-sm"
            onClick={() => handle("preparing")}
            disabled={updMut.isPending}
          >
            🔥 Start Cooking
          </button>
        )}

        {order.OrderStatus === "preparing" && (
          <button
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm disabled:opacity-50 transition-all shadow-sm"
            onClick={() => handle("served")}
            disabled={updMut.isPending}
          >
            ✅ Mark as Served
          </button>
        )}
      </div>
    </div>
  );
}

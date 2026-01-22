"use client";

import { useState } from "react";
import { addOrderItem, getOrders, getMenuItems } from "@/lib/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { Plus, X, ImageOff } from "lucide-react";

export default function AddOrderItemDialog() {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [menuItemId, setMenuItemId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const qc = useQueryClient();
  const { addToast } = useToast();

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: open
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    enabled: open
  });

  const selectedMenuItem = menuItems.find((m: any) => String(m.MenuItemID) === menuItemId);

  const mut = useMutation({
    mutationFn: () => addOrderItem({
      OrderID: Number(orderId),
      MenuItemID: Number(menuItemId),
      Quantity: Number(quantity),
      Price: selectedMenuItem?.MenuItemPrice || 0,
      SubTotal: (selectedMenuItem?.MenuItemPrice || 0) * Number(quantity)
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orderItems"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order item added successfully", "success");
      setOrderId("");
      setMenuItemId("");
      setQuantity("1");
      setOpen(false);
    },
    onError: (error: any) => {
      console.error("Add order item error:", error);
      addToast(error.response?.data?.message || "Failed to add order item", "error");
    }
  });

  const handleSave = () => {
    if (!orderId) {
      addToast("Please select an order", "error");
      return;
    }
    if (!menuItemId) {
      addToast("Please select a menu item", "error");
      return;
    }
    if (!quantity || Number(quantity) < 1) {
      addToast("Please enter valid quantity", "error");
      return;
    }
    mut.mutate();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        <Plus size={18} /> Add Order Item
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        <Plus size={18} /> Add Order Item
      </button>
      
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Add Order Item</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order *</label>
            <select
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Order</option>
              {orders.map((o: any) => (
                <option key={o.OrderID} value={o.OrderID}>
                  Order #{o.OrderID} - Table {o.TableID} ({o.OrderStatus})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu Item *</label>
            <select
              value={menuItemId}
              onChange={(e) => setMenuItemId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Menu Item</option>
              {menuItems.map((m: any) => (
                <option key={m.MenuItemID} value={m.MenuItemID}>
                  {m.MenuItemName} - ₹{m.MenuItemPrice}
                </option>
              ))}
            </select>
          </div>

          {selectedMenuItem && (
            <div className="bg-gray-50 rounded-lg p-3 flex gap-3">
              {selectedMenuItem.MenuItemImagePath ? (
                <img 
                  src={selectedMenuItem.MenuItemImagePath} 
                  alt={selectedMenuItem.MenuItemName}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageOff className="text-gray-400" size={24} />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{selectedMenuItem.MenuItemName}</p>
                <p className="text-sm text-gray-500">{selectedMenuItem.MenuCategoryName}</p>
                <p className="text-sm font-bold text-green-600">₹{selectedMenuItem.MenuItemPrice}</p>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              placeholder="1"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {selectedMenuItem && quantity && (
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-sm text-purple-600">Subtotal</p>
              <p className="text-xl font-bold text-purple-700">
                ₹{(selectedMenuItem.MenuItemPrice * Number(quantity)).toFixed(2)}
              </p>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!orderId || !menuItemId || !quantity || mut.isPending}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {mut.isPending ? "Adding..." : "Add Item"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

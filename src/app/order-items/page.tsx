"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrderItems, deleteOrderItem, updateOrderItem, getMenuItems, getTables, getOrders, createOrder, addOrderItem, getOrderItems } from "@/lib/api";
import { useState, useEffect } from "react";
import { Trash2, Pencil, ShoppingCart, X, ImageOff, Plus, Minus, Check, RefreshCw } from "lucide-react";
import { useToast } from "@/components/Toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function OrderItemsPage() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  
  // POS State
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [existingOrders, setExistingOrders] = useState<any[]>([]);

  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    enabled: typeof window !== "undefined"
  });

  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    enabled: typeof window !== "undefined"
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: typeof window !== "undefined"
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const items = menuItems;
      const cats = new Set(items.map((i: any) => i.MenuCategoryName).filter(Boolean));
      return Array.from(cats);
    },
    enabled: menuItems.length > 0
  });

  // Create new order mutation
  const createOrderMut = useMutation({
    mutationFn: (body: any) => createOrder(body),
    onSuccess: (data) => {
      setCurrentOrder(data);
      qc.invalidateQueries({ queryKey: ["orders"] });
      addToast("New order started. Add items to cart.", "success");
      setShowOrderModal(false);
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to create order", "error");
    }
  });

  // Add order item mutation
  const addItemMut = useMutation({
    mutationFn: (body: any) => addOrderItem(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["orderItems"] });
    },
    onError: (error: any) => {
      console.error("Add item error:", error);
    }
  });

  // Handle table selection
  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    // Check for existing pending/preparing orders for this table
    const tableOrders = orders.filter(
      (o: any) => o.TableID === table.TableID && (o.OrderStatus === "pending" || o.OrderStatus === "preparing")
    );
    setExistingOrders(tableOrders);
    setShowOrderModal(true);
    setCart([]);
    setCurrentOrder(null);
  };

  // Start new order
  const startNewOrder = () => {
    createOrderMut.mutate({
      TableID: selectedTable.TableID,
      OrderStatus: "pending",
      TotalAmount: 0
    });
  };

  // Continue existing order
  const continueOrder = async (order: any) => {
    setCurrentOrder(order);
    // Load existing items into cart
    try {
      const items = await getOrderItems(order.OrderID);
      const cartItems = items.map((item: any) => {
        const menuItem = menuItems.find((m: any) => m.MenuItemID === item.MenuItemID);
        return {
          ...menuItem,
          qty: item.Quantity,
          orderItemId: item.OrderItemID
        };
      });
      setCart(cartItems);
    } catch (e) {
      console.error(e);
    }
    setShowOrderModal(false);
    addToast(`Continuing order #${order.OrderID}`, "success");
  };

  // Add to cart
  const addToCart = (item: any) => {
    if (!currentOrder) {
      addToast("Please start or continue an order first", "error");
      return;
    }
    setCart((old) => {
      const found = old.find((x) => x.MenuItemID === item.MenuItemID);
      if (found) {
        return old.map((x) =>
          x.MenuItemID === item.MenuItemID ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...old, { ...item, qty: 1 }];
    });
  };

  // Update quantity
  const updateQty = (id: number, q: number) => {
    setCart((old) =>
      old.map((x) => (x.MenuItemID === id ? { ...x, qty: q } : x)).filter((x) => x.qty > 0)
    );
  };

  // Remove from cart
  const removeFromCart = (id: number) => {
    setCart((old) => old.filter((x) => x.MenuItemID !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCurrentOrder(null);
    setSelectedTable(null);
  };

  // Submit order
  const submitOrder = async () => {
    if (!currentOrder || cart.length === 0) return;

    try {
      // Add each cart item to the order
      for (const item of cart) {
        if (!item.orderItemId) {
          await addOrderItem({
            OrderID: currentOrder.OrderID,
            MenuItemID: item.MenuItemID,
            Quantity: item.qty,
            Price: item.MenuItemPrice || item.Price,
            SubTotal: (item.MenuItemPrice || item.Price) * item.qty
          });
        }
      }
      
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["orderItems"] });
      addToast("Order submitted successfully!", "success");
      clearCart();
    } catch (error: any) {
      addToast(error.response?.data?.message || "Failed to submit order", "error");
    }
  };

  const total = cart.reduce((sum: number, c: any) => sum + (c.MenuItemPrice || c.Price || 0) * c.qty, 0);

  const filteredItems = categoryFilter === "all" 
    ? menuItems 
    : menuItems.filter((m: any) => m.MenuCategoryName === categoryFilter);

  const uniqueCategories = [...new Set(menuItems.map((m: any) => m.MenuCategoryName).filter(Boolean))];

  if (tablesLoading || menuLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Point of Sale (POS)</h2>
            <p className="text-sm text-gray-500 mt-1">Select a table and manage orders</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedTable && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <ShoppingCart className="text-blue-600" size={18} />
                <span className="text-sm font-semibold text-blue-700">TABLE {selectedTable.TableNumber || selectedTable.TableID}</span>
              </div>
            )}
            {currentOrder && (
              <button
                onClick={clearCart}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 font-medium text-sm"
              >
                CLEAR CART
              </button>
            )}
            {!currentOrder && (
              <button
                onClick={() => {
                  setSelectedTable(null);
                  setCurrentOrder(null);
                  setCart([]);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm"
              >
                NEW ORDER
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {currentOrder && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
            <Check className="text-green-600" size={20} />
            <span className="text-green-700 font-medium">
              {currentOrder.OrderID ? `Order #${currentOrder.OrderID} started. Add items to cart.` : "New order started. Add items to cart."}
            </span>
            <button onClick={() => setShowOrderModal(false)} className="ml-auto text-green-600 hover:text-green-800">
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Tables & Menu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Table Selection - Show only if no order started */}
            {!currentOrder && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Table</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                  {tables.map((t: any) => {
                    const isSelected = selectedTable?.TableID === t.TableID;
                    const hasActiveOrder = orders.some(
                      (o: any) => o.TableID === t.TableID && (o.OrderStatus === "pending" || o.OrderStatus === "preparing")
                    );
                    return (
                      <button
                        key={t.TableID}
                        onClick={() => handleTableSelect(t)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : hasActiveOrder
                            ? "border-orange-300 bg-orange-50 hover:border-orange-400"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                          isSelected ? "bg-blue-600 text-white" : hasActiveOrder ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"
                        }`}>
                          {t.TableNumber || t.TableID}
                        </div>
                        <p className="text-xs mt-1 text-gray-500">{hasActiveOrder ? "Active" : t.TableStatus || "Free"}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Menu Items - Show only if order started */}
            {currentOrder && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                {/* Category Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map((cat: any) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredItems.map((item: any) => (
                    <div
                      key={item.MenuItemID}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-900">{item.MenuItemName}</h4>
                      <p className="text-xs text-gray-500 uppercase">{item.MenuCategoryName}</p>
                      <p className="text-lg font-bold text-green-600 my-2">₹{item.MenuItemPrice || item.Price}</p>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        <Plus size={16} /> ADD TO CART
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <ShoppingCart className="text-purple-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Order Cart</h3>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-sm">Cart is empty</p>
                  <p className="text-xs mt-1">{currentOrder ? "Add items from menu" : "Select a table to start"}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                    {cart.map((item, index) => (
                      <div key={`${item.MenuItemID}-${index}`} className="flex items-center justify-between border-b pb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{item.MenuItemName || item.ItemName}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.MenuItemPrice || item.Price} × {item.qty} = ₹{((item.MenuItemPrice || item.Price) * item.qty).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.MenuItemID, item.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center font-medium">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.MenuItemID, item.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.MenuItemID)}
                            className="w-7 h-7 flex items-center justify-center text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Total:</span>
                      <span className="text-2xl font-bold text-green-600">₹{total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={submitOrder}
                      disabled={cart.length === 0}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors"
                    >
                      SUBMIT ORDER
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Selection Modal */}
      {showOrderModal && selectedTable && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowOrderModal(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Table {selectedTable.TableNumber || selectedTable.TableID}</h2>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <button
                onClick={startNewOrder}
                disabled={createOrderMut.isPending}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {createOrderMut.isPending ? "Creating..." : "New Order"}
              </button>

              {existingOrders.length > 0 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500">or continue existing</span>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {existingOrders.map((order) => (
                      <button
                        key={order.OrderID}
                        onClick={() => continueOrder(order)}
                        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Order #{order.OrderID}</p>
                          <p className="text-xs text-gray-500">
                            {order.OrderStatus} • ₹{order.TotalAmount || 0}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.OrderStatus === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {order.OrderStatus}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

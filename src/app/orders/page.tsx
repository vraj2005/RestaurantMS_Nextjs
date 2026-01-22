"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, deleteOrder, updateOrder, getOrderItems } from "@/lib/api";
import { useState, useEffect } from "react";
import { Eye, Trash2, Receipt, TrendingUp, Pencil, X, ImageOff, CreditCard, Banknote, Wallet } from "lucide-react";
import AddOrderDialog from "./add-dialog";
import EditOrderDialog from "./edit-dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/Toast";

export default function OrdersPage() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [editOrder, setEditOrder] = useState<any>(null);
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("authRole") || "";
    setUserRole(role.toLowerCase());
  }, []);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: typeof window !== "undefined"
  });

  const delMut = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      refetch();
      addToast("Order deleted successfully", "success");
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to delete", "error");
    }
  });

  const updMut = useMutation({
    mutationFn: (data: any) => updateOrder(data.id, data.body),
    onSuccess: () => {
      refetch();
      addToast("Order status updated successfully", "success");
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to update", "error");
    }
  });

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "preparing": return "bg-blue-100 text-blue-700";
      case "served": return "bg-green-100 text-green-700";
      case "paid": return "bg-purple-100 text-purple-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </DashboardLayout>
  );

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.TotalAmount) || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Orders Management</h2>
            <p className="text-sm text-gray-500 mt-1">Track and manage all restaurant orders</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <TrendingUp className="text-green-600" size={18} />
              <div>
                <p className="text-xs text-green-600 font-medium">Total Revenue</p>
                <p className="text-lg font-bold text-green-700">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
            <AddOrderDialog />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">Create your first order to get started</p>
            <AddOrderDialog />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((o: any) => (
                  <tr key={o.OrderID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{o.OrderID}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Table {o.TableID}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(o.OrderStatus)}`}>
                        {o.OrderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">₹{o.TotalAmount}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {o.CreatedAt ? new Date(o.CreatedAt).toLocaleString() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setViewOrder(o)}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Eye size={14} className="mr-1" /> View
                      </button>
                      {userRole === "cashier" && o.OrderStatus?.toLowerCase() !== "paid" && o.OrderStatus?.toLowerCase() !== "cancelled" && (
                        <button
                          onClick={() => setPaymentOrder(o)}
                          className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Wallet size={14} className="mr-1" /> Pay
                        </button>
                      )}
                      {userRole !== "cashier" && (
                        <>
                          <button
                            onClick={() => setEditOrder(o)}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <Pencil size={14} className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this order?")) {
                                delMut.mutate(o.OrderID);
                              }
                            }}
                            disabled={delMut.isPending}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={14} className="mr-1" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewOrder && (
          <ViewOrderModal
            order={viewOrder}
            close={() => setViewOrder(null)}
            onStatusChange={(newStatus: string) => {
              updMut.mutate({ id: viewOrder.OrderID, body: { OrderStatus: newStatus } });
            }}
          />
        )}

        {paymentOrder && (
          <PaymentModal
            order={paymentOrder}
            close={() => setPaymentOrder(null)}
            onPayment={(paymentMethod: string) => {
              updMut.mutate({ 
                id: paymentOrder.OrderID, 
                body: { OrderStatus: "paid" } 
              });
              setPaymentOrder(null);
            }}
          />
        )}

        {editOrder && (
          <EditOrderDialog row={editOrder} close={() => setEditOrder(null)} />
        )}
      </div>
    </DashboardLayout>
  );
}

function ViewOrderModal({ order, close, onStatusChange }: { order: any; close: () => void; onStatusChange: (status: string) => void }) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["order-items", order.OrderID],
    queryFn: () => getOrderItems(order.OrderID)
  });

  const statuses = ["pending", "preparing", "served", "paid", "cancelled"];

  const getStatusStyle = (status: string, current: string) => {
    if (status === current) {
      return "bg-purple-600 text-white";
    }
    return "bg-gray-100 hover:bg-gray-200 text-gray-700";
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Order #{order.OrderID}</h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Table</p>
              <p className="text-lg font-semibold text-gray-900">Table {order.TableID}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-600 mb-1">Total Amount</p>
              <p className="text-lg font-bold text-green-700">₹{order.TotalAmount}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                No items in this order
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item: any) => (
                  <div key={item.OrderItemID} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    {item.MenuItemImagePath ? (
                      <img 
                        src={item.MenuItemImagePath} 
                        alt={item.ItemName || item.MenuItemName}
                        className="w-14 h-14 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center ${item.MenuItemImagePath ? 'hidden' : ''}`}>
                      <ImageOff className="text-gray-400" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.ItemName || item.MenuItemName || `Item #${item.MenuItemID}`}</p>
                      <p className="text-sm text-gray-500">Qty: {item.Quantity} × ₹{item.Price || item.UnitPrice || 0}</p>
                    </div>
                    <p className="font-bold text-purple-600">₹{item.SubTotal || item.Subtotal || 0}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${getStatusStyle(status, order.OrderStatus)}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-400 pt-4 border-t space-y-1">
            {order.CreatedAt && <p>Created: {new Date(order.CreatedAt).toLocaleString()}</p>}
            {order.UpdatedAt && <p>Updated: {new Date(order.UpdatedAt).toLocaleString()}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

function PaymentModal({ order, close, onPayment }: { order: any; close: () => void; onPayment: (method: string) => void }) {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    if (!paymentMethod) return;
    setProcessing(true);
    onPayment(paymentMethod);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Wallet className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Take Payment</h2>
                  <p className="text-purple-200 text-sm">Order #{order.OrderID}</p>
                </div>
              </div>
              <button onClick={close} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-600 mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-green-700">₹{order.TotalAmount}</p>
              <p className="text-xs text-green-500 mt-1">Table {order.TableID}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "cash" 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === "cash" ? "bg-green-500" : "bg-gray-100"
                  }`}>
                    <Banknote className={paymentMethod === "cash" ? "text-white" : "text-gray-500"} size={24} />
                  </div>
                  <span className={`font-medium ${paymentMethod === "cash" ? "text-green-700" : "text-gray-700"}`}>
                    Cash
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "online" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    paymentMethod === "online" ? "bg-blue-500" : "bg-gray-100"
                  }`}>
                    <CreditCard className={paymentMethod === "online" ? "text-white" : "text-gray-500"} size={24} />
                  </div>
                  <span className={`font-medium ${paymentMethod === "online" ? "text-blue-700" : "text-gray-700"}`}>
                    Online
                  </span>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={close}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!paymentMethod || processing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

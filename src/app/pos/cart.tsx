"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@/lib/api";
import { Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function CartBox({ table, cart, updateQty, clear }: any) {
  const qc = useQueryClient();
  const { addToast } = useToast();

  const makeOrder = useMutation({
    mutationFn: (body: any) => createOrder(body),
    onSuccess: () => {
      clear();
      qc.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order placed successfully!", "success");
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to place order", "error");
    }
  });

  const total = cart.reduce((sum: number, c: any) => sum + c.Price * c.qty, 0);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-lg sticky top-20">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b">
        <ShoppingCart className="text-blue-600" size={20} />
        <h3 className="text-lg font-bold text-gray-900">Shopping Cart</h3>
        {cart.length > 0 && (
          <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {cart.length}
          </span>
        )}
      </div>

      {!table && (
        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-yellow-800 font-medium">Please select a table to start an order</p>
        </div>
      )}

      {table && cart.length === 0 && (
        <div className="text-center py-8">
          <ShoppingCart className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-sm text-gray-500">Your cart is empty</p>
          <p className="text-xs text-gray-400 mt-1">Add items from the menu</p>
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto mb-4 pr-2">
        {cart.map((c: any) => (
          <div
            key={c.MenuItemID}
            className="flex justify-between items-center border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">{c.ItemName}</p>
              <p className="text-xs text-gray-500">₹{c.Price} each</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                onClick={() => updateQty(c.MenuItemID, c.qty - 1)}
              >
                −
              </Button>

              <span className="text-sm font-medium w-6 text-center">{c.qty}</span>

              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full border-2 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                onClick={() => updateQty(c.MenuItemID, c.qty + 1)}
              >
                +
              </Button>

              <span className="text-sm font-bold text-blue-600 w-16 text-right">
                ₹{(c.Price * c.qty).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
          <p className="font-semibold text-gray-700">Total Amount:</p>
          <p className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹{total.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          disabled={!table || cart.length === 0 || makeOrder.isPending}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          onClick={() =>
            makeOrder.mutate({
              TableID: table.TableID,
              OrderStatus: "pending",
              items: cart.map((c: any) => ({
                MenuItemID: c.MenuItemID,
                Quantity: c.qty
              }))
            })
          }
        >
          {makeOrder.isPending ? "Processing..." : "Place Order"}
        </Button>

        <Button
          variant="outline"
          className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold"
          onClick={clear}
          disabled={cart.length === 0}
        >
          <Trash2 size={16} className="mr-2" />
          Clear Cart
        </Button>
      </div>
    </div>
  );
}

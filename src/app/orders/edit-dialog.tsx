"use client";

import { useState } from "react";
import { updateOrder, getTables } from "@/lib/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { X } from "lucide-react";

export default function EditOrderDialog({ row, close }: { row: any; close: () => void }) {
  const qc = useQueryClient();
  const { addToast } = useToast();

  const [tableId, setTableId] = useState(String(row.TableID || ""));
  const [status, setStatus] = useState(row.OrderStatus || "pending");
  const [totalAmount, setTotalAmount] = useState(String(row.TotalAmount || ""));

  const { data: tables = [] } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables
  });

  const mut = useMutation({
    mutationFn: () => updateOrder(row.OrderID, {
      TableID: Number(tableId),
      OrderStatus: status,
      TotalAmount: Number(totalAmount) || 0
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order updated successfully", "success");
      close();
    },
    onError: (error: any) => {
      console.error("Update order error:", error);
      addToast(error.response?.data?.message || "Failed to update order", "error");
    }
  });

  const handleUpdate = () => {
    if (!tableId) {
      addToast("Please select a table", "error");
      return;
    }
    mut.mutate();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Order #{row.OrderID}</h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Table *</label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Table</option>
              {tables.map((t: any) => (
                <option key={t.TableID} value={t.TableID}>
                  Table {t.TableNumber || t.TableID} - {t.TableStatus || "Available"}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="served">Served</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={close}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!tableId || mut.isPending}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {mut.isPending ? "Updating..." : "Update Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

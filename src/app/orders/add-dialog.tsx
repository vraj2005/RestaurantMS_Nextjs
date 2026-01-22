"use client";

import { useState } from "react";
import { createOrder, getTables } from "@/lib/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { Plus, X } from "lucide-react";

export default function AddOrderDialog() {
  const [open, setOpen] = useState(false);
  const [tableId, setTableId] = useState("");
  const [status, setStatus] = useState("pending");
  const [totalAmount, setTotalAmount] = useState("");
  const qc = useQueryClient();
  const { addToast } = useToast();

  const { data: tables = [] } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
    enabled: open
  });

  const mut = useMutation({
    mutationFn: () => createOrder({
      TableID: Number(tableId),
      OrderStatus: status,
      TotalAmount: Number(totalAmount) || 0
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      addToast("Order created successfully", "success");
      setTableId("");
      setStatus("pending");
      setTotalAmount("");
      setOpen(false);
    },
    onError: (error: any) => {
      console.error("Create order error:", error);
      addToast(error.response?.data?.message || "Failed to create order", "error");
    }
  });

  const handleSave = () => {
    if (!tableId) {
      addToast("Please select a table", "error");
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
        <Plus size={18} /> New Order
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        <Plus size={18} /> New Order
      </button>
      
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create New Order</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
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
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Total (optional)</label>
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
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!tableId || mut.isPending}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {mut.isPending ? "Creating..." : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

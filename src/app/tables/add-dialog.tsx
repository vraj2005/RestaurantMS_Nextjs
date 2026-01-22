"use client";

import { useState } from "react";
import { addTable } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { Plus, X } from "lucide-react";

export default function AddTableDialog() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("4");

  const mut = useMutation({
    mutationFn: () => addTable({ 
      TableNumber: Number(tableNumber),
      TableCapacity: Number(capacity),
      TableStatus: "free"
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tables"] });
      addToast("Table added successfully", "success");
      setOpen(false);
      setTableNumber("");
      setCapacity("4");
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to add table", "error");
    }
  });

  const handleAdd = () => {
    if (tableNumber.trim() && capacity.trim()) {
      mut.mutate();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all flex items-center gap-2 text-sm font-medium"
      >
        <Plus size={18} />
        Add Table
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Table</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
                <input
                  type="number"
                  placeholder="e.g., 1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (seats)</label>
                <input
                  type="number"
                  placeholder="e.g., 4"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAdd();
                  }}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!tableNumber.trim() || !capacity.trim() || mut.isPending}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 disabled:opacity-50"
                >
                  {mut.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

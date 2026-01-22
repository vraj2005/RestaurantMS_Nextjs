"use client";

import { useState } from "react";
import { updateTable } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { X } from "lucide-react";

export default function EditTableDialog({ row, close }: any) {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [tableNumber, setTableNumber] = useState(row.TableNumber?.toString() || "");
  const [capacity, setCapacity] = useState(row.TableCapacity?.toString() || "4");
  const [status, setStatus] = useState(row.TableStatus || "free");

  const mut = useMutation({
    mutationFn: () =>
      updateTable(row.TableID, { 
        TableNumber: Number(tableNumber),
        TableCapacity: Number(capacity),
        TableStatus: status 
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tables"] });
      addToast("Table updated successfully", "success");
      close();
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to update table", "error");
    }
  });

  const handleUpdate = () => {
    if (tableNumber.trim() && capacity.trim()) {
      mut.mutate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Table</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Table Number</label>
            <input
              type="number"
              placeholder="Table Number"
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
              placeholder="Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="free">Free</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={close}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!tableNumber.trim() || !capacity.trim() || mut.isPending}
              className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 disabled:opacity-50"
            >
              {mut.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { updateCategory } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { X } from "lucide-react";

export default function EditCategoryDialog({ row, close }: { row: any; close: () => void }) {
  const [name, setName] = useState(row.MenuCategoryName || "");
  const [image, setImage] = useState(row.MenuCategoryImagePath || "");
  const qc = useQueryClient();
  const { addToast } = useToast();

  const mut = useMutation({
    mutationFn: () => updateCategory(row.MenuCategoryID, { 
      MenuCategoryName: name, 
      MenuCategoryImagePath: image || "" 
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      addToast("Category updated successfully", "success");
      close();
    },
    onError: (error: any) => {
      console.error("Update category error:", error);
      addToast(error.response?.data?.message || "Failed to update category", "error");
    }
  });

  const handleUpdate = () => {
    if (!name.trim()) {
      addToast("Please enter category name", "error");
      return;
    }
    mut.mutate();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={close} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Category</h2>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
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
              disabled={!name.trim() || mut.isPending}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {mut.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

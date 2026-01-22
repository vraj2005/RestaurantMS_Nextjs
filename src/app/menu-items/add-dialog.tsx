"use client";

import { useState } from "react";
import { addMenuItem } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { Plus, X } from "lucide-react";

export default function AddItemDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const qc = useQueryClient();
  const { addToast } = useToast();

  const mut = useMutation({
    mutationFn: () => addMenuItem({
      MenuItemName: name,
      MenuItemPrice: Number(price),
      MenuCategoryID: Number(categoryId),
      MenuItemImagePath: image || ""
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menuItems"] });
      addToast("Menu item added successfully", "success");
      setName("");
      setPrice("");
      setCategoryId("");
      setImage("");
      setOpen(false);
    },
    onError: (error: any) => {
      console.error("Add menu item error:", error);
      addToast(error.response?.data?.message || "Failed to add menu item", "error");
    }
  });

  const handleSave = () => {
    if (!name.trim()) {
      addToast("Please enter item name", "error");
      return;
    }
    if (!price || Number(price) <= 0) {
      addToast("Please enter valid price", "error");
      return;
    }
    if (!categoryId) {
      addToast("Please select a category", "error");
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
        <Plus size={18} /> Add Item
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        <Plus size={18} /> Add Item
      </button>
      
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Menu Item</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map((c: any) => (
                <option key={c.MenuCategoryID} value={c.MenuCategoryID}>
                  {c.MenuCategoryName}
                </option>
              ))}
            </select>
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
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !price || !categoryId || mut.isPending}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {mut.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

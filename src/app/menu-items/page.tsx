"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMenuItems, deleteMenuItem, getCategories } from "@/lib/api";
import AddItemDialog from "./add-dialog";
import EditItemDialog from "./edit-dialog";
import { useState } from "react";
import { Pencil, Trash2, UtensilsCrossed, ImageOff } from "lucide-react";
import { useToast } from "@/components/Toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function MenuItemsPage() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [editObj, setEdit] = useState<any>(null);

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
    enabled: typeof window !== "undefined"
  });

  const { data: cats = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: typeof window !== "undefined"
  });

  const delMut = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      refetch();
      addToast("Item deleted successfully", "success");
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to delete", "error");
    }
  });

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Menu Items</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your restaurant menu items</p>
          </div>
          <AddItemDialog categories={cats} />
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first menu item</p>
            <AddItemDialog categories={cats} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((m: any) => (
              <div key={m.MenuItemID} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-square relative bg-gray-100">
                  {m.MenuItemImagePath ? (
                    <img
                      src={m.MenuItemImagePath}
                      alt={m.MenuItemName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${m.MenuItemImagePath ? 'hidden' : ''}`}>
                    <ImageOff className="text-gray-300" size={48} />
                  </div>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                    #{m.MenuItemID}
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ₹{m.MenuItemPrice}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{m.MenuItemName}</h3>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mb-3">
                    {m.MenuCategoryName || "No Category"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEdit(m)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Pencil size={14} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this item?")) {
                          delMut.mutate(m.MenuItemID);
                        }
                      }}
                      disabled={delMut.isPending}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {editObj && (
          <EditItemDialog
            row={editObj}
            categories={cats}
            close={() => setEdit(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

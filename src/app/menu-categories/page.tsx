"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, deleteCategory } from "@/lib/api";
import AddCategoryDialog from "./add-dialog";
import EditCategoryDialog from "./edit-dialog";
import { useState } from "react";
import { Trash2, Pencil, FolderOpen, ImageOff } from "lucide-react";
import { useToast } from "@/components/Toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CategoriesPage() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [editItem, setEdit] = useState<any>(null);

  const { data: list = [], isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: typeof window !== "undefined"
  });

  const delMut = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      refetch();
      addToast("Category deleted successfully", "success");
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
            <h2 className="text-2xl font-semibold text-gray-900">Menu Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Organize your menu items into categories</p>
          </div>
          <AddCategoryDialog />
        </div>

        {list.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first category</p>
            <AddCategoryDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((cat: any) => (
              <div key={cat.MenuCategoryID} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-video relative bg-gray-100">
                  {cat.MenuCategoryImagePath ? (
                    <img
                      src={cat.MenuCategoryImagePath}
                      alt={cat.MenuCategoryName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${cat.MenuCategoryImagePath ? 'hidden' : ''}`}>
                    <ImageOff className="text-gray-300" size={48} />
                  </div>
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-600">
                    #{cat.MenuCategoryID}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{cat.MenuCategoryName}</h3>
                  {cat.RestaurantName && (
                    <p className="text-xs text-gray-500 mb-3">{cat.RestaurantName}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEdit(cat)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Pencil size={14} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this category?")) {
                          delMut.mutate(cat.MenuCategoryID);
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

        {editItem && (
          <EditCategoryDialog row={editItem} close={() => setEdit(null)} />
        )}
      </div>
    </DashboardLayout>
  );
}

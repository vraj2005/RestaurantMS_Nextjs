"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRestaurants, updateRestaurant } from "@/lib/api";
import { useState } from "react";
import { Pencil, Building2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function RestaurantsPage() {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [editItem, setEditItem] = useState<any>(null);

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants
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
            <h2 className="text-2xl font-semibold text-gray-900">Restaurants</h2>
            <p className="text-sm text-gray-500 mt-1">Manage restaurant details</p>
          </div>
        </div>

        {restaurants.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants yet</h3>
            <p className="text-gray-500">Restaurants will appear here</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {restaurants.map((r: any) => (
                  <tr key={r.RestaurantID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{r.RestaurantID}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{r.RestaurantName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.RestaurantAddress || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.RestaurantPhone || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditItem(r)}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={14} className="mr-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editItem && (
          <EditRestaurantDialog
            row={editItem}
            close={() => setEditItem(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function EditRestaurantDialog({ row, close }: { row: any; close: () => void }) {
  const qc = useQueryClient();
  const { addToast } = useToast();
  const [name, setName] = useState(row.RestaurantName || "");
  const [address, setAddress] = useState(row.RestaurantAddress || "");
  const [phone, setPhone] = useState(row.RestaurantPhone || "");

  const mut = useMutation({
    mutationFn: () => updateRestaurant(row.RestaurantID, {
      RestaurantName: name,
      RestaurantAddress: address,
      RestaurantPhone: phone
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurants"] });
      addToast("Restaurant updated successfully", "success");
      close();
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to update", "error");
    }
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Restaurant</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={close} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button
              onClick={() => mut.mutate()}
              disabled={!name.trim() || mut.isPending}
              className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              {mut.isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

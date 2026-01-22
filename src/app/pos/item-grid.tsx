"use client";

import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ItemGrid({ onAdd }: any) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["foods"],
    queryFn: getMenuItems
  });

  if (isLoading) return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
        <span className="text-sm text-gray-500">{items.length} items</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((it: any) => (
          <div
            key={it.MenuItemID}
            className="group border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:border-blue-400 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm mb-1">{it.ItemName}</p>
                <p className="text-lg font-bold text-blue-600">₹{it.Price}</p>
              </div>

              <Button
                size="sm"
                className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full shadow-md hover:shadow-lg transition-all group-hover:scale-105"
                onClick={() => onAdd(it)}
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

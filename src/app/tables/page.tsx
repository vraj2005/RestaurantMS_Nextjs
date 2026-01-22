"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTables, removeTable } from "@/lib/api";
import AddTableDialog from "./add-dialog";
import EditTableDialog from "./edit-dialog";
import { useState } from "react";
import { Trash2, Pencil, Table as TableIcon } from "lucide-react";
import { useToast } from "@/components/Toast";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TablesPage() {
  const qc = useQueryClient();
  const { addToast } = useToast();

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables
  });

  const [editItem, setEdit] = useState<any>(null);

  const delMut = useMutation({
    mutationFn: removeTable,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tables"] });
      addToast("Table deleted successfully", "success");
    },
    onError: (error: any) => {
      addToast(error.response?.data?.message || "Failed to delete table", "error");
    }
  });

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "free":
        return "bg-green-100 text-green-700";
      case "occupied":
        return "bg-red-100 text-red-700";
      case "reserved":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            <h2 className="text-2xl font-semibold text-gray-900">Tables Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your restaurant tables</p>
          </div>
          <AddTableDialog />
        </div>

        {tables.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TableIcon className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first table</p>
            <AddTableDialog />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tables.map((t: any) => (
                  <tr key={t.TableID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{t.TableID}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">Table {t.TableNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.TableCapacity} seats</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(t.TableStatus)}`}>
                        {t.TableStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setEdit(t)}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Pencil size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this table?")) {
                            delMut.mutate(t.TableID);
                          }
                        }}
                        disabled={delMut.isPending}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Tables</p>
            <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Free Tables</p>
            <p className="text-2xl font-bold text-green-600">
              {tables.filter((t: any) => t.TableStatus === "free").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Occupied Tables</p>
            <p className="text-2xl font-bold text-red-600">
              {tables.filter((t: any) => t.TableStatus === "occupied").length}
            </p>
          </div>
        </div>

        {editItem && (
          <EditTableDialog
            row={editItem}
            close={() => setEdit(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

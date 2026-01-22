"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser } from "@/lib/api";
import { useState } from "react";
import AddUserDialog from "./add-dialog";
import EditUserDialog from "./edit-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function UsersPage() {
  const qc = useQueryClient();

  const [editRow, setEdit] = useState<any>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  });

  const delMut = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] })
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
    <div className="space-y-4">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Users</h2>
        <AddUserDialog />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.UserID}>
                <TableCell className="font-medium">{u.UserID}</TableCell>
                <TableCell>{u.UserName}</TableCell>
                <TableCell>
                  <span className="capitalize px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                    {u.UserRole}
                  </span>
                </TableCell>

                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEdit(u)}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Pencil size={15} />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => delMut.mutate(u.UserID)}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    disabled={delMut.isPending}
                  >
                    <Trash2 size={15} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editRow && (
        <EditUserDialog row={editRow} close={() => setEdit(null)} />
      )}
    </div>
    </DashboardLayout>
  );
}

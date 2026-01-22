"use client";

import { useState } from "react";
import { updateUser } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditUserDialog({ row, close }: any) {
  const [usr, setUsr] = useState(row.UserName || "");
  const [role, setRole] = useState(row.UserRole || "");

  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: () =>
      updateUser(row.UserID, {
        UserName: usr,
        UserRole: role
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      close();
    }
  });

  const roles = ["waiter", "chef", "cashier", "manager"];

  const handleUpdate = () => {
    if (usr.trim() && role) {
      mut.mutate();
    }
  };

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4 px-6 pb-6">
          <Input
            value={usr}
            onChange={(e) => setUsr(e.target.value)}
          />

          <select
            className="w-full border border-gray-300 rounded p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleUpdate}
              disabled={!usr.trim() || !role || mut.isPending}
            >
              {mut.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

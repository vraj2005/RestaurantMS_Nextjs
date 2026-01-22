"use client";

import { useState } from "react";
import { addUser } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddUserDialog() {
  const roles = ["waiter", "chef", "cashier", "manager"];

  const [open, setOpen] = useState(false);
  const [usr, setUsr] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("");

  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: () =>
      addUser({
        UserName: usr,
        Password: pass,
        UserRole: role
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      setUsr(""); setPass(""); setRole("");
      setOpen(false);
    }
  });

  const handleSave = () => {
    if (usr.trim() && pass && role) {
      mut.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Add User
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4 px-6 pb-6">
          <Input
            placeholder="Username"
            value={usr}
            onChange={(e) => setUsr(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <select
            className="w-full border border-gray-300 rounded p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={!usr.trim() || !pass || !role || mut.isPending}
            >
              {mut.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

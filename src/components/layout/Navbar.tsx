"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="font-medium text-gray-700">Welcome Back 👋</div>

      <div className="flex items-center gap-4">
        <Avatar className="bg-blue-100 text-blue-700">
          <AvatarFallback>VN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

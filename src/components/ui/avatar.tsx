import React from "react";

export function Avatar({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <span className={`inline-block rounded-full bg-gray-200 w-8 h-8 ${className ?? ""}`}>{children}</span>;
}

export function AvatarFallback({ children }: { children?: React.ReactNode }) {
  return <span className="flex items-center justify-center w-full h-full text-xs text-gray-500">{children}</span>;
}

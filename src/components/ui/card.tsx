import React from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5 border-b border-gray-100", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("text-xl font-semibold text-gray-900 tracking-tight", className)}>{children}</h2>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-gray-500 mt-1.5", className)}>{children}</p>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4 border-t border-gray-100 bg-gray-50/50", className)}>{children}</div>;
}

import React from "react";

export function Table({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <table className={`w-full border-collapse ${className || ""}`}>
      {children}
    </table>
  );
}

export function TableHeader({ children }: { children?: React.ReactNode }) {
  return <thead className="bg-gray-100 border-b">{children}</thead>;
}

export function TableBody({ children }: { children?: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <tr className={`border-b hover:bg-gray-50 ${className || ""}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${className || ""}`}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-gray-700 ${className || ""}`}>{children}</td>;
}

import "./globals.css";
import QueryProvider from "@/context/queryProvider";
import { ToastProvider } from "@/components/Toast";

export const metadata = {
  title: "DineFlow - Restaurant Management System",
  description: "POS & Restaurant Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

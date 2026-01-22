import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

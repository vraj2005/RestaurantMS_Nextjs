import DashboardLayout from "@/components/layout/DashboardLayout";

export default function MenuPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Menu</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your restaurant menu</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-gray-500">Menu management coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

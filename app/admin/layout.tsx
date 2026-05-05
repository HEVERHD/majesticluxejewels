import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <AdminSidebar />
      {/* pt-14 = altura del topbar móvil; en desktop no aplica porque el sidebar es sticky */}
      <main className="flex-1 min-w-0 p-4 md:p-8 pt-18 lg:pt-8">
        {children}
      </main>
    </div>
  );
}

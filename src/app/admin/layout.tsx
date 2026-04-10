"use client";

import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O middleware do Next.js já valida a sessão + admin
  // Não é necessário validar novamente no client
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}

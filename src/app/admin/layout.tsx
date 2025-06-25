// app/admin/layout.tsx
export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  // No validaciones aquí - todo en el cliente
  return <div className="min-h-screen bg-gray-50">{children}</div>
}

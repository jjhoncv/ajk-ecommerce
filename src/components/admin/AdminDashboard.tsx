// components/admin/AdminDashboard.tsx
import Link from 'next/link'
import AdminLogoutButton from './AdminLogoutButton'

interface AdminDashboardProps {
  user: {
    name: string
    email: string
    role?: string
    sections?: Array<{
      id: number
      name: string
      url: string
      image?: string
    }>
  }
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              TechStore Admin
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hola, <span className="font-medium">{user.name}</span>
              </span>
              {user.role && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  {user.role}
                </span>
              )}
              <AdminLogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Panel de Control
          </h2>
          <p className="text-gray-600">Bienvenido al panel de administración</p>
        </div>

        {/* Sections Grid */}
        {user.sections && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {user.sections.map((section) => (
              <Link
                key={section.id}
                href={`/admin${section.url}`}
                className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {section.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Gestionar {section.name.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

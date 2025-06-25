// components/admin/AdminDashboard.tsx
'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface AdminDashboardProps {
  user: {
    name: string
    email: string
    role: string
    sections: Array<{
      id: number
      name: string
      url: string
      image?: string
    }>
  }
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const handleLogout = () => {
    signOut({ redirect: false }) // No redirect, se quedará en la misma página
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                TechStore Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hola, <span className="font-medium">{user.name}</span>
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 transition-colors hover:text-gray-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Panel de Control
          </h2>
          <p className="text-gray-600">
            Bienvenido al panel de administración de TechStore
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {user.sections?.map((section) => (
            <Link
              key={section.id}
              href={`/admin${section.url}`}
              className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center">
                {section.image && (
                  <div className="mr-4 flex-shrink-0">
                    <img
                      src={section.image}
                      alt={section.name}
                      className="h-8 w-8"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                    {section.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Gestionar {section.name.toLowerCase()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Estadísticas Rápidas
            </h3>
            <p className="text-sm text-gray-600">
              Resumen de actividad reciente
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Actividad Reciente
            </h3>
            <p className="text-sm text-gray-600">Últimas acciones realizadas</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Notificaciones
            </h3>
            <p className="text-sm text-gray-600">
              Alertas y mensajes importantes
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { type User } from 'next-auth'
import Link from 'next/link'
import { PageUI } from './Page/Page'
import { PageTitle } from './Page/PageTitle'

interface AdminDashboardProps {
  user: User
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  return (
    <PageUI
      title={<PageTitle title="Panel de Control" />}
      subtitle={`Bienvenido, ${user.name}`}
      breadcrumb={[{ label: 'Dashboard' }]}
    >
      {/* User Info */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          {user.roleName != null && user.roleName !== '' && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {user.roleName}
            </span>
          )}
        </div>
      </div>

      {/* Sections Grid */}
      {user.sections != null && user.sections.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {user.sections.map((section) => (
            <Link
              key={section.id}
              href={`/admin${section.url}`}
              className="group rounded-lg border bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {section.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Gestionar {section.name.toLowerCase()}
                  </p>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {(user.sections == null || user.sections.length === 0) && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="h-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No hay secciones disponibles
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Contacta al administrador para obtener permisos de acceso.
          </p>
        </div>
      )}
    </PageUI>
  )
}

// components/admin/AdminLogout.tsx
'use client'

import { signOut } from 'next-auth/react'

export default function AdminLogout() {
  const handleLogout = async () => {
    // ⭐ Usar callbackUrl para redirigir a admin después del logout
    await signOut({
      callbackUrl: '/admin',
      redirect: true
    })
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      <svg
        className="-ml-1 mr-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Cerrar Sesión Admin
    </button>
  )
}

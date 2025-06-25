// components/admin/AdminLogoutButton.tsx
'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.refresh() // Refrescar para que el Server Component detecte que no hay sesión
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 transition-colors hover:text-gray-700"
    >
      Cerrar Sesión
    </button>
  )
}

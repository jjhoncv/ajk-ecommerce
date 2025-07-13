// components/admin/AdminClientWrapper.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import AdminLogin from './AdminLogin'

export default function AdminClientWrapper({}) {
  const { data: session, status } = useSession()
  const [showDashboard, setShowDashboard] = useState(false)

  // ⭐ Array de tipos de admin (igual que en AdminPage)
  const adminTypes = ['admin', 'superadmin']

  // Escuchar cambios en la sesión después del login
  useEffect(() => {
    if (session?.user?.type && adminTypes.includes(session.user.type)) {
      // Pequeño delay para mostrar transición
      setTimeout(() => {
        setShowDashboard(true)
      }, 500)
    }
  }, [session])

  // Si después del login es admin, mostrar dashboard
  if (
    showDashboard &&
    session?.user?.type &&
    adminTypes.includes(session.user.type)
  ) {
    return <AdminDashboard user={session.user} />
  }

  // Mostrar login (sin loading, render inmediato)
  return <AdminLogin />
}

// components/admin/AdminClientWrapper.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import AdminLogin from './AdminLogin'

interface AdminClientWrapperProps {
  initialSession: any // La sesión inicial del servidor
}

export default function AdminClientWrapper({
  initialSession
}: AdminClientWrapperProps) {
  const { data: session, status } = useSession()
  const [showDashboard, setShowDashboard] = useState(false)

  console.log(session?.user)

  // Escuchar cambios en la sesión después del login
  useEffect(() => {
    if (session?.user?.type === 'admin') {
      setShowDashboard(true)
    }
  }, [session])

  // Si después del login es admin, mostrar dashboard
  if (showDashboard && session?.user?.type === 'admin') {
    return <AdminDashboard user={session.user} />
  }

  // Mostrar login (sin loading, render inmediato)
  return <AdminLogin />
}

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
  const [isTransitioning, setIsTransitioning] = useState(false)

  console.log('🔍 Session status:', status)
  console.log('👤 Session user:', session?.user)

  // ⭐ Array de tipos de admin (igual que en AdminPage)
  const adminTypes = ['admin', 'superadmin']

  // Escuchar cambios en la sesión después del login
  useEffect(() => {
    console.log('🔄 AdminClientWrapper useEffect triggered')
    console.log('📊 Session data:', session)
    console.log('👤 User type:', session?.user?.type)
    console.log('🏷️ Admin types allowed:', adminTypes)
    console.log(
      '✅ Is admin type?',
      session?.user?.type && adminTypes.includes(session.user.type)
    )

    if (session?.user?.type && adminTypes.includes(session.user.type)) {
      console.log('✅ Admin session detected, transitioning to dashboard...')
      setIsTransitioning(true)

      // Pequeño delay para mostrar transición
      setTimeout(() => {
        setShowDashboard(true)
        setIsTransitioning(false)
      }, 500)
    } else if (session?.user) {
      console.log('❌ User logged in but not admin type:', session.user.type)
    } else {
      console.log('📭 No session or user data')
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

  // Mostrar estado de transición
  if (isTransitioning) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
            ✅ Login exitoso - Cargando dashboard...
          </div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </div>
    )
  }

  // Mostrar login (sin loading, render inmediato)
  return <AdminLogin />
}

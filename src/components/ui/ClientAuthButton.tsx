'use client'
import { useAuthModal } from '@/providers/auth-modal'
import { User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { type JSX, useEffect, useState } from 'react'

interface ClientAuthButtonProps {
  initialIsAuthenticated: boolean
  initialUserName: string
  initialUserEmail: string
  initialUserId: string
  variant?: 'header' | 'footer' | 'link'
  className?: string
}

const ClientAuthButton: React.FC<ClientAuthButtonProps> = ({
  initialIsAuthenticated,
  initialUserName,
  initialUserEmail,
  initialUserId,
  variant = 'header',
  className = ''
}) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { openLogin } = useAuthModal()

  const [authState, setAuthState] = useState({
    isAuthenticated: initialIsAuthenticated,
    userName: initialUserName,
    userEmail: initialUserEmail,
    userId: initialUserId
  })

  useEffect(() => {
    if (status === 'loading') return

    const newIsAuthenticated = session !== null

    if (newIsAuthenticated !== authState.isAuthenticated) {
      setAuthState({
        isAuthenticated: newIsAuthenticated,
        userName: session?.user?.name ?? '',
        userEmail: session?.user?.email ?? '',
        userId: session?.user?.id ?? ''
      })
    }
  }, [session, status])

  const handleAuthClick = (): void => {
    if (authState.isAuthenticated) {
      router.push('/account')
    } else {
      openLogin()
    }
  }

  const renderContent = (): JSX.Element => {
    const text = authState.isAuthenticated ? 'Mi cuenta' : 'Iniciar sesión'

    switch (variant) {
      case 'header':
        return (
          <button
            className={`relative flex flex-col items-center ${className}`}
          >
            <User className="h-6 w-6" />
            <span className="mt-1 text-xs">{text}</span>
          </button>
        )

      case 'footer':
        return (
          <span
            className={`text-gray-600 transition-colors duration-300 hover:text-primary ${className}`}
          >
            {text}
          </span>
        )

      case 'link':
        return <span className={`cursor-pointer ${className}`}>{text}</span>

      default:
        return <span className={className}>{text}</span>
    }
  }

  return (
    <div onClick={handleAuthClick} className="cursor-pointer">
      {renderContent()}
    </div>
  )
}

export default ClientAuthButton

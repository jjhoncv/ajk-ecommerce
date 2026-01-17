'use client'
import React, { useEffect, useState } from 'react'
import { CardContent } from '@/module/shared/components/CardContent/CardContent'
import { ProfileForm } from './ProfileForm'
import { PasswordForm } from './PasswordForm'
import { PhotoUpload } from './PhotoUpload'

interface ProfileViewProps {
  userId: number
}

interface UserProfile {
  id: number
  name: string
  lastname: string
  email: string
  photo?: string | null
  roleId?: number
  isActive?: number
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/profile')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setError('Error al cargar el perfil')
      }
    } catch (err) {
      setError('Error al cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <CardContent>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Cargando perfil...</div>
        </div>
      </CardContent>
    )
  }

  if (error || !user) {
    return (
      <CardContent>
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{error || 'Error al cargar el perfil'}</p>
        </div>
      </CardContent>
    )
  }

  return (
    <div className="space-y-6">
      {/* Foto de perfil */}
      <CardContent>
        <h2 className="mb-6 text-lg font-semibold">Foto de Perfil</h2>
        <PhotoUpload
          currentPhoto={user.photo}
          onPhotoUpdated={(newPhotoUrl) => {
            setUser({ ...user, photo: newPhotoUrl })
          }}
        />
      </CardContent>

      {/* Información personal */}
      <CardContent>
        <h2 className="mb-6 text-lg font-semibold">Información Personal</h2>
        <ProfileForm
          user={user}
          onProfileUpdated={(updatedUser) => {
            setUser(updatedUser)
          }}
        />
      </CardContent>

      {/* Cambiar contraseña */}
      <CardContent>
        <h2 className="mb-6 text-lg font-semibold">Cambiar Contraseña</h2>
        <PasswordForm />
      </CardContent>
    </div>
  )
}

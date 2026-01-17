'use client'
import React, { useState } from 'react'
import { Input } from '@/module/shared/components/Form/Input/Input'
import { Button } from '@/module/shared/components/Form/Input/Button'

interface UserProfile {
  id: number
  name: string
  lastname: string
  email: string
  photo?: string | null
  roleId?: number
  isActive?: number
}

interface ProfileFormProps {
  user: UserProfile
  onProfileUpdated: (updatedUser: UserProfile) => void
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onProfileUpdated
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    lastname: user.lastname,
    email: user.email
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Perfil actualizado correctamente')
        onProfileUpdated(data)
      } else {
        setError(data.error || 'Error al actualizar el perfil')
      }
    } catch (err) {
      setError('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded border border-green-200 bg-green-50 p-3">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <div>
        <Input
          type="text"
          label="Nombre"
          value={formData.name}
          onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }}
          required
          disabled={loading}
        />
      </div>

      <div>
        <Input
          type="text"
          label="Apellido"
          value={formData.lastname}
          onChange={(e) => { setFormData({ ...formData, lastname: e.target.value }) }
          }
          required
          disabled={loading}
        />
      </div>

      <div>
        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }}
          required
          disabled={loading}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}

'use client'
import React, { useState } from 'react'
import { signOut } from 'next-auth/react'
import { Input } from '@/module/shared/components/Form/Input/Input'
import { Button } from '@/module/shared/components/Form/Input/Button'

export const PasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
      const response = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        // Limpiar el formulario
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })

        // Cerrar sesión después de 2 segundos
        setTimeout(() => {
          signOut({ callbackUrl: '/admin' })
        }, 2000)
      } else {
        setError(data.error || 'Error al actualizar la contraseña')
      }
    } catch (err) {
      setError('Error al actualizar la contraseña')
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
          <p className="mt-1 text-xs text-green-600">
            Redirigiendo al login...
          </p>
        </div>
      )}

      <div>
        <Input
          type="password"
          label="Contraseña Actual"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
          required
          disabled={loading}
        />
      </div>

      <div>
        <Input
          type="password"
          label="Nueva Contraseña"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData({ ...formData, newPassword: e.target.value })
          }
          required
          minLength={6}
          disabled={loading}
        />
        <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
      </div>

      <div>
        <Input
          type="password"
          label="Confirmar Nueva Contraseña"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
          disabled={loading}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
        </Button>
      </div>
    </form>
  )
}

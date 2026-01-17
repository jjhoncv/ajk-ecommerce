'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, User } from 'lucide-react'
import { Button } from '@/module/shared/components/Form/Input/Button'

interface PhotoUploadProps {
  currentPhoto?: string | null
  onPhotoUpdated: (newPhotoUrl: string) => void
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  currentPhoto,
  onPhotoUpdated
}) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      // 1. Subir el archivo usando la API de library
      const uploadFormData = new FormData()
      uploadFormData.append('images[]', file)
      uploadFormData.append('name', 'images')
      uploadFormData.append('subdirectory', 'profile')

      const uploadResponse = await fetch('/api/admin/library', {
        method: 'POST',
        body: uploadFormData
      })

      if (!uploadResponse.ok) {
        throw new Error('Error al subir la imagen')
      }

      const uploadData = await uploadResponse.json()
      const photoUrl = uploadData.filesURL[0]

      // 2. Actualizar el perfil con la nueva URL
      const updateResponse = await fetch('/api/admin/profile/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoUrl })
      })

      if (!updateResponse.ok) {
        throw new Error('Error al actualizar la foto de perfil')
      }

      setSuccess('Foto de perfil actualizada correctamente')
      onPhotoUpdated(photoUrl)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al actualizar la foto'
      )
    } finally {
      setUploading(false)
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemovePhoto = async () => {
    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/profile/photo', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la foto de perfil')
      }

      setSuccess('Foto de perfil eliminada correctamente')
      onPhotoUpdated('')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar la foto'
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
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

      <div className="flex items-center gap-6">
        {/* Foto actual */}
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
          {currentPhoto ? (
            <Image
              src={currentPhoto}
              alt="Foto de perfil"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <User className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded bg-gray-800 px-4 py-2.5 text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Subiendo...' : 'Subir Foto'}
          </button>

          {currentPhoto && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={uploading}
              className="flex items-center gap-2 rounded border border-gray-300 bg-slate-300 px-4 py-2.5 transition-colors hover:border-slate-300 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Eliminar Foto
            </button>
          )}

          <p className="text-xs text-gray-500">JPG, PNG o GIF. Máximo 5MB</p>
        </div>
      </div>
    </div>
  )
}

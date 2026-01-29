'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Upload, X, Monitor } from 'lucide-react'

interface LogoUploadProps {
  currentLogo: string | null
  currentWidth: number | null
  currentHeight: number | null
  onLogoUpdated: (logoUrl: string | null, width: number | null, height: number | null) => void
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  currentLogo,
  currentWidth,
  currentHeight,
  onLogoUpdated
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo)
  const [width, setWidth] = useState<number>(currentWidth || 150)
  const [height, setHeight] = useState<number>(currentHeight || 50)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreviewUrl(currentLogo)
    setWidth(currentWidth || 150)
    setHeight(currentHeight || 50)
  }, [currentLogo, currentWidth, currentHeight])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar los 2MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create preview and get original dimensions
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = document.createElement('img')
        img.onload = () => {
          const ratio = img.width / img.height
          setOriginalAspectRatio(ratio)
          // Set initial dimensions maintaining aspect ratio
          if (img.width > img.height) {
            setWidth(150)
            setHeight(Math.round(150 / ratio))
          } else {
            setHeight(50)
            setWidth(Math.round(50 * ratio))
          }
        }
        img.src = event.target?.result as string
        setPreviewUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/store-config/logo', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewUrl(data.logoUrl)
        // Save dimensions after upload
        await saveDimensions(data.logoUrl, width, height)
        onLogoUpdated(data.logoUrl, width, height)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al subir la imagen')
        setPreviewUrl(currentLogo)
      }
    } catch (err) {
      setError('Error al subir la imagen')
      setPreviewUrl(currentLogo)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const saveDimensions = async (logoUrl: string | null, w: number, h: number) => {
    try {
      await fetch('/api/admin/store-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl, logoWidth: w, logoHeight: h })
      })
    } catch (err) {
      console.error('Error saving dimensions:', err)
    }
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio && originalAspectRatio) {
      setHeight(Math.round(newWidth / originalAspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio && originalAspectRatio) {
      setWidth(Math.round(newHeight * originalAspectRatio))
    }
  }

  const handleSaveDimensions = async () => {
    if (previewUrl) {
      await saveDimensions(previewUrl, width, height)
      onLogoUpdated(previewUrl, width, height)
    }
  }

  const handleRemoveLogo = async () => {
    setIsUploading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/store-config/logo', {
        method: 'DELETE'
      })

      if (response.ok) {
        setPreviewUrl(null)
        setWidth(150)
        setHeight(50)
        setOriginalAspectRatio(null)
        onLogoUpdated(null, null, null)
      } else {
        setError('Error al eliminar el logo')
      }
    } catch (err) {
      setError('Error al eliminar el logo')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-6">
        {/* Preview */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
            style={{ width: Math.max(width, 100), height: Math.max(height, 50), minWidth: 100, minHeight: 50 }}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Logo de la tienda"
                width={width}
                height={height}
                className="object-contain"
                style={{ width, height }}
              />
            ) : (
              <Monitor className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <span className="text-xs text-gray-500">
            {width} x {height} px
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <label className="cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? 'Subiendo...' : 'Subir Logo'}
              </span>
            </label>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                disabled={isUploading}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                title="Eliminar logo"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Formatos: JPG, PNG, SVG. Máximo 2MB
          </p>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>

      {/* Dimension Controls */}
      {previewUrl && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-medium text-gray-700">Dimensiones del logo</h4>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs text-gray-600">Ancho (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                min={20}
                max={500}
                className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-gray-600">Alto (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                min={20}
                max={200}
                className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="rounded"
              />
              Mantener proporción
            </label>

            <button
              type="button"
              onClick={handleSaveDimensions}
              className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
            >
              Guardar dimensiones
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

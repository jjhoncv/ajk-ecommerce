'use client'
import React, { useEffect, useState } from 'react'
import { CardContent } from '@/module/shared/components/CardContent/CardContent'
import { StoreConfigForm } from './StoreConfigForm'
import { LogoUpload } from './LogoUpload'
import { type StoreConfig } from '@/module/shared/services/store-config'

export const StoreConfigView: React.FC = () => {
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/store-config')
      if (response.ok) {
        const data = await response.json()
        setConfig(
          data || {
            id: 1,
            storeName: '',
            storeDescription: null,
            logoUrl: null,
            logoWidth: 150,
            logoHeight: 50,
            address: null,
            businessHours: null,
            phone: null,
            email: null,
            instagramUrl: null,
            facebookUrl: null,
            twitterUrl: null,
            whatsappNumber: null
          }
        )
      } else {
        setError('Error al cargar la configuración')
      }
    } catch (err) {
      setError('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  if (loading) {
    return (
      <CardContent>
        <div className="flex items-center justify-center p-8">
          <div className="text-gray-500">Cargando configuración...</div>
        </div>
      </CardContent>
    )
  }

  if (error) {
    return (
      <CardContent>
        <div className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </CardContent>
    )
  }

  if (!config) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Logo */}
      <CardContent>
        <h2 className="mb-6 text-lg font-semibold">Logo de la Tienda</h2>
        <LogoUpload
          currentLogo={config.logoUrl}
          currentWidth={config.logoWidth}
          currentHeight={config.logoHeight}
          onLogoUpdated={(logoUrl, logoWidth, logoHeight) => {
            setConfig({ ...config, logoUrl, logoWidth, logoHeight })
          }}
        />
      </CardContent>

      {/* Información de la tienda */}
      <CardContent>
        <h2 className="mb-6 text-lg font-semibold">Información de la Tienda</h2>
        <StoreConfigForm
          config={config}
          onConfigUpdated={(updatedConfig) => {
            setConfig(updatedConfig)
          }}
        />
      </CardContent>
    </div>
  )
}

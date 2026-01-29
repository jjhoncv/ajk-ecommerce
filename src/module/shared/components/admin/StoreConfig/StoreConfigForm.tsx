'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { type StoreConfig } from '@/module/shared/services/store-config'

interface StoreConfigFormProps {
  config: StoreConfig
  onConfigUpdated: (config: StoreConfig) => void
}

interface FormData {
  storeName: string
  storeDescription: string
  address: string
  businessHours: string
  phone: string
  email: string
  instagramUrl: string
  facebookUrl: string
  twitterUrl: string
  whatsappNumber: string
}

export const StoreConfigForm: React.FC<StoreConfigFormProps> = ({
  config,
  onConfigUpdated
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    defaultValues: {
      storeName: config.storeName || '',
      storeDescription: config.storeDescription || '',
      address: config.address || '',
      businessHours: config.businessHours || '',
      phone: config.phone || '',
      email: config.email || '',
      instagramUrl: config.instagramUrl || '',
      facebookUrl: config.facebookUrl || '',
      twitterUrl: config.twitterUrl || '',
      whatsappNumber: config.whatsappNumber || ''
    }
  })

  const onSubmit = async (data: FormData) => {
    setIsSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/admin/store-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const updatedConfig = await response.json()
        onConfigUpdated(updatedConfig)
        setSuccessMessage('Configuración guardada correctamente')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage('Error al guardar la configuración')
      }
    } catch (error) {
      setErrorMessage('Error al guardar la configuración')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClasses =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
  const labelClasses = 'mb-1 block text-sm font-medium text-gray-700'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre de la tienda */}
        <div>
          <label className={labelClasses}>Nombre de la Tienda *</label>
          <input
            type="text"
            {...register('storeName', { required: 'El nombre es requerido' })}
            className={inputClasses}
            placeholder="Mi Tienda"
          />
          {errors.storeName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.storeName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses}>Email de Contacto</label>
          <input
            type="email"
            {...register('email')}
            className={inputClasses}
            placeholder="info@mitienda.com"
          />
        </div>

        {/* Descripcion */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Descripción</label>
          <textarea
            {...register('storeDescription')}
            className={inputClasses}
            rows={2}
            placeholder="Breve descripción de tu tienda"
          />
        </div>

        {/* Direccion */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Dirección</label>
          <input
            type="text"
            {...register('address')}
            className={inputClasses}
            placeholder="Av. Principal 123, Lima, Perú"
          />
        </div>

        {/* Horarios */}
        <div>
          <label className={labelClasses}>Horario de Atención</label>
          <input
            type="text"
            {...register('businessHours')}
            className={inputClasses}
            placeholder="Lun - Sab: 9:00 - 18:00"
          />
        </div>

        {/* Telefono */}
        <div>
          <label className={labelClasses}>Teléfono</label>
          <input
            type="text"
            {...register('phone')}
            className={inputClasses}
            placeholder="+51 1 234 5678"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 font-medium text-gray-900">Redes Sociales</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Instagram */}
          <div>
            <label className={labelClasses}>Instagram</label>
            <input
              type="url"
              {...register('instagramUrl')}
              className={inputClasses}
              placeholder="https://instagram.com/mitienda"
            />
          </div>

          {/* Facebook */}
          <div>
            <label className={labelClasses}>Facebook</label>
            <input
              type="url"
              {...register('facebookUrl')}
              className={inputClasses}
              placeholder="https://facebook.com/mitienda"
            />
          </div>

          {/* Twitter */}
          <div>
            <label className={labelClasses}>Twitter / X</label>
            <input
              type="url"
              {...register('twitterUrl')}
              className={inputClasses}
              placeholder="https://twitter.com/mitienda"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className={labelClasses}>WhatsApp</label>
            <input
              type="text"
              {...register('whatsappNumber')}
              className={inputClasses}
              placeholder="+51987654321"
            />
            <p className="mt-1 text-xs text-gray-500">
              Número con código de país, ej: +51987654321
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}

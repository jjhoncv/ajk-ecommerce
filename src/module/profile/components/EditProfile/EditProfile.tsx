'use client'

import { Button, Input, Label } from '@/module/shared/components/ui'
import { type Customers } from '@/types/domain'
import { CreditCard, Mail, Phone, Save, User } from 'lucide-react'
import { useEditProfile } from './use-edit-profile.hook'

interface EditProfileProps {
  customer: Customers
}

export default function EditProfile({ customer }: EditProfileProps) {
  const {
    formData,
    errors,
    isLoading,
    message,
    handleSubmit,
    handleInputChange,
    hasChanges,
    resetForm
  } = useEditProfile({ customer })

  return (
    <div>
      <div className="mb-8 flex items-center gap-2">
        <User className="h-5 w-5" />
        <h2 className="text-xl font-bold">Datos personales</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        {/* Nombre y Apellido */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              placeholder="Ingresa tu nombre"
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span className="h-1 w-1 rounded-full bg-red-600"></span>
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Apellido</Label>
            <Input
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleInputChange}
              className={`${errors.lastname ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              placeholder="Ingresa tu apellido"
            />
            {errors.lastname && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span className="h-1 w-1 rounded-full bg-red-600"></span>
                {errors.lastname}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <span className="h-1 w-1 rounded-full bg-red-600"></span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Teléfono y DNI */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Celular
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              placeholder="987654321"
              maxLength={9}
            />
            {errors.phone && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span className="h-1 w-1 rounded-full bg-red-600"></span>
                {errors.phone}
              </p>
            )}
            <p className="text-xs text-gray-500">
              9 dígitos, debe empezar con 9
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dni" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              DNI
            </Label>
            <Input
              id="dni"
              name="dni"
              type="text"
              value={formData.dni}
              onChange={handleInputChange}
              className={`${errors.dni ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              placeholder="12345678"
              maxLength={8}
            />
            {errors.dni && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span className="h-1 w-1 rounded-full bg-red-600"></span>
                {errors.dni}
              </p>
            )}
            <p className="text-xs text-gray-500">8 dígitos exactos</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-lg p-4 ${
              message.includes('Error') || message.includes('error')
                ? 'border border-red-200 bg-red-50 text-red-700'
                : message.includes('No hay cambios')
                  ? 'border border-yellow-200 bg-yellow-50 text-yellow-700'
                  : 'border border-green-200 bg-green-50 text-green-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  message.includes('Error') || message.includes('error')
                    ? 'bg-red-600'
                    : message.includes('No hay cambios')
                      ? 'bg-yellow-600'
                      : 'bg-green-600'
                }`}
              ></div>
              {message}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading || !hasChanges()}
            className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Guardando...
              </div>
            ) : (
              'Guardar Cambios'
            )}
          </Button>

          {hasChanges() && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isLoading}
              className="border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

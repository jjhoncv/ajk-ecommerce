'use client'

import { useChangePassword } from '@/components/account/ChangePassword/use-change-password.hook'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function ChangePassword() {
  const {
    formData,
    showPasswords,
    togglePasswordVisibility,
    errors,
    isLoading,
    message,
    handleSubmit,
    handleInputChange,
    getPasswordCriteriaStatus
  } = useChangePassword()

  return (
    <div>
      <div className="mb-8 flex items-center gap-2">
        <Lock className="h-5 w-5" />
        <h2 className="text-xl font-bold">Cambiar Contraseña</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Contraseña actual</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`${errors.currentPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              placeholder="Ingresa tu contraseña actual"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
            >
              {showPasswords.current ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <span className="h-1 w-1 rounded-full bg-red-600"></span>
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`${errors.newPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              placeholder="Ingresa tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <span className="h-1 w-1 rounded-full bg-red-600"></span>
              {errors.newPassword}
            </p>
          )}

          {/* Password Requirements */}
          <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Requisitos de la contraseña:
            </p>
            <div className="space-y-1">
              <div
                className={`flex items-center gap-2 text-xs ${getPasswordCriteriaStatus('length') ? 'text-green-600' : 'text-gray-500'}`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${getPasswordCriteriaStatus('length') ? 'bg-green-600' : 'bg-gray-300'}`}
                ></div>
                Al menos 8 caracteres
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${getPasswordCriteriaStatus('uppercase') ? 'text-green-600' : 'text-gray-500'}`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${getPasswordCriteriaStatus('uppercase') ? 'bg-green-600' : 'bg-gray-300'}`}
                ></div>
                Una letra mayúscula
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${getPasswordCriteriaStatus('lowercase') ? 'text-green-600' : 'text-gray-500'}`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${getPasswordCriteriaStatus('lowercase') ? 'bg-green-600' : 'bg-gray-300'}`}
                ></div>
                Una letra minúscula
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${getPasswordCriteriaStatus('number') ? 'text-green-600' : 'text-gray-500'}`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${getPasswordCriteriaStatus('number') ? 'bg-green-600' : 'bg-gray-300'}`}
                ></div>
                Un número
              </div>
              <div
                className={`flex items-center gap-2 text-xs ${getPasswordCriteriaStatus('special') ? 'text-green-600' : 'text-gray-500'}`}
              >
                <div
                  className={`h-1.5 w-1.5 rounded-full ${getPasswordCriteriaStatus('special') ? 'bg-green-600' : 'bg-gray-300'}`}
                ></div>
                Un carácter especial (!@#$%^&*)
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} focus:ring-2`}
              placeholder="Confirma tu nueva contraseña"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="flex items-center gap-1 text-sm text-red-600">
              <span className="h-1 w-1 rounded-full bg-red-600"></span>
              {errors.confirmPassword}
            </p>
          )}
          {formData.confirmPassword &&
            formData.newPassword === formData.confirmPassword && (
              <p className="flex items-center gap-1 text-sm text-green-600">
                <span className="h-1 w-1 rounded-full bg-green-600"></span>
                Las contraseñas coinciden
              </p>
            )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`rounded-lg p-4 ${
              message.includes('Error') || message.includes('error')
                ? 'border border-red-200 bg-red-50 text-red-700'
                : 'border border-green-200 bg-green-50 text-green-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${message.includes('Error') || message.includes('error') ? 'bg-red-600' : 'bg-green-600'}`}
              ></div>
              {message}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Cambiando Contraseña...
            </div>
          ) : (
            'Cambiar Contraseña'
          )}
        </Button>
      </form>
    </div>
  )
}

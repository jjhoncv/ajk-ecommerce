'use client'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { PasswordField } from '@/components/ui/PasswordField'
import { Loader2 } from 'lucide-react'
import { useRegisterCustomerForm } from './register-customer-form.hook'

interface RegisterCustomerFormProps {
  onSuccess?: () => void
  onClose?: () => void
  onSwitchToLogin?: () => void
}

const RegisterCustomerForm: React.FC<RegisterCustomerFormProps> = ({
  onSuccess,
  onClose,
  onSwitchToLogin
}) => {
  const {
    formData,
    errors,
    message,
    isLoading,
    showPasswords,
    getPasswordCriteriaStatus,
    togglePasswordVisibility,
    handleInputChange,
    handleSubmit
  } = useRegisterCustomerForm({ onSuccess, onClose })

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    await handleSubmit()
  }

  return (
    <div className="w-full">
      {message !== '' && (
        <div
          className={`mb-4 rounded-lg p-4 ${
            message.includes('Error')
              ? 'border border-red-200 bg-red-50 text-red-700'
              : 'border border-green-200 bg-green-50 text-green-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                message.includes('Error') ? 'bg-red-600' : 'bg-green-600'
              }`}
            ></div>
            {message}
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <InputField
          id="username"
          label="Nombre de usuario"
          value={formData.username}
          onChange={(e) => {
            handleInputChange('username', e.target.value)
          }}
          placeholder="juanperez"
          disabled={isLoading}
          error={errors.username}
        />

        <InputField
          id="name"
          label="Nombre"
          value={formData.name}
          onChange={(e) => {
            handleInputChange('name', e.target.value)
          }}
          placeholder="Juan"
          disabled={isLoading}
          error={errors.name}
        />

        <InputField
          id="lastname"
          label="Apellido"
          value={formData.lastname}
          onChange={(e) => {
            handleInputChange('lastname', e.target.value)
          }}
          placeholder="Pérez"
          disabled={isLoading}
          error={errors.lastname}
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => {
            handleInputChange('email', e.target.value)
          }}
          placeholder="usuario@ejemplo.com"
          disabled={isLoading}
          error={errors.email}
        />

        <PasswordField
          id="password"
          label="Contraseña"
          value={formData.password}
          onChange={(value) => {
            handleInputChange('password', value)
          }}
          showPassword={showPasswords.password}
          onToggleVisibility={() => {
            togglePasswordVisibility('password')
          }}
          error={errors.password}
          disabled={isLoading}
          showRequirements
          criteriaStatus={getPasswordCriteriaStatus}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={(value) => {
            handleInputChange('confirmPassword', value)
          }}
          showPassword={showPasswords.confirmPassword}
          onToggleVisibility={() => {
            togglePasswordVisibility('confirmPassword')
          }}
          error={errors.confirmPassword}
          disabled={isLoading}
          confirmField
          matchingPassword={formData.password}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Registrando...
            </div>
          ) : (
            'Crear cuenta'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  )
}

export default RegisterCustomerForm

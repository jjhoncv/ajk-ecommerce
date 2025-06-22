'use client'

import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { PasswordField } from '@/components/ui/PasswordField'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { LoginCustomerFormSocial } from './LoginCustomerFormSocial'
import { useLoginCustomerForm } from './use-login-customer-form.hook'

interface LoginCustomerFormProps {
  onSuccess?: () => void
  onClose?: () => void
  onSwitchToRegister?: () => void
  onGoogleLogin?: () => void
  onFacebookLogin?: () => void
}

const LoginCustomerForm: React.FC<LoginCustomerFormProps> = ({
  onSuccess,
  onClose,
  onSwitchToRegister,
  onGoogleLogin,
  onFacebookLogin
}) => {
  const {
    email,
    password,
    errors,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
    validateField
  } = useLoginCustomerForm({ onSuccess, onClose })

  const [showPassword, setShowPassword] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setEmail(value)
    validateField('email', value)
  }

  const handlePasswordChange = (value: string): void => {
    setPassword(value)
    validateField('password', value)
  }

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="w-full">
      {errors.form != null && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="usuario@ejemplo.com"
          error={errors.email}
          disabled={isLoading}
          required
          autoComplete="email"
        />

        <PasswordField
          id="password"
          label="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          showPassword={showPassword}
          onToggleVisibility={togglePasswordVisibility}
          error={errors.password}
          disabled={isLoading}
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              disabled={isLoading}
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="text-primary hover:text-primary/80">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        ¿No tienes una cuenta?{' '}
        <button
          onClick={onSwitchToRegister}
          className="font-medium text-primary hover:text-primary/80"
          disabled={isLoading}
        >
          Regístrate
        </button>
      </div>

      <LoginCustomerFormSocial
        onGoogleLogin={onGoogleLogin}
        onFacebookLogin={onFacebookLogin}
        isLoading={isLoading}
      />
    </div>
  )
}

export default LoginCustomerForm

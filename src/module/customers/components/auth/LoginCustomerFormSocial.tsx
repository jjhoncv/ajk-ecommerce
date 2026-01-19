'use client'

import { Button } from '@/module/shared/components/ui'
import { type JSX } from 'react'

interface LoginCustomerFormSocialProps {
  onGoogleLogin?: () => void
  onFacebookLogin?: () => void
  isLoading?: boolean
}

export const LoginCustomerFormSocial = ({
  onGoogleLogin,
  onFacebookLogin,
  isLoading = false
}: LoginCustomerFormSocialProps): JSX.Element => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">O continúa con</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={onGoogleLogin}
          disabled={isLoading}
          className="inline-flex w-full justify-center"
        >
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          onClick={onFacebookLogin}
          disabled={isLoading}
          className="inline-flex w-full justify-center"
        >
          <span>Facebook</span>
        </Button>
      </div>
    </div>
  )
}

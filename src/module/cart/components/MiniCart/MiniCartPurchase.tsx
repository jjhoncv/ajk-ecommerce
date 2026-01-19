'use client'

import { useAuthModal } from '@/module/customers/providers'
import { formatPrice } from '@/module/shared/helpers/utils'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface MiniCartPurchaseProps {
  totalPrice: number
  onClose: () => void
}

export const MiniCartPurchase: FC<MiniCartPurchaseProps> = ({
  totalPrice,
  onClose
}) => {
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()
  const router = useRouter()

  const handleContinue = () => {
    if (!session?.user) {
      // Si no está autenticado, mostrar modal de login
      openLogin({
        onLoginSuccess: () => {
          // Después del login exitoso, ir al checkout
          onClose()
          router.push('/checkout')
        }
        // Si cierra el modal, simplemente se queda en la página actual
      })
    } else {
      // Si está autenticado, ir directamente al checkout
      onClose()
      router.push('/checkout')
    }
  }

  return (
    <>
      <div>
        <div className="mb-2 flex justify-center">
          <span className="text-sm font-bold">
            {formatPrice(Number(totalPrice))}
          </span>
        </div>
        <button
          onClick={handleContinue}
          className="flex w-full justify-center bg-primary py-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Continuar
        </button>
        <Link
          href="/cart"
          className="mt-2 flex w-full justify-center border border-gray-300 py-1.5 text-[15px] font-semibold transition-colors hover:bg-gray-50"
        >
          Ir al carrito
        </Link>
      </div>
      <div className="border-b border-gray-200"></div>
    </>
  )
}

// 📄 app/checkout/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

// Models
import customerModel from '@/backend/customer'
import customerAddressModel from '@/backend/customer-address'
import paymentMethodModel from '@/backend/payment-method'

// Components
import CheckoutClient from '@/components/checkout/CheckoutClient'

// Types
import { authOptions } from '@/lib/auth/auth'
import { type CheckoutUser } from '@/types/checkout'

export default async function CheckoutPage() {
  // 1. Verificar autenticación
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/auth/login?redirect=/checkout')
  }

  // 2. Obtener datos del usuario
  const customer = await customerModel.getCustomerByEmail(session.user.email)

  if (!customer) {
    redirect('/auth/login?redirect=/checkout')
  }

  // 3. Obtener direcciones del cliente
  const addresses = await customerAddressModel.getAddressByCustomer(customer.id)

  // Si no tiene direcciones, redirigir a crear una
  if (!addresses || addresses.length === 0) {
    redirect('/profile/addresses/new?redirect=/checkout')
  }

  // 4. Obtener métodos de pago activos
  const paymentMethods = await paymentMethodModel.getPaymentMethods()

  // 5. Preparar datos del usuario para el cliente
  const checkoutUser: CheckoutUser = {
    id: customer.id,
    name: customer.name || '',
    lastname: customer.lastname,
    email: customer.email,
    phone: customer.phone,
    addresses,
    defaultAddressId: addresses.find((addr) => addr.isDefault === 1)?.id
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">
            Completa tu compra de forma segura
          </p>
        </div>

        <CheckoutClient
          user={checkoutUser}
          paymentMethods={paymentMethods || []}
        />
      </div>
    </main>
  )
}

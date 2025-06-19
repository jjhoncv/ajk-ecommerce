import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

// Importar modelos
import customerAddressModel from '@/backend/customer-address/CustomerAddress.model'
import paymentMethodModel from '@/backend/payment-method/PaymentMethod.model'
import shippingMethodModel from '@/backend/shipping-method/ShippingMethod.model'

export const metadata = {
  title: 'Checkout - Finalizar Compra | Tu Tienda',
  description: 'Completa tu compra de forma segura',
  robots: 'noindex, nofollow',
}

async function getCheckoutServerData(userId?: string) {
  if (!userId) {
    return {
      userAddresses: [],
      paymentMethods: [],
      shippingMethods: []
    }
  }

  try {
    const [userAddresses, paymentMethods, shippingMethods] = await Promise.all([
      customerAddressModel.getAddressByCustomer(parseInt(userId)),
      paymentMethodModel.getPaymentMethods(),
      shippingMethodModel.getShippingMethods()
    ])

    return {
      userAddresses: userAddresses || [],
      paymentMethods: paymentMethods || [],
      shippingMethods: shippingMethods || []
    }
  } catch (error) {
    console.error('Error loading checkout data:', error)
    return {
      userAddresses: [],
      paymentMethods: [],
      shippingMethods: []
    }
  }
}

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/checkout')
  }

  // Solo obtenemos datos del servidor (direcciones, métodos de pago, etc.)
  // El carrito se lee del localStorage en el cliente
  const serverData = await getCheckoutServerData(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutPage
        serverData={serverData}
        user={session.user}
      />
    </div>
  )
}
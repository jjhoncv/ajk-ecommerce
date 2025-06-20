'use client'

// 📄 app/checkout/CheckoutClient.tsx
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Types
import {
  CheckoutResponse,
  CheckoutState,
  CheckoutStep,
  CheckoutSummary,
  CheckoutUser,
  PaymentOption,
  ShippingOption
} from '@/types/checkout'
import { PaymentMethods } from '@/types/domain'

// Components
import { CartItem } from '@/hooks/useCart'
import CartSummary from './CartSummary'
import PaymentStep from './PaymentStep'
import ProcessingStep from './ProcessingStep'
import ReviewStep from './ReviewStep'
import ShippingStep from './ShippingStep'
import StepIndicator from './StepIndicator'

interface CheckoutClientProps {
  user: CheckoutUser
  paymentMethods: PaymentMethods[]
}

export default function CheckoutClient({ user, paymentMethods }: CheckoutClientProps) {
  const router = useRouter()

  const [state, setState] = useState<CheckoutState>({
    step: 'shipping',
    loading: false,
    data: {}
  })

  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [summary, setSummary] = useState<CheckoutSummary | null>(null)

  // Cargar items del carrito desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart) as CartItem[]
        setCartItems(items)

        if (items.length === 0) {
          router.push('/cart')
          return
        }

        // Obtener datos iniciales del checkout
        fetchCheckoutData(items)
      } catch (error) {
        console.error('Error parsing cart:', error)
        router.push('/cart')
      }
    } else {
      router.push('/cart')
    }
  }, [router])

  // Obtener datos del checkout desde la API
  const fetchCheckoutData = async (items: CartItem[], shippingAddressId?: number) => {
    setState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch('/api/checkout/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddressId: shippingAddressId || user.defaultAddressId
        })
      })

      if (!response.ok) {
        throw new Error('Error obteniendo datos del checkout')
      }

      const data = await response.json()
      setSummary(data.summary)

    } catch (error) {
      console.error('Error fetching checkout data:', error)
      setState(prev => ({
        ...prev,
        error: 'Error cargando datos del checkout'
      }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  // Manejar cambio de dirección de envío
  const handleShippingAddressChange = (addressId: number) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, shippingAddressId: addressId }
    }))

    fetchCheckoutData(cartItems, addressId)
  }

  // Manejar cambio de método de envío
  const handleShippingMethodChange = (option: ShippingOption) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        shippingMethodId: option.methodId,
        shippingMethodName: option.methodName
      }
    }))

    if (summary) {
      const updatedCalculation = {
        ...summary.calculation,
        shippingCost: option.cost,
        totalAmount: summary.calculation.subtotal - summary.calculation.discountAmount + option.cost + summary.calculation.taxAmount
      }

      setSummary({
        ...summary,
        calculation: updatedCalculation,
        selectedShipping: option
      })
    }
  }

  // Manejar cambio de método de pago
  const handlePaymentMethodChange = (option: PaymentOption) => {
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        paymentMethodId: option.methodId,
        paymentMethodCode: option.methodCode
      }
    }))

    if (summary) {
      setSummary({
        ...summary,
        selectedPayment: option
      })
    }
  }

  // Avanzar al siguiente paso
  const nextStep = () => {
    const steps: CheckoutStep[] = ['shipping', 'payment', 'review', 'processing']
    const currentIndex = steps.indexOf(state.step)

    if (currentIndex < steps.length - 1) {
      setState(prev => ({ ...prev, step: steps[currentIndex + 1] }))
    }
  }

  // Retroceder al paso anterior
  const prevStep = () => {
    const steps: CheckoutStep[] = ['shipping', 'payment', 'review', 'processing']
    const currentIndex = steps.indexOf(state.step)

    if (currentIndex > 0) {
      setState(prev => ({ ...prev, step: steps[currentIndex - 1] }))
    }
  }

  // Procesar el checkout
  const processCheckout = async () => {

    console.log("summary?.selectedShipping", summary?.selectedShipping)
    console.log("summary?.selectedPayment", summary?.selectedPayment)
    console.log("state.data.shippingAddressId", state.data.shippingAddressId)


    if (!summary?.selectedShipping || !summary?.selectedPayment || !state.data.shippingAddressId) {
      setState(prev => ({ ...prev, error: 'Faltan datos requeridos' }))
      return
    }

    setState(prev => ({ ...prev, step: 'processing', loading: true }))

    try {
      const checkoutData = {
        items: cartItems,
        shippingAddressId: state.data.shippingAddressId,
        paymentMethodId: summary.selectedPayment.methodId,
        paymentMethodCode: summary.selectedPayment.methodCode,
        shippingMethodId: summary.selectedShipping.methodId,
        shippingMethodName: summary.selectedShipping.methodName,
        couponCode: state.data.couponCode,
        customerNotes: state.data.customerNotes,
        paymentData: state.data.paymentData
      }

      console.log("checkoutData", checkoutData)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      })

      const result: CheckoutResponse = await response.json()

      console.log("result", result)

      if (result.success) {
        // Limpiar carrito
        localStorage.removeItem('cart')

        // Redirigir según el método de pago
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl
        } else {
          router.push(`/orders/${result.orderNumber}`)
        }
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Error procesando el checkout',
          step: 'review'
        }))
      }

    } catch (error) {
      console.error('Error processing checkout:', error)
      setState(prev => ({
        ...prev,
        error: 'Error procesando el checkout',
        step: 'review'
      }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna principal - Pasos del checkout */}
      <div className="lg:col-span-2">
        <StepIndicator currentStep={state.step} />

        {state.error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{state.error}</div>
          </div>
        )}

        {state.step === 'shipping' && summary && (
          <ShippingStep
            user={user}
            summary={summary}
            selectedAddressId={state.data.shippingAddressId}
            onAddressChange={handleShippingAddressChange}
            onShippingMethodChange={handleShippingMethodChange}
            onNext={nextStep}
            loading={state.loading}
          />
        )}

        {state.step === 'payment' && summary && (
          <PaymentStep
            paymentMethods={paymentMethods}
            paymentOptions={summary.paymentOptions}
            selectedPayment={summary.selectedPayment}
            onPaymentMethodChange={handlePaymentMethodChange}
            onNext={nextStep}
            onPrev={prevStep}
            loading={state.loading}
          />
        )}

        {state.step === 'review' && summary && (
          <ReviewStep
            user={user}
            summary={summary}
            checkoutData={state.data}
            onProcess={processCheckout}
            onPrev={prevStep}
            loading={state.loading}
          />
        )}

        {state.step === 'processing' && (
          <ProcessingStep />
        )}
      </div>

      {/* Columna lateral - Resumen del carrito */}
      <div className="lg:col-span-1">
        {summary && (
          <CartSummary
            items={cartItems}
            calculation={summary.calculation}
            selectedShipping={summary.selectedShipping}
            selectedPayment={summary.selectedPayment}
          />
        )}
      </div>
    </div>
  )
}
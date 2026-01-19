'use client'

// 📄 app/checkout/CheckoutClient.tsx
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Types
import {
  type CheckoutResponse,
  type CheckoutState,
  type CheckoutStep,
  type CheckoutSummary,
  type CheckoutUser,
  type PaymentOption,
  type ShippingOption
} from '@/types/checkout'
import { type PaymentMethods } from '@/types/domain'

// Components
import { type CartItem } from '@/module/cart/hooks/useCart/useCart'
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

export default function CheckoutClient({
  user,
  paymentMethods
}: CheckoutClientProps) {
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
  const fetchCheckoutData = async (
    items: CartItem[],
    shippingAddressId?: number,
    preserveSelections: boolean = false
  ) => {
    setState((prev) => ({ ...prev, loading: true }))

    try {
      // Usar la dirección proporcionada o la por defecto
      const addressId =
        shippingAddressId || user.defaultAddressId || user.addresses?.[0]?.id

      const response = await fetch('/api/checkout/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddressId: addressId
        })
      })

      if (!response.ok) {
        throw new Error('Error obteniendo datos del checkout')
      }

      const data = await response.json()

      // Preservar las selecciones existentes si se indica
      if (preserveSelections && summary) {
        setSummary({
          ...data.summary,
          selectedShipping: summary.selectedShipping,
          selectedPayment: summary.selectedPayment
        })
      } else {
        setSummary(data.summary)
      }

      // Guardar el shippingAddressId en el estado
      setState((prev) => ({
        ...prev,
        loading: false,
        data: { ...prev.data, shippingAddressId: addressId }
      }))
    } catch (error) {
      console.error('Error fetching checkout data:', error)
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Error cargando datos del checkout'
      }))
    }
  }

  // Manejar cambio de dirección de envío
  const handleShippingAddressChange = (addressId: number) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, shippingAddressId: addressId }
    }))

    fetchCheckoutData(cartItems, addressId)
  }

  // Manejar cambio de método de envío
  const handleShippingMethodChange = (option: ShippingOption) => {
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        shippingMethodId: option.methodId,
        shippingMethodName: option.methodName
      }
    }))

    if (summary) {
      const subtotal = Number(summary.calculation.subtotal) || 0
      const discountAmount = Number(summary.calculation.discountAmount) || 0
      const shippingCost = Number(option.cost) || 0
      // Mantener la comisión de pago existente si ya se seleccionó un método
      const processingFee = Number(summary.selectedPayment?.processingFee) || 0

      // Recalcular IGV (18%) sobre subtotal - descuento + envío (sin incluir comisión)
      const taxAmount = (subtotal - discountAmount + shippingCost) * 0.18
      // Total = subtotal - descuento + envío + IGV + comisión de pago
      const totalAmount =
        subtotal - discountAmount + shippingCost + taxAmount + processingFee

      const updatedCalculation = {
        ...summary.calculation,
        shippingCost,
        taxAmount,
        totalAmount
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
    setState((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        paymentMethodId: option.methodId,
        paymentMethodCode: option.methodCode
      }
    }))

    if (summary) {
      const subtotal = Number(summary.calculation.subtotal) || 0
      const discountAmount = Number(summary.calculation.discountAmount) || 0
      const shippingCost = Number(summary.calculation.shippingCost) || 0
      const processingFee = Number(option.processingFee) || 0

      // Recalcular IGV (18%) sobre subtotal - descuento + envío (sin incluir comisión de pago)
      const taxAmount = (subtotal - discountAmount + shippingCost) * 0.18
      // Total = subtotal - descuento + envío + IGV + comisión de pago
      const totalAmount =
        subtotal - discountAmount + shippingCost + taxAmount + processingFee

      const updatedCalculation = {
        ...summary.calculation,
        processingFee,
        taxAmount,
        totalAmount
      }

      setSummary({
        ...summary,
        calculation: updatedCalculation,
        selectedPayment: option
      })
    }
  }

  // Manejar aplicación de cupón
  const handleApplyCoupon = async (
    couponCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!summary) return { success: false, error: 'Error interno' }

    try {
      const response = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode,
          totalAmount: summary.calculation.subtotal
        })
      })

      const result = await response.json()

      if (!result.isValid) {
        return { success: false, error: result.error || 'Cupón no válido' }
      }

      // Actualizar el estado con el código del cupón
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, couponCode }
      }))

      // Recalcular totales con el descuento
      const subtotal = Number(summary.calculation.subtotal) || 0
      const discountAmount = Number(result.discountAmount) || 0
      const shippingCost = Number(summary.calculation.shippingCost) || 0
      const processingFee = Number(summary.selectedPayment?.processingFee) || 0

      // Recalcular IGV (18%) sobre subtotal - descuento + envío
      const taxAmount = (subtotal - discountAmount + shippingCost) * 0.18
      // Total = subtotal - descuento + envío + IGV + comisión de pago
      const totalAmount =
        subtotal - discountAmount + shippingCost + taxAmount + processingFee

      setSummary({
        ...summary,
        calculation: {
          ...summary.calculation,
          discountAmount,
          taxAmount,
          totalAmount
        },
        appliedCoupon: {
          code: couponCode,
          discountAmount
        }
      })

      return { success: true }
    } catch (error) {
      console.error('Error applying coupon:', error)
      return { success: false, error: 'Error al validar el cupón' }
    }
  }

  // Remover cupón aplicado
  const handleRemoveCoupon = () => {
    if (!summary) return

    // Quitar el cupón del estado
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, couponCode: undefined }
    }))

    // Recalcular totales sin el descuento
    const subtotal = Number(summary.calculation.subtotal) || 0
    const shippingCost = Number(summary.calculation.shippingCost) || 0
    const processingFee = Number(summary.selectedPayment?.processingFee) || 0

    // Recalcular IGV (18%) sobre subtotal + envío (sin descuento)
    const taxAmount = (subtotal + shippingCost) * 0.18
    // Total = subtotal + envío + IGV + comisión de pago
    const totalAmount = subtotal + shippingCost + taxAmount + processingFee

    setSummary({
      ...summary,
      calculation: {
        ...summary.calculation,
        discountAmount: 0,
        taxAmount,
        totalAmount
      },
      appliedCoupon: undefined
    })
  }

  // Avanzar al siguiente paso
  const nextStep = () => {
    const steps: CheckoutStep[] = [
      'shipping',
      'payment',
      'review',
      'processing'
    ]
    const currentIndex = steps.indexOf(state.step)

    if (currentIndex < steps.length - 1) {
      setState((prev) => ({ ...prev, step: steps[currentIndex + 1] }))
    }
  }

  // Retroceder al paso anterior
  const prevStep = () => {
    const steps: CheckoutStep[] = [
      'shipping',
      'payment',
      'review',
      'processing'
    ]
    const currentIndex = steps.indexOf(state.step)

    if (currentIndex > 0) {
      setState((prev) => ({ ...prev, step: steps[currentIndex - 1] }))
    }
  }

  // Procesar el checkout
  const processCheckout = async () => {
    console.log('processCheckout - Validating data:')
    console.log('  selectedShipping:', summary?.selectedShipping)
    console.log('  selectedPayment:', summary?.selectedPayment)
    console.log('  shippingAddressId:', state.data.shippingAddressId)

    // Validación con mensajes específicos
    if (!state.data.shippingAddressId) {
      setState((prev) => ({
        ...prev,
        error: 'Falta seleccionar una dirección de envío'
      }))
      return
    }

    if (!summary?.selectedShipping) {
      setState((prev) => ({
        ...prev,
        error: 'Falta seleccionar un método de envío'
      }))
      return
    }

    if (!summary?.selectedPayment) {
      setState((prev) => ({
        ...prev,
        error: 'Falta seleccionar un método de pago'
      }))
      return
    }

    setState((prev) => ({ ...prev, step: 'processing', loading: true }))

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

      console.log('checkoutData', checkoutData)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      })

      const result: CheckoutResponse = await response.json()

      console.log('result', result)

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
        setState((prev) => ({
          ...prev,
          error: result.error || 'Error procesando el checkout',
          step: 'review'
        }))
      }
    } catch (error) {
      console.error('Error processing checkout:', error)
      setState((prev) => ({
        ...prev,
        error: 'Error procesando el checkout',
        step: 'review'
      }))
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            loading={state.loading}
          />
        )}

        {state.step === 'processing' && <ProcessingStep />}
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

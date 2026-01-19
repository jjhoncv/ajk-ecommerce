// 📄 components/payment/PaymentPage.tsx
'use client'

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Usar tipos del dominio
import {
  type Customers,
  type CustomersAddresses,
  type OrderItems,
  type Orders,
  type PaymentMethods,
  type PaymentTransactions
} from '@/types/domain'

interface PaymentPageData {
  transaction: PaymentTransactions
  order: Orders
  orderItems: OrderItems[]
  customer: Customers
  shippingAddress: CustomersAddresses
  paymentMethod: PaymentMethods
}

interface PaymentPageClientProps {
  transactionId: string
}

// Componentes Sandbox específicos por método de pago
interface SandboxProps {
  onPaymentAction: (action: 'approve' | 'reject', reason?: string) => void
  processing: boolean
  amount: number
  paymentMethod?: string
}

const BankTransferSandbox = ({
  onPaymentAction,
  processing,
  amount
}: SandboxProps) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
      <h5 className="mb-2 font-medium text-blue-800">
        🏦 Transferencia Bancaria
      </h5>
      <p className="mb-2 text-sm text-blue-700">
        Simula el resultado de una transferencia por S/{' '}
        {Number(amount).toFixed(2)}
      </p>
      <div className="space-y-1 text-xs text-blue-600">
        <p>• Cuenta: 123-456789-001</p>
        <p>• CCI: 00312345678900112345</p>
        <p>• Banco: BCP</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button
        onClick={() => { onPaymentAction('approve') }}
        disabled={processing}
        className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        ✅ Transferencia Exitosa
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Fondos insuficientes') }}
        disabled={processing}
        className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
      >
        ❌ Fondos Insuficientes
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Datos incorrectos') }}
        disabled={processing}
        className="rounded bg-orange-600 px-3 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
      >
        ⚠️ Datos Incorrectos
      </button>
    </div>
  </div>
)

const CardSandbox = ({ onPaymentAction, processing, amount }: SandboxProps) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
      <h5 className="mb-2 font-medium text-purple-800">
        💳 Tarjeta de Crédito/Débito
      </h5>
      <p className="mb-2 text-sm text-purple-700">
        Simula el resultado del pago con tarjeta por S/ {amount.toFixed(2)}
      </p>
      <div className="space-y-1 text-xs text-purple-600">
        <p>• Tarjeta: **** **** **** 1234</p>
        <p>• Vencimiento: 12/25</p>
        <p>• CVV: ***</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
      <button
        onClick={() => { onPaymentAction('approve') }}
        disabled={processing}
        className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        ✅ Aprobado
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Tarjeta rechazada') }}
        disabled={processing}
        className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
      >
        ❌ Rechazada
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Tarjeta expirada') }}
        disabled={processing}
        className="rounded bg-orange-600 px-3 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
      >
        ⏰ Expirada
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'CVV incorrecto') }}
        disabled={processing}
        className="rounded bg-yellow-600 px-3 py-2 text-sm text-white hover:bg-yellow-700 disabled:opacity-50"
      >
        🔒 CVV Error
      </button>
    </div>
  </div>
)

const YapeSandbox = ({ onPaymentAction, processing, amount }: SandboxProps) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
      <h5 className="mb-2 font-medium text-purple-800">📱 Yape</h5>
      <p className="mb-2 text-sm text-purple-700">
        Simula el resultado del pago con Yape por S/ {amount.toFixed(2)}
      </p>
      <div className="space-y-1 text-xs text-purple-600">
        <p>• Número: 999 999 999</p>
        <p>• QR Code generado</p>
        <p>• Código de transacción: YP123456</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button
        onClick={() => { onPaymentAction('approve') }}
        disabled={processing}
        className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        ✅ Yape Exitoso
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Usuario canceló') }}
        disabled={processing}
        className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
      >
        ❌ Usuario Canceló
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Límite diario excedido') }}
        disabled={processing}
        className="rounded bg-orange-600 px-3 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
      >
        ⚠️ Límite Excedido
      </button>
    </div>
  </div>
)

const PlinSandbox = ({ onPaymentAction, processing, amount }: SandboxProps) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
      <h5 className="mb-2 font-medium text-green-800">📲 Plin</h5>
      <p className="mb-2 text-sm text-green-700">
        Simula el resultado del pago con Plin por S/ {amount.toFixed(2)}
      </p>
      <div className="space-y-1 text-xs text-green-600">
        <p>• Número: 999 999 999</p>
        <p>• Banco origen: BCP</p>
        <p>• Código de operación: PL789012</p>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <button
        onClick={() => { onPaymentAction('approve') }}
        disabled={processing}
        className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        ✅ Plin Exitoso
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Cuenta no encontrada') }}
        disabled={processing}
        className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
      >
        ❌ Cuenta No Encontrada
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Servicio no disponible') }}
        disabled={processing}
        className="rounded bg-orange-600 px-3 py-2 text-sm text-white hover:bg-orange-700 disabled:opacity-50"
      >
        ⚠️ Servicio No Disponible
      </button>
    </div>
  </div>
)

const GenericSandbox = ({
  onPaymentAction,
  processing,
  amount,
  paymentMethod
}: SandboxProps) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <h5 className="mb-2 font-medium text-gray-800">💰 {paymentMethod}</h5>
      <p className="mb-2 text-sm text-gray-700">
        Simula el resultado del pago por S/ {Number(amount).toFixed(2)}
      </p>
    </div>

    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <button
        onClick={() => { onPaymentAction('approve') }}
        disabled={processing}
        className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
      >
        ✅ Pago Exitoso
      </button>
      <button
        onClick={() => { onPaymentAction('reject', 'Pago rechazado') }}
        disabled={processing}
        className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
      >
        ❌ Pago Rechazado
      </button>
    </div>
  </div>
)

export const PaymentPage = ({ transactionId }: PaymentPageClientProps) => {
  const router = useRouter()

  const [data, setData] = useState<PaymentPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<
    'pending' | 'processing' | 'completed' | 'failed'
  >('pending')

  // Cargar datos de pago
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(`/api/payment/${transactionId}`)

        if (!response.ok) {
          throw new Error('Transaction not found')
        }

        const paymentData = await response.json()
        setData(paymentData)

        // Iniciar countdown si hay expiración
        if (paymentData.transaction.expiresAt) {
          const expiryTime = new Date(
            paymentData.transaction.expiresAt
          ).getTime()
          const updateCountdown = () => {
            const now = new Date().getTime()
            const timeLeft = Math.max(0, Math.floor((expiryTime - now) / 1000))
            setCountdown(timeLeft)

            if (timeLeft === 0) {
              setError('La transacción ha expirado')
            }
          }

          updateCountdown()
          const interval = setInterval(updateCountdown, 1000)
          return () => { clearInterval(interval) }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error loading payment data'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentData()
  }, [transactionId])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Función auxiliar para obtener el nombre del gateway
  const getGatewayName = (code: string): string => {
    const gateways = {
      bank_transfer: 'Manual Transfer System',
      card: 'Visa/Mastercard Gateway',
      yape: 'Yape API',
      plin: 'Plin Gateway',
      default: 'Payment Gateway'
    }
    return gateways[code as keyof typeof gateways] || gateways.default
  }

  // Función auxiliar para obtener códigos de error específicos
  const getErrorCode = (reason?: string): string => {
    const errorCodes = {
      'Fondos insuficientes': 'INSUFFICIENT_FUNDS',
      'Datos incorrectos': 'INVALID_DATA',
      'Tarjeta rechazada': 'CARD_DECLINED',
      'Tarjeta expirada': 'CARD_EXPIRED',
      'CVV incorrecto': 'INVALID_CVV',
      'Usuario canceló': 'USER_CANCELLED',
      'Límite diario excedido': 'DAILY_LIMIT_EXCEEDED',
      'Cuenta no encontrada': 'ACCOUNT_NOT_FOUND',
      'Servicio no disponible': 'SERVICE_UNAVAILABLE',
      'Pago rechazado': 'PAYMENT_DECLINED'
    }
    return errorCodes[reason as keyof typeof errorCodes] || 'UNKNOWN_ERROR'
  }

  const handlePayment = async (
    action: 'approve' | 'reject',
    reason?: string
  ) => {
    if (!data) return

    setProcessing(true)
    setPaymentStatus('processing')

    try {
      // Simular delay realista según el método de pago
      const delays = {
        bank_transfer: 2000,
        card: 3000,
        yape: 1500,
        plin: 1500,
        default: 2000
      }

      const delay =
        delays[data.paymentMethod.code as keyof typeof delays] || delays.default
      await new Promise((resolve) => setTimeout(resolve, delay))

      const endpoint =
        action === 'approve'
          ? `/api/payment/${transactionId}/complete`
          : `/api/payment/${transactionId}/fail`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          gatewayResponse: {
            approved: action === 'approve',
            authCode:
              action === 'approve'
                ? `AUTH_${Math.random().toString(36).substr(2, 9)}`
                : null,
            reason:
              reason ||
              (action === 'reject' ? 'Payment rejected by user' : null),
            processedAt: new Date().toISOString(),
            method: data.paymentMethod.code,
            gateway: getGatewayName(data.paymentMethod.code),
            errorCode: action === 'reject' ? getErrorCode(reason) : null
          }
        })
      })

      if (!response.ok) {
        throw new Error('Error processing payment')
      }

      const result = await response.json()

      if (action === 'approve') {
        setPaymentStatus('completed')

        // Actualizar estado local
        setData((prev) =>
          prev
            ? {
                ...prev,
                transaction: { ...prev.transaction, status: 'completed' },
                order: { ...prev.order, paymentStatus: 'paid' }
              }
            : null
        )

        // Redirigir a confirmación después de 3 segundos
        setTimeout(() => {
          router.push(`/order/${data.order.orderNumber}/confirmation`)
        }, 3000)
      } else {
        setPaymentStatus('failed')

        setData((prev) =>
          prev
            ? {
                ...prev,
                transaction: { ...prev.transaction, status: 'failed' },
                order: { ...prev.order, paymentStatus: 'failed' }
              }
            : null
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing payment')
      setPaymentStatus('failed')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Transacción no encontrada'}
          </h2>
          <p className="mt-2 text-gray-600">
            {error === 'Transaction not found'
              ? 'La transacción solicitada no existe o ha expirado.'
              : 'Ocurrió un error al cargar los datos de pago.'}
          </p>
          <button
            onClick={() => { router.push('/') }}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  const {
    transaction,
    order,
    orderItems,
    customer,
    shippingAddress,
    paymentMethod
  } = data

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => { router.back() }}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Completa tu Pago</h1>
        <p className="text-gray-600">Confirma tu pedido #{order.orderNumber}</p>
      </div>

      {/* Status Alerts */}
      {paymentStatus === 'processing' && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center">
            <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <div>
              <h3 className="font-semibold text-blue-800">
                Procesando Pago...
              </h3>
              <p className="text-blue-700">
                Tu pago está siendo procesado con {data.paymentMethod.name}. Por
                favor espera.
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'completed' && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center">
            <CheckCircle className="mr-3 h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">
                ¡Pago Completado!
              </h3>
              <p className="text-green-700">
                Tu pedido ha sido confirmado. Serás redirigido en breve...
              </p>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center">
            <AlertCircle className="mr-3 h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Pago Rechazado</h3>
              <p className="text-red-700">
                El pago no pudo ser procesado. Por favor, intenta nuevamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Payment Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Payment Method Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-semibold text-gray-900">
                <CreditCard className="mr-2 h-5 w-5" />
                Método de Pago
              </h2>
              {countdown !== null && countdown > 0 && (
                <div className="flex items-center text-orange-600">
                  <Clock className="mr-1 h-4 w-4" />
                  <span className="font-mono text-sm">
                    {formatTime(countdown)}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-6 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {paymentMethod.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {paymentMethod.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Ref: {transaction.referenceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    S/ {Number(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {transaction.currency}
                  </p>
                  {transaction.processingFee &&
                    transaction.processingFee > 0 && (
                      <p className="text-xs text-gray-500">
                        + S/ {Number(transaction.processingFee).toFixed(2)}{' '}
                        comisión
                      </p>
                    )}
                </div>
              </div>
            </div>

            {/* Estado de procesamiento durante transacción */}
            {processing && (
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center justify-center">
                  <div className="mr-3 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <div className="text-center">
                    <h4 className="font-medium text-blue-800">
                      Procesando con {paymentMethod.name}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {paymentMethod.code === 'bank_transfer' &&
                        'Verificando transferencia bancaria...'}
                      {paymentMethod.code === 'card' &&
                        'Validando tarjeta con el banco...'}
                      {paymentMethod.code === 'yape' &&
                        'Conectando con Yape...'}
                      {paymentMethod.code === 'plin' &&
                        'Procesando con Plin...'}
                      {!['bank_transfer', 'card', 'yape', 'plin'].includes(
                        paymentMethod.code
                      ) && 'Procesando pago...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sandbox Payment Simulation */}
            {transaction.status === 'pending' && !processing && (
              <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h4 className="mb-2 font-medium text-yellow-800">
                  🧪 Sandbox de Pagos
                </h4>
                <p className="mb-4 text-sm text-yellow-700">
                  Simula diferentes estados de pago para{' '}
                  <strong>{paymentMethod.name}</strong>
                </p>

                {/* Simulaciones específicas por método de pago */}
                {paymentMethod.code === 'bank_transfer' && (
                  <BankTransferSandbox
                    onPaymentAction={handlePayment}
                    processing={processing}
                    amount={transaction.amount}
                  />
                )}

                {paymentMethod.code === 'card' && (
                  <CardSandbox
                    onPaymentAction={handlePayment}
                    processing={processing}
                    amount={transaction.amount}
                  />
                )}

                {paymentMethod.code === 'yape' && (
                  <YapeSandbox
                    onPaymentAction={handlePayment}
                    processing={processing}
                    amount={transaction.amount}
                  />
                )}

                {paymentMethod.code === 'plin' && (
                  <PlinSandbox
                    onPaymentAction={handlePayment}
                    processing={processing}
                    amount={transaction.amount}
                  />
                )}

                {/* Método genérico para otros tipos */}
                {!['bank_transfer', 'card', 'yape', 'plin'].includes(
                  paymentMethod.code
                ) && (
                  <GenericSandbox
                    onPaymentAction={handlePayment}
                    processing={processing}
                    amount={transaction.amount}
                    paymentMethod={paymentMethod.name}
                  />
                )}
              </div>
            )}

            {/* Payment Details */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>S/ {order.subtotal.toFixed(2)}</span>
              </div>

              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>-S/ {order.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Envío:</span>
                <span>S/ {(order.shippingCost || 0).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">IGV (18%):</span>
                <span>S/ {(order.taxAmount || 0).toFixed(2)}</span>
              </div>

              {transaction.processingFee && transaction.processingFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Comisión de procesamiento:</span>
                  <span>S/ {Number(transaction.processingFee).toFixed(2)}</span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total a pagar:</span>
                  <span>S/ {Number(transaction.amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <User className="mr-2 h-5 w-5" />
              Información del Cliente
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-medium">
                  {customer.name || ''} {customer.lastname}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">DNI</p>
                <p className="font-medium">{customer.dni}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <MapPin className="mr-2 h-5 w-5" />
              Dirección de Envío
            </h3>

            <div className="space-y-2">
              <p className="font-medium">{shippingAddress.alias}</p>
              <p className="text-gray-700">
                {shippingAddress.streetName} {shippingAddress.streetNumber}
                {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
              </p>
              <p className="text-gray-700">
                {shippingAddress.district}, {shippingAddress.province}
              </p>
              <p className="text-gray-700">{shippingAddress.department}</p>
              <p className="text-sm text-gray-600">
                Método de envío: {order.shippingMethod || 'No especificado'}
              </p>
              <p className="text-sm text-gray-600">
                Entrega estimada:{' '}
                {order.estimatedDelivery
                  ? new Date(order.estimatedDelivery).toLocaleDateString(
                      'es-PE'
                    )
                  : 'Por determinar'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

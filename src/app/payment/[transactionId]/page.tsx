// 📄 app/payment/[transactionId]/page.tsx (SERVER COMPONENT)
import { PaymentPage as PaymentPageClient } from '@/components/payment/PaymentPage'
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Pago Seguro',
  description: 'Completa tu pago'
}

export default function PaymentPage({
  params
}: {
  params: { transactionId: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del servidor */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Pago Seguro 🔒</h1>
        </div>
      </header>

      {/* Client Component con toda la lógica */}
      <PaymentPageClient transactionId={params.transactionId} />
    </div>
  )
}

'use client'

import { ArrowLeft, ClipboardList, Download, Package, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ActionButtonsProps {
  orderNumber: string
}

export default function ActionButtons({ orderNumber }: ActionButtonsProps) {
  const router = useRouter()

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Pedido ${orderNumber}`,
          text: `¡Mi pedido ha sido confirmado! Número: ${orderNumber}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  return (
    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
      <button
        onClick={() => { router.push('/') }}
        className="flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Seguir Comprando
      </button>

      <button
        onClick={() => { router.push(`/order/${orderNumber}/track`) }}
        className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        <Package className="mr-2 h-4 w-4" />
        Rastrear Pedido
      </button>

      <button
        onClick={() => { router.push('/account/orders') }}
        className="flex items-center justify-center rounded-lg border border-blue-600 px-6 py-3 text-blue-600 hover:bg-blue-50"
      >
        <ClipboardList className="mr-2 h-4 w-4" />
        Ver mis Pedidos
      </button>

      <button
        onClick={handleShare}
        className="flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Compartir
      </button>

      <button
        onClick={() => { window.print() }}
        className="flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
      >
        <Download className="mr-2 h-4 w-4" />
        Imprimir
      </button>
    </div>
  )
}

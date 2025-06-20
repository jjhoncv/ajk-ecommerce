'use client'

import { ArrowLeft, Download, Package, Share2 } from 'lucide-react'
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
    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => router.push('/')}
        className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Seguir Comprando
      </button>

      <button
        onClick={() => router.push(`/order/${orderNumber}/track`)}
        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Package className="h-4 w-4 mr-2" />
        Rastrear Pedido
      </button>

      <button
        onClick={handleShare}
        className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Compartir
      </button>

      <button
        onClick={() => window.print()}
        className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
      >
        <Download className="h-4 w-4 mr-2" />
        Imprimir
      </button>
    </div>
  )
}
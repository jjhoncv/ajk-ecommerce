// 📄 app/order/[orderNumber]/confirmation/BackButton.tsx
'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Volver
    </button>
  )
}
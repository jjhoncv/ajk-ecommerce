// 📄 app/order/[orderNumber]/confirmation/BackButton.tsx
'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => { router.back() }}
      className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Volver
    </button>
  )
}

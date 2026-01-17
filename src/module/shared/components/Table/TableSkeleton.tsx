import { Loader2 } from 'lucide-react'
import { type JSX } from 'react'

export function TableSkeleton(): JSX.Element {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  )
}

export function CardsSkeleton(): JSX.Element {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  )
}

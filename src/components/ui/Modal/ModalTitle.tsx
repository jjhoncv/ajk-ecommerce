import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { type FC, type ReactNode } from 'react'

interface ModalTitleProps {
  onClose: () => void
  title?: string
  className?: string
  children?: ReactNode
}

export const ModalTitle: FC<ModalTitleProps> = ({
  onClose,
  title,
  className,
  children
}) => {
  return (
    <div className={cn('border-b border-gray-200 p-4', className)}>
      <div className="flex items-center justify-between">
        {children || <h2 className="text-xl font-bold">{title}</h2>}
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

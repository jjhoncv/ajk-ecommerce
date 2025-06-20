import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export const ModalContent = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  return <div className={cn('p-4', className)}>{children}</div>
}

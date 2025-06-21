import { cn } from '@/lib/utils'
import { type FC, type ReactNode } from 'react'

interface LayoutContentProps {
  children: ReactNode
  className?: string
}
export const LayoutContent: FC<LayoutContentProps> = ({
  children,
  className
}) => {
  return (
    <div
      className="min-h-screen bg-white transition-all duration-300 ease-in-out"
      id="content-page"
    >
      <div className={cn('px-12 py-4', className)}>{children}</div>
    </div>
  )
}

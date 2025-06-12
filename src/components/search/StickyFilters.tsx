'use client'
import { useStickyFilters } from '@/hooks/useStickyFilters'
import { FC, ReactNode } from 'react'

interface StickyFiltersProps {
  children: ReactNode
}

const StickyFilters: FC<StickyFiltersProps> = ({ children }) => {
  const { topPosition, maxHeight, minHeight, bottomConstraint } = useStickyFilters()

  return (
    <div
      className="sticky left-12 w-56 overflow-y-auto z-10"
      style={{
        top: topPosition,
        maxHeight: maxHeight,
        minHeight: minHeight,
        bottom: bottomConstraint
      }}
    >
      {children}
    </div>
  )
}

export default StickyFilters

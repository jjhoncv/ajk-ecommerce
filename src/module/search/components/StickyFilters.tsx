'use client'
import { useStickyFilters } from '@/module/search/hooks/useStickyFilters'
import { type FC, type ReactNode } from 'react'

interface StickyFiltersProps {
  children: ReactNode
}

const StickyFilters: FC<StickyFiltersProps> = ({ children }) => {
  const { topPosition, maxHeight, minHeight, bottomConstraint } =
    useStickyFilters()

  return (
    <div
      className="sticky left-12 z-10 w-56 overflow-y-auto"
      style={{
        top: topPosition,
        maxHeight,
        minHeight,
        bottom: bottomConstraint
      }}
    >
      {children}
    </div>
  )
}

export default StickyFilters

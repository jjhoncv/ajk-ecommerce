'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  className?: string
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = 'mb-6'
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className={className}>
      <div
        className="flex cursor-pointer items-center justify-between py-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="font-bold">{title}</h4>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      {isExpanded && <div className="pb-7">{children}</div>}
      <div className="border-b border-gray-200"></div>
    </div>
  )
}

export default CollapsibleSection

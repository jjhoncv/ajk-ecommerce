'use client'

import { useVariantTags } from '@/module/tags/hooks/useVariantTags'
import { TagBadges } from './TagBadges'
import { type FC } from 'react'

interface VariantTagBadgesProps {
  variantId: number
  size?: 'sm' | 'md' | 'lg'
  maxDisplay?: number
  className?: string
}

/**
 * Client component that fetches and displays tags for a variant
 * Uses the useVariantTags hook to fetch tags dynamically
 */
export const VariantTagBadges: FC<VariantTagBadgesProps> = ({
  variantId,
  size = 'md',
  maxDisplay = 5,
  className = ''
}) => {
  const { tags, isLoading } = useVariantTags(variantId)

  if (isLoading) {
    return (
      <div className="flex gap-1">
        <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <TagBadges
      tags={tags}
      size={size}
      maxDisplay={maxDisplay}
      className={className}
    />
  )
}

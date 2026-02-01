import { type Tags as Tag } from '@/types/domain'
import { type FC } from 'react'

interface TagBadgesProps {
  tags: Tag[]
  size?: 'sm' | 'md' | 'lg'
  maxDisplay?: number
  className?: string
}

/**
 * Component to display tag badges
 * Used in ProductCard and ProductDetail pages
 */
export const TagBadges: FC<TagBadgesProps> = ({
  tags,
  size = 'sm',
  maxDisplay = 3,
  className = ''
}) => {
  if (!tags || tags.length === 0) {
    return null
  }

  const displayTags = tags.slice(0, maxDisplay)
  const remainingCount = tags.length - maxDisplay

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayTags.map((tag) => (
        <span
          key={tag.id}
          className={`
            rounded font-medium text-white shadow-sm
            ${sizeClasses[size]}
          `}
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className={`
            rounded bg-gray-200 text-gray-600 font-medium
            ${sizeClasses[size]}
          `}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  )
}

/**
 * Positioned badges for ProductCard (absolute positioning)
 */
interface ProductCardTagBadgesProps {
  tags: Tag[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

export const ProductCardTagBadges: FC<ProductCardTagBadgesProps> = ({
  tags,
  position = 'top-left'
}) => {
  if (!tags || tags.length === 0) {
    return null
  }

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  }

  return (
    <div className={`absolute ${positionClasses[position]} z-10`}>
      <TagBadges tags={tags} size="sm" maxDisplay={2} />
    </div>
  )
}

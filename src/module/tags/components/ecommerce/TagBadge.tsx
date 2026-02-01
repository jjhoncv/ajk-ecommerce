import React from 'react'

export interface TagBadgeProps {
  name: string
  color: string
  size?: 'sm' | 'md'
}

/**
 * Tag badge component for ecommerce display
 * Shows tag name with its color as background
 */
export const TagBadge: React.FC<TagBadgeProps> = ({
  name,
  color,
  size = 'sm'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  )
}

export interface TagBadgesProps {
  tags: Array<{ name: string; color: string }>
  maxDisplay?: number
  size?: 'sm' | 'md'
}

/**
 * Display multiple tag badges
 */
export const TagBadges: React.FC<TagBadgesProps> = ({
  tags,
  maxDisplay = 2,
  size = 'sm'
}) => {
  if (!tags || tags.length === 0) return null

  const displayTags = tags.slice(0, maxDisplay)
  const remainingCount = tags.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1">
      {displayTags.map((tag, index) => (
        <TagBadge key={index} name={tag.name} color={tag.color} size={size} />
      ))}
      {remainingCount > 0 && (
        <span className={`inline-flex items-center rounded-full bg-gray-500 font-medium text-white ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
          +{remainingCount}
        </span>
      )}
    </div>
  )
}

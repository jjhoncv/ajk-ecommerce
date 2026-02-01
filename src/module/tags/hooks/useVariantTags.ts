'use client'

import { type Tags as Tag } from '@/types/domain'
import { useEffect, useState } from 'react'

interface UseVariantTagsResult {
  tags: Tag[]
  isLoading: boolean
  error: string | null
}

/**
 * Hook to fetch tags for a variant (client-side)
 * Used when tags need to be loaded dynamically
 */
export function useVariantTags(variantId: number | null): UseVariantTagsResult {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!variantId) {
      setTags([])
      return
    }

    const fetchTags = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/variants/${variantId}/tags`)
        if (!response.ok) {
          throw new Error('Failed to fetch tags')
        }

        const data = await response.json()
        setTags(data.data?.tags || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setTags([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchTags()
  }, [variantId])

  return { tags, isLoading, error }
}

import { useEffect, useState } from 'react'
import { type RatingSearchResultDTO } from './../types/ratings'

interface UseRatingsDataProps {
  variantId: number
  productId: number
}

export const useRatingsData = ({
  variantId,
  productId
}: UseRatingsDataProps) => {
  const [ratings, setRatings] = useState<RatingSearchResultDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'variant' | 'product'>('variant')
  const [page, setPage] = useState(1)

  const fetchRatings = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/ratings/${activeTab === 'variant' ? 'variant' : 'product'}/${
          activeTab === 'variant' ? variantId : productId
        }?page=${page}`
      )
      if (response.ok) {
        const data = await response.json()
        setRatings(data)
      } else {
        console.error('Error fetching ratings')
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRatings()
  }, [variantId, productId, activeTab, page])

  const handleTabChange = (tab: 'variant' | 'product') => {
    setActiveTab(tab)
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleRatingAdded = () => {
    setPage(1)
    setLoading(true)
    fetchRatings()
  }

  const hasNoRatings =
    !ratings ||
    (ratings.ratings.length === 0 && ratings.summary.totalRatings === 0)

  return {
    ratings,
    loading,
    activeTab,
    page,
    hasNoRatings,
    handleTabChange,
    handlePageChange,
    handleRatingAdded,
    fetchRatings
  }
}

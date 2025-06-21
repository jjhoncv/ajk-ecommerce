import { type VariantRatings } from '@/types/domain'
import { RatingItem } from './RatingItem'
import { RatingPagination } from './RatingPagination'

interface RatingListProps {
  ratings: VariantRatings[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  activeTab: 'variant' | 'product'
}

export const RatingList: React.FC<RatingListProps> = ({
  ratings,
  currentPage,
  totalPages,
  onPageChange,
  activeTab
}) => {
  if (ratings.length === 0) {
    return (
      <p className="py-4 text-center text-gray-500">
        No hay valoraciones disponibles para{' '}
        {activeTab === 'variant' ? 'esta variante' : 'este producto'}.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-0">
        {ratings.map((rating) => (
          <RatingItem key={rating.id} rating={rating} />
        ))}
      </div>

      <RatingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}

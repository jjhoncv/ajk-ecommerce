import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  hoverRating: number
  onRatingClick: (rating: number) => void
  onMouseEnter: (rating: number) => void
  onMouseLeave: () => void
  getRatingText: () => string
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  hoverRating,
  onRatingClick,
  onMouseEnter,
  onMouseLeave,
  getRatingText
}) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        ¿Cómo valorarías este producto?*
      </label>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => { onRatingClick(star) }}
            onMouseEnter={() => { onMouseEnter(star) }}
            onMouseLeave={onMouseLeave}
            className="p-1"
          >
            <Star
              className={`h-8 w-8 ${
                (hoverRating || rating) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <div className="mt-1 text-sm text-gray-600">{getRatingText()}</div>
      )}
    </div>
  )
}

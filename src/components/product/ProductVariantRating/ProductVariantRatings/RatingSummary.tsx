import { useRatingDisplay } from './hooks/useRatingDisplay'
import { type RatingSummary as IRatingSummary } from './types/ratings'

interface RatingSummaryProps {
  summary: IRatingSummary
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ summary }) => {
  const { renderStars, renderRatingBar } = useRatingDisplay()

  return (
    <div className="mb-6 bg-gray-50 p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Puntuación promedio */}
        <div className="text-center md:w-1/4">
          <div className="mb-2 text-5xl font-bold text-gray-800">
            {summary.averageRating.toFixed(1)}
          </div>
          <div className="mb-1 flex justify-center">
            {renderStars(summary.averageRating)}
          </div>
          <p className="text-sm text-gray-500">
            {summary.totalRatings} valoraciones
          </p>
        </div>

        {/* Distribución de estrellas */}
        <div className="space-y-2 md:w-3/4">
          {renderRatingBar(summary.fiveStar, summary.totalRatings, 5)}
          {renderRatingBar(summary.fourStar, summary.totalRatings, 4)}
          {renderRatingBar(summary.threeStar, summary.totalRatings, 3)}
          {renderRatingBar(summary.twoStar, summary.totalRatings, 2)}
          {renderRatingBar(summary.oneStar, summary.totalRatings, 1)}
        </div>
      </div>
    </div>
  )
}

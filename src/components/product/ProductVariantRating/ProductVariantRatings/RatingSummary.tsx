import { useRatingDisplay } from "./hooks/useRatingDisplay";
import { RatingSummary as IRatingSummary } from "./types/ratings";

interface RatingSummaryProps {
  summary: IRatingSummary;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ summary }) => {
  const { renderStars, renderRatingBar } = useRatingDisplay();

  return (
    <div className="bg-gray-50 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Puntuación promedio */}
        <div className="text-center md:w-1/4">
          <div className="text-5xl font-bold text-gray-800 mb-2">
            {summary.averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-1">
            {renderStars(summary.averageRating)}
          </div>
          <p className="text-sm text-gray-500">
            {summary.totalRatings} valoraciones
          </p>
        </div>

        {/* Distribución de estrellas */}
        <div className="md:w-3/4 space-y-2">
          {renderRatingBar(summary.fiveStar, summary.totalRatings, 5)}
          {renderRatingBar(summary.fourStar, summary.totalRatings, 4)}
          {renderRatingBar(summary.threeStar, summary.totalRatings, 3)}
          {renderRatingBar(summary.twoStar, summary.totalRatings, 2)}
          {renderRatingBar(summary.oneStar, summary.totalRatings, 1)}
        </div>
      </div>
    </div>
  );
};
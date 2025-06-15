import { Star } from "lucide-react";

export const useRatingDisplay = () => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (count: number, total: number, stars: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 w-16">
          <span className="text-sm">{stars}</span>
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        </div>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="w-10 text-xs text-gray-500">{count}</div>
      </div>
    );
  };

  return {
    renderStars,
    renderRatingBar,
  };
};
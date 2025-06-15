import { RatingImages, VariantRatings } from "@/types/domain";
import { Check, User } from "lucide-react";
import Image from "next/image";
import { useRatingDisplay } from "./hooks/useRatingDisplay";

interface RatingItemProps {
  rating: VariantRatings;
}

export const RatingItem: React.FC<RatingItemProps> = ({ rating }) => {
  const { renderStars } = useRatingDisplay();

  const customer = rating.customer;
  const customerName = customer
    ? `${customer.name || ''} ${customer.lastname || ''}`.trim() || customer.username
    : 'Usuario anónimo';

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {customer?.photo ? (
            <Image
              src={customer.photo}
              alt={customerName}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{customerName}</p>
            <div className="flex items-center gap-1">
              {renderStars(rating.rating)}
              <span className="text-xs text-gray-500 ml-1">
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {rating.verifiedPurchase === 1 && (
          <div className="flex items-center text-xs text-green-600">
            <Check className="h-3 w-3 mr-1" />
            Compra verificada
          </div>
        )}
      </div>

      {rating.title && (
        <h4 className="font-medium text-gray-800 mb-1">{rating.title}</h4>
      )}

      {rating.review && (
        <p className="text-gray-700 text-sm mb-3">{rating.review}</p>
      )}

      {rating.ratingImages && rating.ratingImages.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {rating.ratingImages
            .filter((image): image is RatingImages => !!image)
            .map((image) => (
              <div
                key={image.id}
                className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0"
              >
                <Image
                  src={image.imageUrl}
                  alt="Imagen de valoración"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
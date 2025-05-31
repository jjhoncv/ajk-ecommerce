"use client";
import React from "react";
import { Star } from "lucide-react";

interface ProductCardRatingProps {
  rating: number;
  totalRatings: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const ProductCardRating: React.FC<ProductCardRatingProps> = ({
  rating,
  totalRatings,
  size = "sm",
  showCount = true,
  className = "",
}) => {
  // Determinar el tamaño de las estrellas
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  // Determinar el tamaño del texto
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  // Redondear el rating a 0.5 más cercano para mostrar medias estrellas
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className={`flex items-center ${className}`}>
      {/* Estrellas */}
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          // Estrella completa
          if (star <= roundedRating) {
            return (
              <Star
                key={star}
                className={`${starSize} fill-yellow-400 text-yellow-400`}
              />
            );
          }
          // Media estrella
          else if (star - 0.5 === roundedRating) {
            return (
              <div key={star} className="relative">
                <Star className={`${starSize} text-gray-300`} />
                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                  <Star
                    className={`${starSize} fill-yellow-400 text-yellow-400`}
                  />
                </div>
              </div>
            );
          }
          // Estrella vacía
          else {
            return <Star key={star} className={`${starSize} text-gray-300`} />;
          }
        })}
      </div>

      {/* Número de valoraciones */}
      {showCount && totalRatings > 0 && (
        <span className={`${textSize} text-gray-500 ml-1`}>
          ({totalRatings})
        </span>
      )}
    </div>
  );
};

export default ProductCardRating;

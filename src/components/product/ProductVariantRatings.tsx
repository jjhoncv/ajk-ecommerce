"use client";
import { Products, ProductVariants, RatingImages, VariantRatings } from "@/types/domain";
import { Check, Star, User } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddRating from "./AddRating";

// Interfaces para el resumen de valoraciones
interface RatingSummary {
  averageRating: number;
  totalRatings: number;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
}

interface RatingSearchResultDTO {
  ratings: VariantRatings[];
  summary: RatingSummary;
  totalPages: number;
  currentPage: number;
}

interface ProductVariantRatingsProps {
  variant: ProductVariants;
  product: Products;
}

const ProductVariantRatings: React.FC<ProductVariantRatingsProps> = ({
  variant,
  product
}) => {
  const [ratings, setRatings] = useState<RatingSearchResultDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"variant" | "product">("variant");
  const [page, setPage] = useState(1);


  // Función para cargar valoraciones
  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/ratings/${activeTab === "variant" ? "variant" : "product"}/${activeTab === "variant" ? variant.id : variant.productId
        }?page=${page}`
      );
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      } else {
        console.error("Error fetching ratings");
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [variant.id, variant.productId, activeTab, page]);

  const handleTabChange = (tab: "variant" | "product") => {
    setActiveTab(tab);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Renderizar estrellas para una valoración
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

  // Renderizar barra de progreso para un nivel de estrellas
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

  // Renderizar una valoración individual
  const renderRating = (rating: VariantRatings) => {
    const customer = rating.customer;
    const customerName = customer
      ? `${customer.name || ''} ${customer.lastname || ''}`.trim() || customer.username
      : 'Usuario anónimo';

    return (
      <div key={rating.id} className="border-b border-gray-200 py-4">
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

  if (loading && !ratings) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Cargando valoraciones...</p>
      </div>
    );
  }

  if (
    !ratings ||
    (ratings.ratings.length === 0 && ratings.summary.totalRatings === 0)
  ) {
    return (
      <div className="py-8 text-center border-t border-gray-200 mt-8">
        <h2 className="text-xl font-bold mb-2">Valoraciones</h2>
        <p className="text-gray-500">
          Este producto aún no tiene valoraciones.
        </p>
      </div>
    );
  }

  // Manejar cuando se añade una nueva valoración
  const handleRatingAdded = () => {
    // Recargar las valoraciones
    setPage(1);
    setLoading(true);
    fetchRatings();
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold mb-6">Valoraciones</h2>

      {/* Resumen de valoraciones */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Puntuación promedio */}
          <div className="text-center md:w-1/4">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {ratings.summary.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-1">
              {renderStars(ratings.summary.averageRating)}
            </div>
            <p className="text-sm text-gray-500">
              {ratings.summary.totalRatings} valoraciones
            </p>
          </div>

          {/* Distribución de estrellas */}
          <div className="md:w-3/4 space-y-2">
            {renderRatingBar(
              ratings.summary.fiveStar,
              ratings.summary.totalRatings,
              5
            )}
            {renderRatingBar(
              ratings.summary.fourStar,
              ratings.summary.totalRatings,
              4
            )}
            {renderRatingBar(
              ratings.summary.threeStar,
              ratings.summary.totalRatings,
              3
            )}
            {renderRatingBar(
              ratings.summary.twoStar,
              ratings.summary.totalRatings,
              2
            )}
            {renderRatingBar(
              ratings.summary.oneStar,
              ratings.summary.totalRatings,
              1
            )}
          </div>
        </div>
      </div>

      {/* Tabs para cambiar entre valoraciones de variante y producto */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "variant"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => handleTabChange("variant")}
          >
            Esta variante (
            {activeTab === "variant" ? ratings.summary.totalRatings : 0})
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "product"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => handleTabChange("product")}
          >
            Todas las variantes (
            {activeTab === "product" ? ratings.summary.totalRatings : 0})
          </button>
        </div>
      </div>

      {/* Lista de valoraciones */}
      <div className="space-y-4">
        {ratings.ratings.length > 0 ? (
          <>
            <div className="space-y-0">{ratings.ratings.map(renderRating)}</div>

            {/* Paginación */}
            {ratings.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 rounded border ${page === 1
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    Anterior
                  </button>

                  {Array.from(
                    { length: ratings.totalPages },
                    (_, i) => i + 1
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded border ${page === pageNum
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === ratings.totalPages}
                    className={`px-3 py-1 rounded border ${page === ratings.totalPages
                      ? "text-gray-400 border-gray-200 cursor-not-allowed"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No hay valoraciones disponibles para{" "}
            {activeTab === "variant" ? "esta variante" : "este producto"}.
          </p>
        )}
      </div>

      {/* Formulario para añadir valoración */}
      <AddRating
        variant={variant}
        product={product}
        onRatingAdded={handleRatingAdded}
      />
    </div>
  );
};

export default ProductVariantRatings;
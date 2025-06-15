import { ProductVariants } from "@/types/domain";
import { useRatingForm } from "./hooks/useRatingForm";
import { ImageUpload } from "./ImageUpload";
import { RatingStars } from "./RatingStars";

interface RatingFormProps {
  variant: ProductVariants;
  productName: string;
  onRatingAdded: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({
  variant,
  productName,
  onRatingAdded,
}) => {
  const {
    rating,
    hoverRating,
    title,
    review,
    images,
    isSubmitting,
    error,
    success,
    setRating,
    setHoverRating,
    setTitle,
    setReview,
    handleImageUpload,
    removeImage,
    handleSubmit,
    getRatingText,
  } = useRatingForm({
    onRatingAdded,
    variantId: variant.id,
    productId: variant.productId,
    productName,
    variantSku: variant.sku,
  });

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
        ¡Gracias por tu valoración! Tu opinión es muy importante para nosotros.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RatingStars
        rating={rating}
        hoverRating={hoverRating}
        onRatingClick={setRating}
        onMouseEnter={setHoverRating}
        onMouseLeave={() => setHoverRating(0)}
        getRatingText={getRatingText}
      />

      {/* Título */}
      <div>
        <label
          htmlFor="rating-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Título
        </label>
        <input
          type="text"
          id="rating-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Resume tu experiencia en una frase"
          maxLength={100}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="text-xs text-gray-500 mt-1">
          {title.length}/100 caracteres
        </div>
      </div>

      {/* Comentario */}
      <div>
        <label
          htmlFor="rating-review"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Comentario
        </label>
        <textarea
          id="rating-review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="¿Qué te gustó o no te gustó? ¿Para qué usaste este producto?"
          maxLength={500}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="text-xs text-gray-500 mt-1">
          {review.length}/500 caracteres
        </div>
      </div>

      <ImageUpload
        images={images}
        onImageUpload={handleImageUpload}
        onRemoveImage={removeImage}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Información de stock */}
      {variant.stock !== undefined && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          Stock disponible: {variant.stock} unidades
        </div>
      )}

      {/* Botón de envío */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar valoración"}
        </button>
      </div>
    </form>
  );
};
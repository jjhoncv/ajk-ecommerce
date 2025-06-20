import { ProductVariants } from '@/types/domain'
import { useRatingForm } from './hooks/useRatingForm'
import { ImageUpload } from './ImageUpload'
import { RatingStars } from './RatingStars'

interface RatingFormProps {
  variant: ProductVariants
  productName: string
  onRatingAdded: () => void
}

export const RatingForm: React.FC<RatingFormProps> = ({
  variant,
  productName,
  onRatingAdded
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
    getRatingText
  } = useRatingForm({
    onRatingAdded,
    variantId: variant.id,
    productId: variant.productId,
    productName,
    variantSku: variant.sku
  })

  if (success) {
    return (
      <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
        ¡Gracias por tu valoración! Tu opinión es muy importante para nosotros.
      </div>
    )
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
          className="mb-1 block text-sm font-medium text-gray-700"
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
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        <div className="mt-1 text-xs text-gray-500">
          {title.length}/100 caracteres
        </div>
      </div>

      {/* Comentario */}
      <div>
        <label
          htmlFor="rating-review"
          className="mb-1 block text-sm font-medium text-gray-700"
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
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
        <div className="mt-1 text-xs text-gray-500">
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
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Información de stock */}
      {variant.stock !== undefined && (
        <div className="rounded bg-gray-50 p-2 text-xs text-gray-500">
          Stock disponible: {variant.stock} unidades
        </div>
      )}

      {/* Botón de envío */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar valoración'}
        </button>
      </div>
    </form>
  )
}

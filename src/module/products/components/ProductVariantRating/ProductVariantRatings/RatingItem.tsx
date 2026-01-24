'use client'

import { type RatingImages, type VariantRatings } from '@/types/domain'
import { Check, User } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useRatingDisplay } from './hooks/useRatingDisplay'
import { RatingImageModal } from './RatingImageModal'

interface RatingItemProps {
  rating: VariantRatings
}

export const RatingItem: React.FC<RatingItemProps> = ({ rating }) => {
  const { renderStars } = useRatingDisplay()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const customer = rating.customer
  const customerName = customer
    ? `${customer.name || ''} ${customer.lastname || ''}`.trim() ||
      customer.email || 'Usuario'
    : 'Usuario anónimo'

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="mb-2 flex items-start justify-between">
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <User className="h-4 w-4 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-medium">{customerName}</p>
            <div className="flex items-center gap-1">
              {renderStars(rating.rating)}
              <span className="ml-1 text-xs text-gray-500">
                {new Date((rating as any).createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        {rating.verifiedPurchase === 1 && (
          <div className="flex items-center text-xs text-green-600">
            <Check className="mr-1 h-3 w-3" />
            Compra verificada
          </div>
        )}
      </div>

      {rating.title && (
        <h4 className="mb-1 font-medium text-gray-800">{rating.title}</h4>
      )}

      {rating.review && (
        <p className="mb-3 text-sm text-gray-700">{rating.review}</p>
      )}

      {rating.ratingImages && rating.ratingImages.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
          {rating.ratingImages
            .filter((image): image is RatingImages => !!image)
            .map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  setSelectedImageIndex(index)
                  setIsModalOpen(true)
                }}
                className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Image
                  src={image.imageUrl}
                  alt="Imagen de valoración"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
        </div>
      )}

      {/* Modal de imágenes */}
      {rating.ratingImages && rating.ratingImages.length > 0 && (
        <RatingImageModal
          images={rating.ratingImages
            .filter((image): image is RatingImages => !!image)
            .map((img) => ({ id: img.id, imageUrl: img.imageUrl }))}
          initialIndex={selectedImageIndex}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false) }}
        />
      )}
    </div>
  )
}

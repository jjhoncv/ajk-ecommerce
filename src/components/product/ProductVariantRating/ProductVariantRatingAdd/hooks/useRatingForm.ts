import { useState } from 'react'

export interface UseRatingFormProps {
  onRatingAdded: () => void
  variantId: number
  productId: number
  productName: string
  variantSku: string
}

export const useRatingForm = ({
  onRatingAdded,
  variantId,
  productId,
  productName,
  variantSku
}: UseRatingFormProps) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [review, setReview] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => {
        return URL.createObjectURL(file)
      })
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const resetForm = () => {
    setRating(0)
    setTitle('')
    setReview('')
    setImages([])
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Por favor, selecciona una valoración')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variantId,
          productId,
          rating,
          title: title.trim() || undefined,
          review: review.trim() || undefined,
          verifiedPurchase: 1,
          images: images.length > 0 ? images : undefined,
          productName,
          variantSku
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al enviar la valoración')
      }

      resetForm()
      setSuccess(true)
      onRatingAdded()

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al enviar la valoración')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingText = () => {
    const ratingTexts = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    }
    return ratingTexts[rating as keyof typeof ratingTexts] || ''
  }

  return {
    // State
    rating,
    hoverRating,
    title,
    review,
    images,
    isSubmitting,
    error,
    success,

    // Actions
    setRating,
    setHoverRating,
    setTitle,
    setReview,
    handleImageUpload,
    removeImage,
    handleSubmit,
    resetForm,

    // Computed
    getRatingText
  }
}

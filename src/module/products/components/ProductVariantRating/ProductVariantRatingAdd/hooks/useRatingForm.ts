import { useState } from 'react'
import {
  isValidImageType,
  processImages,
  type ProcessedImage,
  type ProcessingProgress
} from '../utils/imageProcessor'

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
  const [imageFiles, setImageFiles] = useState<ProcessedImage[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingImages, setIsProcessingImages] = useState(false)
  const [imageProgress, setImageProgress] = useState<ProcessingProgress | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const maxImages = 5
      const remainingSlots = maxImages - imageFiles.length

      if (remainingSlots <= 0) {
        setError('Máximo 5 imágenes permitidas')
        return
      }

      // Validar tipos de archivo
      const invalidFiles = files.filter((f) => !isValidImageType(f))
      if (invalidFiles.length > 0) {
        setError('Algunos archivos no son imágenes válidas. Usa JPG, PNG o WebP.')
        return
      }

      const filesToProcess = files.slice(0, remainingSlots)
      setIsProcessingImages(true)
      setError('')

      try {
        const processed = await processImages(filesToProcess, (progress) => {
          setImageProgress(progress)
        })

        setImageFiles([...imageFiles, ...processed])
        setImageProgress(null)
      } catch {
        setError('Error al procesar las imágenes')
      } finally {
        setIsProcessingImages(false)
      }
    }
  }

  // Para compatibilidad con el componente ImageUpload
  const images = imageFiles.map((img) => img.preview)

  const removeImage = (index: number) => {
    const newImages = [...imageFiles]
    newImages.splice(index, 1)
    setImageFiles(newImages)
  }

  const resetForm = () => {
    setRating(0)
    setTitle('')
    setReview('')
    setImageFiles([])
    setError('')
    setImageProgress(null)
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
          images: imageFiles.length > 0 ? imageFiles.map((img) => img.base64) : undefined,
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
    isProcessingImages,
    imageProgress,
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

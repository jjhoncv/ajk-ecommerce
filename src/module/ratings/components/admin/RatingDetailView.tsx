'use client'

import { type RatingForAdmin } from '@/module/products/core/VariantRating.interfaces'
import { RatingImageModal } from '@/module/products/components/ProductVariantRating/ProductVariantRatings/RatingImageModal'
import { type RatingStatus } from '@/types/domain'
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Star,
  Trash2,
  User,
  X,
  XCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface RatingDetailViewProps {
  ratingId: string
}

const statusConfig: Record<RatingStatus, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
  approved: { label: 'Aprobada', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  rejected: { label: 'Rechazada', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle }
}

export function RatingDetailView({ ratingId }: RatingDetailViewProps) {
  const router = useRouter()
  const [rating, setRating] = useState<RatingForAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const fetchRating = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/ratings/${ratingId}`)
      if (response.ok) {
        const data = await response.json()
        setRating(data.rating)
      }
    } catch (error) {
      console.error('Error fetching rating:', error)
    } finally {
      setLoading(false)
    }
  }, [ratingId])

  useEffect(() => {
    fetchRating()
  }, [fetchRating])

  const handleModerate = async (status: RatingStatus) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/ratings/${ratingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchRating()
      }
    } catch (error) {
      console.error('Error moderating rating:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar esta valoración? Esta acción no se puede deshacer.')) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/ratings/${ratingId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/admin/ratings')
      }
    } catch (error) {
      console.error('Error deleting rating:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (ratingValue: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 ${
              star <= ratingValue
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!rating) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="text-gray-500">Valoración no encontrada</p>
        <Link
          href="/admin/ratings"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Volver a la lista
        </Link>
      </div>
    )
  }

  const status = statusConfig[rating.status]
  const StatusIcon = status.icon

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/ratings"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la lista
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Rating Card */}
          <div className="rounded-lg border bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                {renderStars(rating.rating)}
                <span className="text-2xl font-bold text-gray-900">{rating.rating}/5</span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${status.bgColor} ${status.color}`}
              >
                <StatusIcon className="h-4 w-4" />
                {status.label}
              </span>
            </div>

            {rating.verifiedPurchase === 1 && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                <Check className="h-4 w-4" />
                Compra verificada
              </div>
            )}

            {rating.title && (
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {rating.title}
              </h3>
            )}

            {rating.review && (
              <p className="whitespace-pre-wrap text-gray-700">{rating.review}</p>
            )}

            {!rating.title && !rating.review && (
              <p className="italic text-gray-400">Sin comentario escrito</p>
            )}

            {/* Images */}
            {rating.images.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium text-gray-700">
                  Imágenes adjuntas ({rating.images.length})
                </h4>
                <div className="flex flex-wrap gap-3">
                  {rating.images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        setSelectedImageIndex(index)
                        setIsModalOpen(true)
                      }}
                      className="relative h-24 w-24 overflow-hidden rounded-lg border transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Image
                        src={img.imageUrl}
                        alt="Imagen de reseña"
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Producto Valorado
            </h3>
            <div>
              <p className="text-lg font-medium text-gray-900">{rating.productName}</p>
              <p className="text-sm text-gray-500">SKU: {rating.variantSku}</p>
              {rating.variantAttributes && (
                <p className="mt-1 text-sm text-gray-500">{rating.variantAttributes}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Cliente
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                {rating.customerPhoto ? (
                  <Image
                    src={rating.customerPhoto}
                    alt={rating.customerName}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {rating.customerName} {rating.customerLastname}
                </p>
                <p className="text-sm text-gray-500">{rating.customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Moderation Info */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Información
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID</span>
                <span className="font-medium text-gray-900">#{rating.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha de creación</span>
                <span className="font-medium text-gray-900">
                  {formatDate(rating.reviewedAt || new Date())}
                </span>
              </div>
              {rating.reviewerName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Moderado por</span>
                  <span className="font-medium text-gray-900">{rating.reviewerName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Acciones
            </h3>
            <div className="space-y-3">
              {rating.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleModerate('approved')}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    Aprobar valoración
                  </button>
                  <button
                    onClick={() => handleModerate('rejected')}
                    disabled={actionLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    Rechazar valoración
                  </button>
                </>
              )}
              {rating.status === 'approved' && (
                <button
                  onClick={() => handleModerate('rejected')}
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cambiar a rechazada
                </button>
              )}
              {rating.status === 'rejected' && (
                <button
                  onClick={() => handleModerate('approved')}
                  disabled={actionLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-300 px-4 py-2.5 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Cambiar a aprobada
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar valoración
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {rating.images.length > 0 && (
        <RatingImageModal
          images={rating.images.map((img) => ({ id: img.id, imageUrl: img.imageUrl }))}
          initialIndex={selectedImageIndex}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false) }}
        />
      )}
    </div>
  )
}

'use client'

import { Button, Input } from '@/module/shared/components/ui'
import { type RatingForAdmin } from '@/module/products/core/VariantRating.interfaces'
import { type RatingStatus } from '@/types/domain'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  ImageIcon,
  Search,
  Star,
  Trash2,
  X,
  XCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface RatingsData {
  ratings: RatingForAdmin[]
  totalCount: number
  page: number
  totalPages: number
  pendingCount: number
  approvedCount: number
  rejectedCount: number
}

const statusConfig: Record<RatingStatus, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: Clock },
  approved: { label: 'Aprobada', color: 'text-green-700', bgColor: 'bg-green-100', icon: Check },
  rejected: { label: 'Rechazada', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle }
}

export function RatingsListView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [data, setData] = useState<RatingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<RatingStatus | ''>(
    (searchParams.get('status') as RatingStatus) || ''
  )
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  )

  const fetchRatings = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      params.set('page', currentPage.toString())
      params.set('limit', '20')

      const response = await fetch(`/api/admin/ratings?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, currentPage])

  useEffect(() => {
    fetchRatings()
  }, [fetchRatings])

  useEffect(() => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (currentPage > 1) params.set('page', currentPage.toString())
    const newUrl = params.toString() ? `?${params.toString()}` : '/admin/ratings'
    router.replace(newUrl, { scroll: false })
  }, [statusFilter, currentPage, router])

  const handleModerate = async (id: number, status: RatingStatus) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/ratings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchRatings()
      }
    } catch (error) {
      console.error('Error moderating rating:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta valoración?')) return

    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/ratings/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchRatings()
      }
    } catch (error) {
      console.error('Error deleting rating:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={() => { setStatusFilter('pending'); setCurrentPage(1) }}
          className={`rounded-lg border p-3 text-left transition-colors ${
            statusFilter === 'pending' ? 'border-yellow-400 bg-yellow-50' : 'bg-yellow-50 hover:border-yellow-300'
          }`}
        >
          <div className="text-xl font-bold text-yellow-700">{data?.pendingCount || 0}</div>
          <div className="text-xs text-yellow-600">Pendientes</div>
        </button>
        <button
          onClick={() => { setStatusFilter('approved'); setCurrentPage(1) }}
          className={`rounded-lg border p-3 text-left transition-colors ${
            statusFilter === 'approved' ? 'border-green-400 bg-green-50' : 'bg-green-50 hover:border-green-300'
          }`}
        >
          <div className="text-xl font-bold text-green-700">{data?.approvedCount || 0}</div>
          <div className="text-xs text-green-600">Aprobadas</div>
        </button>
        <button
          onClick={() => { setStatusFilter('rejected'); setCurrentPage(1) }}
          className={`rounded-lg border p-3 text-left transition-colors ${
            statusFilter === 'rejected' ? 'border-red-400 bg-red-50' : 'bg-red-50 hover:border-red-300'
          }`}
        >
          <div className="text-xl font-bold text-red-700">{data?.rejectedCount || 0}</div>
          <div className="text-xs text-red-600">Rechazadas</div>
        </button>
        <button
          onClick={() => { setStatusFilter(''); setCurrentPage(1) }}
          className={`rounded-lg border p-3 text-left transition-colors ${
            statusFilter === '' ? 'border-blue-400 bg-blue-50' : 'bg-blue-50 hover:border-blue-300'
          }`}
        >
          <div className="text-xl font-bold text-blue-700">
            {(data?.pendingCount || 0) + (data?.approvedCount || 0) + (data?.rejectedCount || 0)}
          </div>
          <div className="text-xs text-blue-600">Total</div>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as RatingStatus | '')
              setCurrentPage(1)
            }}
            className="h-9 rounded-md border border-gray-300 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>

        {statusFilter === 'pending' && data && data.pendingCount > 0 && (
          <div className="text-sm text-yellow-600">
            {data.pendingCount} valoraciones esperando revisión
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                Cliente
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                Producto
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Valoración
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                Comentario
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Estado
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Fecha
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.ratings.map((rating) => {
              const status = statusConfig[rating.status]
              const StatusIcon = status.icon
              return (
                <tr key={rating.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                        {rating.customerPhoto ? (
                          <Image
                            src={rating.customerPhoto}
                            alt={rating.customerName}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-500">
                            {rating.customerName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          {rating.customerName} {rating.customerLastname}
                        </div>
                        <div className="text-xs text-gray-400">
                          {rating.customerEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <div className="max-w-[180px] truncate text-xs font-medium text-gray-900">
                        {rating.productName}
                      </div>
                      <div className="text-xs text-gray-400">
                        SKU: {rating.variantSku}
                      </div>
                      {rating.variantAttributes && (
                        <div className="max-w-[180px] truncate text-xs text-gray-400">
                          {rating.variantAttributes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {renderStars(rating.rating)}
                      {rating.verifiedPurchase === 1 && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-green-100 px-1 py-0.5 text-[10px] text-green-700">
                          <Check className="h-2.5 w-2.5" />
                          Compra verificada
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="max-w-[200px]">
                      {rating.title && (
                        <div className="truncate text-xs font-medium text-gray-900">
                          {rating.title}
                        </div>
                      )}
                      {rating.review && (
                        <div className="line-clamp-2 text-xs text-gray-500">
                          {rating.review}
                        </div>
                      )}
                      {rating.images.length > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                          <ImageIcon className="h-3 w-3" />
                          {rating.images.length} imagen{rating.images.length > 1 ? 'es' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${status.bgColor} ${status.color}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                    {rating.reviewerName && (
                      <div className="mt-0.5 text-[10px] text-gray-400">
                        por {rating.reviewerName}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="text-xs text-gray-500">
                      {formatDate(rating.reviewedAt || new Date())}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/ratings/${rating.id}`}
                        className="inline-flex items-center justify-center rounded bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {rating.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleModerate(rating.id, 'approved')}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center justify-center rounded bg-green-100 p-1.5 text-green-600 hover:bg-green-200 disabled:opacity-50"
                            title="Aprobar"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleModerate(rating.id, 'rejected')}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center justify-center rounded bg-red-100 p-1.5 text-red-600 hover:bg-red-200 disabled:opacity-50"
                            title="Rechazar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(rating.id)}
                        disabled={actionLoading === rating.id}
                        className="inline-flex items-center justify-center rounded bg-red-50 p-1.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-gray-50 px-3 py-2">
            <div className="text-xs text-gray-500">
              {(currentPage - 1) * 20 + 1}-
              {Math.min(currentPage * 20, data.totalCount)} de {data.totalCount}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="px-2 text-xs text-gray-600">
                {currentPage}/{data.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={currentPage === data.totalPages}
                className="h-7 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {data?.ratings.length === 0 && (
          <div className="py-8 text-center">
            <Star className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No se encontraron valoraciones</p>
          </div>
        )}
      </div>
    </div>
  )
}

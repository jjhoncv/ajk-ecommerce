'use client'

import { Button, Input } from '@/module/shared/components/ui'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Package,
  Percent,
  Plus,
  Search,
  Tag,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { type PromotionWithMetrics } from '../../service/promotion/types'

interface PromotionsListViewProps {
  promotions: PromotionWithMetrics[]
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: 'Activa', color: 'text-green-700', bgColor: 'bg-green-100' },
  scheduled: { label: 'Programada', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  expired: { label: 'Expirada', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  inactive: { label: 'Inactiva', color: 'text-red-700', bgColor: 'bg-red-100' }
}

const getPromotionStatus = (promotion: PromotionWithMetrics): 'active' | 'scheduled' | 'expired' | 'inactive' => {
  if (!promotion.isActive) return 'inactive'
  const now = new Date()
  const start = new Date(promotion.startDate)
  const end = new Date(promotion.endDate)
  if (now < start) return 'scheduled'
  if (now > end) return 'expired'
  return 'active'
}

export function PromotionsListView({ promotions }: PromotionsListViewProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleting, setDeleting] = useState<number | null>(null)
  const itemsPerPage = 15

  const filteredPromotions = useMemo(() => {
    let filtered = [...promotions]

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (promo) =>
          promo.name.toLowerCase().includes(search) ||
          promo.description?.toLowerCase().includes(search)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((promo) => getPromotionStatus(promo) === statusFilter)
    }

    return filtered
  }, [promotions, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage)
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const stats = useMemo(() => {
    const active = promotions.filter((p) => getPromotionStatus(p) === 'active').length
    const scheduled = promotions.filter((p) => getPromotionStatus(p) === 'scheduled').length
    const expired = promotions.filter((p) => getPromotionStatus(p) === 'expired').length
    const totalVariants = promotions.reduce((sum, p) => sum + p.variantCount, 0)
    return { active, scheduled, expired, totalVariants }
  }, [promotions])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción? Se eliminarán también todas las variantes asociadas.')) {
      return
    }

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border bg-green-50 p-3">
          <div className="text-xl font-bold text-green-700">{stats.active}</div>
          <div className="text-xs text-green-600">Activas</div>
        </div>
        <div className="rounded-lg border bg-blue-50 p-3">
          <div className="text-xl font-bold text-blue-700">{stats.scheduled}</div>
          <div className="text-xs text-blue-600">Programadas</div>
        </div>
        <div className="rounded-lg border bg-gray-50 p-3">
          <div className="text-xl font-bold text-gray-700">{stats.expired}</div>
          <div className="text-xs text-gray-600">Expiradas</div>
        </div>
        <div className="rounded-lg border bg-purple-50 p-3">
          <div className="text-xl font-bold text-purple-700">{stats.totalVariants}</div>
          <div className="text-xs text-purple-600">Variantes en promo</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="h-9 pl-8 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 rounded-md border border-gray-300 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Estado</option>
            <option value="active">Activa</option>
            <option value="scheduled">Programada</option>
            <option value="expired">Expirada</option>
            <option value="inactive">Inactiva</option>
          </select>
        </div>

        <Link
          href="/admin/promotions/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nueva promoción
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                Promoción
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Descuento
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Período
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Estado
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Productos
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPromotions.map((promo) => {
              const status = getPromotionStatus(promo)
              return (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                        <Tag className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">
                          {promo.name}
                        </div>
                        {promo.description && (
                          <div className="max-w-[200px] truncate text-xs text-gray-400">
                            {promo.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="inline-flex items-center gap-1 rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
                      {promo.discountType === 'percentage' ? (
                        <Percent className="h-3 w-3" />
                      ) : (
                        <span>S/</span>
                      )}
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}%`
                        : promo.discountValue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(promo.startDate)}
                      </div>
                      <div className="text-gray-400">
                        al {formatDate(promo.endDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${statusLabels[status].bgColor} ${statusLabels[status].color}`}
                    >
                      {statusLabels[status].label}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Package className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{promo.variantCount}</span>
                      {promo.variantsWithStock < promo.variantCount && (
                        <span className="text-orange-500">
                          ({promo.variantsWithStock} c/stock)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/promotions/${promo.id}`}
                        className="inline-flex items-center justify-center rounded bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        disabled={deleting === promo.id}
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t bg-gray-50 px-3 py-2">
            <div className="text-xs text-gray-500">
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredPromotions.length)} de{' '}
              {filteredPromotions.length}
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
                {currentPage}/{totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {paginatedPromotions.length === 0 && (
          <div className="py-8 text-center">
            <Tag className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No se encontraron promociones</p>
          </div>
        )}
      </div>
    </div>
  )
}

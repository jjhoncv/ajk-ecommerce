'use client'

import { Button, Input } from '@/module/shared/components/ui'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Percent,
  Plus,
  Search,
  Ticket,
  Trash2,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { type CouponStats, type CouponWithStats } from '../../service/coupon/types'

interface CouponsListViewProps {
  coupons: CouponWithStats[]
  stats?: CouponStats | null
}

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: 'Activo', color: 'text-green-700', bgColor: 'bg-green-100' },
  scheduled: { label: 'Programado', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  expired: { label: 'Expirado', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  inactive: { label: 'Inactivo', color: 'text-red-700', bgColor: 'bg-red-100' },
  exhausted: { label: 'Agotado', color: 'text-orange-700', bgColor: 'bg-orange-100' }
}

const getCouponStatus = (coupon: CouponWithStats): 'active' | 'scheduled' | 'expired' | 'inactive' | 'exhausted' => {
  if (!coupon.isActive) return 'inactive'
  const usageLimit = Number(coupon.usageLimit) || 0
  const usedCount = Number(coupon.usedCount) || 0
  if (usageLimit > 0 && usedCount >= usageLimit) return 'exhausted'
  const now = new Date()
  const start = new Date(coupon.startDate)
  const end = new Date(coupon.endDate)
  if (now < start) return 'scheduled'
  if (now > end) return 'expired'
  return 'active'
}

export function CouponsListView({ coupons, stats }: CouponsListViewProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const itemsPerPage = 15

  const filteredCoupons = useMemo(() => {
    let filtered = [...coupons]

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (coupon) =>
          coupon.name.toLowerCase().includes(search) ||
          coupon.code.toLowerCase().includes(search) ||
          coupon.description?.toLowerCase().includes(search)
      )
    }

    if (statusFilter) {
      filtered = filtered.filter((coupon) => getCouponStatus(coupon) === statusFilter)
    }

    return filtered
  }, [coupons, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage)
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const localStats = useMemo(() => {
    const active = coupons.filter((c) => getCouponStatus(c) === 'active').length
    const totalUsages = coupons.reduce((sum, c) => sum + (Number(c.totalUsages) || 0), 0)
    const totalDiscount = coupons.reduce((sum, c) => sum + (Number(c.totalDiscountAmount) || 0), 0)
    return { active, totalUsages, totalDiscount }
  }, [coupons])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const formatPrice = (price: number | string | null | undefined) => {
    const num = Number(price) || 0
    return `S/${num.toFixed(2)}`
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cupón?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting coupon:', error)
    } finally {
      setDeleting(null)
    }
  }

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border bg-green-50 p-3">
          <div className="text-xl font-bold text-green-700">{localStats.active}</div>
          <div className="text-xs text-green-600">Cupones activos</div>
        </div>
        <div className="rounded-lg border bg-blue-50 p-3">
          <div className="text-xl font-bold text-blue-700">{coupons.length}</div>
          <div className="text-xs text-blue-600">Total cupones</div>
        </div>
        <div className="rounded-lg border bg-purple-50 p-3">
          <div className="text-xl font-bold text-purple-700">{localStats.totalUsages}</div>
          <div className="text-xs text-purple-600">Usos totales</div>
        </div>
        <div className="rounded-lg border bg-emerald-50 p-3">
          <div className="text-xl font-bold text-emerald-700">{formatPrice(localStats.totalDiscount)}</div>
          <div className="text-xs text-emerald-600">Descuentos dados</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre o código..."
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
            <option value="active">Activo</option>
            <option value="scheduled">Programado</option>
            <option value="expired">Expirado</option>
            <option value="inactive">Inactivo</option>
            <option value="exhausted">Agotado</option>
          </select>
        </div>

        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo cupón
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">
                Cupón
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Código
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
                Usos
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium uppercase text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedCoupons.map((coupon) => {
              const status = getCouponStatus(coupon)
              return (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                        <Ticket className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-xs">
                          {coupon.name}
                        </div>
                        {coupon.description && (
                          <div className="max-w-[180px] truncate text-xs text-gray-400">
                            {coupon.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <code className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono font-semibold">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Copiar código"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      {copiedCode === coupon.code && (
                        <span className="text-xs text-green-600">Copiado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                      {coupon.discountType === 'percentage' ? (
                        <Percent className="h-3 w-3" />
                      ) : (
                        <span>S/</span>
                      )}
                      {coupon.discountType === 'percentage'
                        ? `${Number(coupon.discountValue) || 0}%`
                        : (Number(coupon.discountValue) || 0).toFixed(2)}
                    </div>
                    {coupon.maxDiscountAmount && (
                      <div className="text-xs text-gray-400">
                        máx {formatPrice(coupon.maxDiscountAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(coupon.startDate)}
                      </div>
                      <div className="text-gray-400">
                        al {formatDate(coupon.endDate)}
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
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{coupon.totalUsages}</span>
                      {coupon.usageLimit && (
                        <span className="text-gray-400">/ {coupon.usageLimit}</span>
                      )}
                    </div>
                    {coupon.totalDiscountAmount > 0 && (
                      <div className="text-xs text-green-600">
                        -{formatPrice(coupon.totalDiscountAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/admin/coupons/${coupon.id}`}
                        className="inline-flex items-center justify-center rounded bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        disabled={deleting === coupon.id}
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
              {Math.min(currentPage * itemsPerPage, filteredCoupons.length)} de{' '}
              {filteredCoupons.length}
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

        {paginatedCoupons.length === 0 && (
          <div className="py-8 text-center">
            <Ticket className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">No se encontraron cupones</p>
          </div>
        )}
      </div>
    </div>
  )
}

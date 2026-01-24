'use client'

import { type Offer, type OfferType } from '@/module/offers/core'
import {
  Calendar,
  Clock,
  Eye,
  Flame,
  Pause,
  Pencil,
  Play,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const offerTypeConfig: Record<OfferType, { label: string; icon: typeof Zap; color: string }> = {
  flash_sale: { label: 'Flash Sale', icon: Zap, color: 'bg-red-100 text-red-700' },
  daily_deal: { label: 'Oferta del Día', icon: Calendar, color: 'bg-orange-100 text-orange-700' },
  clearance: { label: 'Liquidación', icon: Tag, color: 'bg-purple-100 text-purple-700' },
  bundle: { label: 'Bundle', icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' },
  volume_discount: { label: 'Por Volumen', icon: ShoppingBag, color: 'bg-green-100 text-green-700' },
  seasonal: { label: 'Temporada', icon: Flame, color: 'bg-amber-100 text-amber-700' }
}

export function OffersListView() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [stats, setStats] = useState({ active: 0, scheduled: 0, expired: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter === 'active') params.set('isActive', 'true')
      if (filter === 'expired') params.set('includeExpired', 'true')
      if (search) params.set('search', search)

      const response = await fetch(`/api/admin/offers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOffers(data.offers)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
  }, [filter, search])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  const handleToggleStatus = async (offer: Offer) => {
    setActionLoading(offer.id)
    try {
      const response = await fetch(`/api/admin/offers/${offer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !offer.isActive })
      })

      if (response.ok) {
        fetchOffers()
      }
    } catch (error) {
      console.error('Error toggling offer status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (offer: Offer) => {
    if (!confirm(`¿Eliminar la oferta "${offer.name}"? Esta acción no se puede deshacer.`)) return

    setActionLoading(offer.id)
    try {
      const response = await fetch(`/api/admin/offers/${offer.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchOffers()
      }
    } catch (error) {
      console.error('Error deleting offer:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getOfferStatus = (offer: Offer) => {
    const now = new Date()
    const startDate = new Date(offer.startDate)
    const endDate = new Date(offer.endDate)

    if (!offer.isActive) return { label: 'Inactiva', color: 'bg-gray-100 text-gray-600' }
    if (now < startDate) return { label: 'Programada', color: 'bg-blue-100 text-blue-700' }
    if (now > endDate) return { label: 'Expirada', color: 'bg-red-100 text-red-700' }
    return { label: 'Activa', color: 'bg-green-100 text-green-700' }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDiscount = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `-${offer.discountValue}%`
    }
    if (offer.discountType === 'fixed_amount') {
      return `-S/${offer.discountValue.toFixed(2)}`
    }
    return `S/${offer.discountValue.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Ofertas</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-500">Activas</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
          <p className="text-sm text-gray-500">Programadas</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-2xl font-bold text-gray-400">{stats.expired}</p>
          <p className="text-sm text-gray-500">Expiradas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'active', label: 'Activas' },
            { value: 'scheduled', label: 'Programadas' },
            { value: 'expired', label: 'Expiradas' }
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ofertas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm sm:w-64"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">No hay ofertas</p>
          <Link
            href="/admin/offers/new"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Crear primera oferta
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Oferta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Descuento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Período
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offers.map((offer) => {
                const typeConfig = offerTypeConfig[offer.offerType]
                const TypeIcon = typeConfig.icon
                const status = getOfferStatus(offer)

                return (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {offer.badgeText && (
                          <span
                            className="rounded px-2 py-1 text-xs font-bold text-white"
                            style={{ backgroundColor: offer.badgeColor }}
                          >
                            {offer.badgeText}
                          </span>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{offer.name}</p>
                          <p className="text-sm text-gray-500">{offer.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${typeConfig.color}`}
                      >
                        <TypeIcon className="h-3 w-3" />
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-green-600">
                        {formatDiscount(offer)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-3 w-3" />
                          {formatDate(offer.startDate)}
                        </div>
                        <div className="text-gray-400">
                          hasta {formatDate(offer.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                      >
                        {status.label}
                      </span>
                      {offer.isFeatured && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                          Destacada
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/offers/${offer.id}`}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          title="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/offers/${offer.id}`}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(offer)}
                          disabled={actionLoading === offer.id}
                          className={`rounded p-1 hover:bg-gray-100 ${
                            offer.isActive
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-green-500 hover:text-green-600'
                          }`}
                          title={offer.isActive ? 'Pausar' : 'Activar'}
                        >
                          {offer.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(offer)}
                          disabled={actionLoading === offer.id}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
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
        </div>
      )}
    </div>
  )
}

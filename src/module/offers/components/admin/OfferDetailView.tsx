'use client'

import {
  type OfferForAdmin,
  type OfferType,
  type OfferDiscountType,
  type OfferVariantForAdmin
} from '@/module/offers/core'
import {
  ArrowLeft,
  Calendar,
  Loader2,
  Package,
  Percent,
  Plus,
  Save,
  Tag,
  Trash2,
  X,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface OfferDetailViewProps {
  offerId: string
}

const offerTypes: Array<{ value: OfferType; label: string; description: string }> = [
  { value: 'flash_sale', label: 'Flash Sale', description: 'Oferta de corta duración con alta urgencia' },
  { value: 'daily_deal', label: 'Oferta del Día', description: 'Producto destacado cada día' },
  { value: 'clearance', label: 'Liquidación', description: 'Descuento por stock limitado' },
  { value: 'bundle', label: 'Bundle', description: 'Combo de productos' },
  { value: 'volume_discount', label: 'Por Volumen', description: 'Descuento al comprar más unidades' },
  { value: 'seasonal', label: 'Temporada', description: 'Ofertas estacionales' }
]

const discountTypes: Array<{ value: OfferDiscountType; label: string }> = [
  { value: 'percentage', label: 'Porcentaje (%)' },
  { value: 'fixed_amount', label: 'Monto Fijo (S/)' },
  { value: 'fixed_price', label: 'Precio Final (S/)' }
]

const badgeColors = [
  { value: 'red', label: 'Rojo', hex: '#ef4444' },
  { value: 'orange', label: 'Naranja', hex: '#f97316' },
  { value: 'green', label: 'Verde', hex: '#22c55e' },
  { value: 'blue', label: 'Azul', hex: '#3b82f6' },
  { value: 'purple', label: 'Morado', hex: '#a855f7' },
  { value: 'pink', label: 'Rosa', hex: '#ec4899' }
]

export function OfferDetailView({ offerId }: OfferDetailViewProps) {
  const router = useRouter()
  const isNew = offerId === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [offerType, setOfferType] = useState<OfferType>('flash_sale')
  const [discountType, setDiscountType] = useState<OfferDiscountType>('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [maxUsesPerCustomer, setMaxUsesPerCustomer] = useState('1')
  const [minQuantity, setMinQuantity] = useState('1')
  const [badgeText, setBadgeText] = useState('')
  const [badgeColor, setBadgeColor] = useState('red')
  const [showCountdown, setShowCountdown] = useState(false)
  const [showStockIndicator, setShowStockIndicator] = useState(false)
  const [showSavings, setShowSavings] = useState(true)
  const [priority, setPriority] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [variants, setVariants] = useState<OfferVariantForAdmin[]>([])
  const [stats, setStats] = useState({ totalSold: 0, totalRevenue: 0, totalSavings: 0 })

  // Variant selector modal
  const [showVariantSelector, setShowVariantSelector] = useState(false)
  const [availableVariants, setAvailableVariants] = useState<Array<{
    id: number
    sku: string
    price: number
    stock: number
    productName: string
    attributes: string
    fullName: string
    imageUrl?: string
  }>>([])
  const [searchVariant, setSearchVariant] = useState('')
  const [loadingVariants, setLoadingVariants] = useState(false)
  const [searchError, setSearchError] = useState('')

  const fetchOffer = useCallback(async () => {
    if (isNew) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/offers/${offerId}`)
      if (response.ok) {
        const data = await response.json()
        const offer: OfferForAdmin = data.offer

        setName(offer.name)
        setTitle(offer.title)
        setDescription(offer.description || '')
        setOfferType(offer.offerType)
        setDiscountType(offer.discountType)
        setDiscountValue(String(offer.discountValue))
        setStartDate(formatDateForInput(offer.startDate))
        setEndDate(formatDateForInput(offer.endDate))
        setMaxUses(offer.maxUses ? String(offer.maxUses) : '')
        setMaxUsesPerCustomer(String(offer.maxUsesPerCustomer))
        setMinQuantity(String(offer.minQuantity))
        setBadgeText(offer.badgeText || '')
        setBadgeColor(offer.badgeColor)
        setShowCountdown(offer.showCountdown)
        setShowStockIndicator(offer.showStockIndicator)
        setShowSavings(offer.showSavings)
        setPriority(String(offer.priority))
        setIsActive(offer.isActive)
        setIsFeatured(offer.isFeatured)
        setVariants(offer.variants)
        setStats(offer.stats)
      }
    } catch (error) {
      console.error('Error fetching offer:', error)
      setError('Error al cargar la oferta')
    } finally {
      setLoading(false)
    }
  }, [offerId, isNew])

  useEffect(() => {
    fetchOffer()
  }, [fetchOffer])

  const formatDateForInput = (date: Date | string) => {
    const d = new Date(date)
    return d.toISOString().slice(0, 16)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const body = {
        name,
        title,
        description: description || null,
        offerType,
        discountType,
        discountValue: parseFloat(discountValue),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        maxUses: maxUses ? parseInt(maxUses) : null,
        maxUsesPerCustomer: parseInt(maxUsesPerCustomer),
        minQuantity: parseInt(minQuantity),
        badgeText: badgeText || null,
        badgeColor,
        showCountdown,
        showStockIndicator,
        showSavings,
        priority: parseInt(priority),
        isActive,
        isFeatured,
        variants: variants.map((v) => ({
          variantId: v.variantId,
          offerPrice: v.offerPrice,
          originalPrice: v.originalPrice,
          stockLimit: v.stockLimit
        }))
      }

      const url = isNew ? '/api/admin/offers' : `/api/admin/offers/${offerId}`
      const method = isNew ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al guardar')
      }

      const data = await response.json()
      router.push(`/admin/offers/${data.offer?.id || offerId}`)
      if (isNew) {
        router.push(`/admin/offers/${data.offer.id}`)
      } else {
        fetchOffer()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al guardar la oferta')
      }
    } finally {
      setSaving(false)
    }
  }

  const searchAvailableVariants = async (query?: string) => {
    const searchQuery = query ?? searchVariant
    setLoadingVariants(true)
    setSearchError('')
    try {
      const response = await fetch(`/api/admin/variants/search?q=${encodeURIComponent(searchQuery)}&limit=30`)
      const data = await response.json()

      if (!response.ok) {
        setSearchError(data.error || 'Error al buscar')
        setAvailableVariants([])
        return
      }

      // Filtrar variantes que ya están en la oferta
      const filteredVariants = (data.variants || []).filter(
        (v: { id: number }) => !variants.find((existing) => existing.variantId === v.id)
      )
      setAvailableVariants(filteredVariants)
    } catch (error) {
      console.error('Error searching variants:', error)
      setSearchError('Error de conexión al buscar productos')
      setAvailableVariants([])
    } finally {
      setLoadingVariants(false)
    }
  }

  const addVariant = (variant: typeof availableVariants[0]) => {
    let offerPrice = variant.price

    if (discountType === 'percentage') {
      offerPrice = variant.price * (1 - parseFloat(discountValue || '0') / 100)
    } else if (discountType === 'fixed_amount') {
      offerPrice = variant.price - parseFloat(discountValue || '0')
    } else if (discountType === 'fixed_price') {
      offerPrice = parseFloat(discountValue || '0')
    }

    setVariants([
      ...variants,
      {
        id: 0,
        offerId: parseInt(offerId) || 0,
        variantId: variant.id,
        offerPrice: Math.round(Math.max(0, offerPrice) * 100) / 100,
        originalPrice: variant.price,
        stockLimit: null,
        soldCount: 0,
        remainingStock: null,
        createdAt: new Date(),
        variantSku: variant.sku,
        productName: variant.fullName || variant.productName,
        currentStock: variant.stock,
        imageUrl: variant.imageUrl,
        variantAttributes: variant.attributes
      }
    ])

    setAvailableVariants(availableVariants.filter((v) => v.id !== variant.id))
  }

  const removeVariant = (variantId: number) => {
    setVariants(variants.filter((v) => v.variantId !== variantId))
  }

  const updateVariantPrice = (variantId: number, offerPrice: number) => {
    setVariants(
      variants.map((v) =>
        v.variantId === variantId ? { ...v, offerPrice } : v
      )
    )
  }

  const updateVariantStockLimit = (variantId: number, stockLimit: number | null) => {
    setVariants(
      variants.map((v) =>
        v.variantId === variantId ? { ...v, stockLimit } : v
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/offers"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a ofertas
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Tag className="h-5 w-5" />
                Información Básica
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nombre interno *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ej: Flash Sale Enero 2026"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Título visible *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Ej: Flash Sale - Solo por hoy"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Descripción opcional de la oferta..."
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tipo de Oferta *
                  </label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value as OfferType)}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    {offerTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Prioridad
                  </label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    min="0"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mayor número = mayor prioridad
                  </p>
                </div>
              </div>
            </div>

            {/* Discount Config */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Percent className="h-5 w-5" />
                Configuración del Descuento
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Tipo de Descuento *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as OfferDiscountType)}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    {discountTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Valor del Descuento *
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder={discountType === 'percentage' ? 'Ej: 25' : 'Ej: 50.00'}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Cantidad Mínima
                  </label>
                  <input
                    type="number"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    min="1"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Para descuentos por volumen
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Máx. usos por cliente
                  </label>
                  <input
                    type="number"
                    value={maxUsesPerCustomer}
                    onChange={(e) => setMaxUsesPerCustomer(e.target.value)}
                    min="1"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Máx. usos totales (opcional)
                  </label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    min="1"
                    placeholder="Sin límite"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Date Config */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Calendar className="h-5 w-5" />
                Período de Vigencia
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Fecha y hora de inicio *
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Fecha y hora de fin *
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-5 w-5" />
                  Productos en Oferta ({variants.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowVariantSelector(true)
                    searchAvailableVariants()
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-gray-500">
                    No hay productos en esta oferta
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVariantSelector(true)
                      searchAvailableVariants()
                    }}
                    className="mt-4 text-sm text-blue-600 hover:underline"
                  >
                    Agregar productos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {variants.map((variant) => (
                    <div
                      key={variant.variantId}
                      className="flex items-center gap-4 rounded-lg border p-3"
                    >
                      {variant.imageUrl && (
                        <div className="relative h-12 w-12 overflow-hidden rounded">
                          <Image
                            src={variant.imageUrl}
                            alt={variant.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{variant.productName}</p>
                        <p className="text-sm text-gray-500">SKU: {variant.variantSku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">
                          S/{variant.originalPrice.toFixed(2)}
                        </p>
                        <input
                          type="number"
                          value={variant.offerPrice}
                          onChange={(e) =>
                            updateVariantPrice(variant.variantId, parseFloat(e.target.value) || 0)
                          }
                          step="0.01"
                          min="0"
                          className="w-24 rounded border px-2 py-1 text-right text-lg font-bold text-green-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Stock límite</label>
                        <input
                          type="number"
                          value={variant.stockLimit ?? ''}
                          onChange={(e) =>
                            updateVariantStockLimit(
                              variant.variantId,
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                          min="1"
                          placeholder="∞"
                          className="w-20 rounded border px-2 py-1 text-center"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.variantId)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visual Config */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Zap className="h-5 w-5" />
                Configuración Visual
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Texto del Badge
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="Ej: FLASH -25%"
                    maxLength={20}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Color del Badge
                  </label>
                  <div className="flex gap-2">
                    {badgeColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setBadgeColor(color.value)}
                        className={`h-8 w-8 rounded-full border-2 ${
                          badgeColor === color.value
                            ? 'border-gray-900'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                {badgeText && (
                  <div>
                    <label className="mb-1 block text-sm text-gray-500">Vista previa:</label>
                    <span
                      className="inline-block rounded px-3 py-1 text-sm font-bold text-white"
                      style={{ backgroundColor: badgeColors.find((c) => c.value === badgeColor)?.hex }}
                    >
                      {badgeText}
                    </span>
                  </div>
                )}

                <div className="space-y-3 border-t pt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showCountdown}
                      onChange={(e) => setShowCountdown(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Mostrar contador regresivo</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showStockIndicator}
                      onChange={(e) => setShowStockIndicator(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Mostrar indicador de stock</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showSavings}
                      onChange={(e) => setShowSavings(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Mostrar ahorro</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Estado</h3>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Oferta activa</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Destacar en home</span>
                </label>
              </div>
            </div>

            {/* Stats (only for existing offers) */}
            {!isNew && (
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold">Estadísticas</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Unidades vendidas</span>
                    <span className="font-medium">{stats.totalSold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ingresos</span>
                    <span className="font-medium">S/{stats.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ahorro clientes</span>
                    <span className="font-medium text-green-600">
                      S/{stats.totalSavings.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isNew ? 'Crear Oferta' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Variant Selector Modal */}
      {showVariantSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Agregar Productos</h3>
              <button
                onClick={() => {
                  setShowVariantSelector(false)
                  setSearchVariant('')
                  setSearchError('')
                  setAvailableVariants([])
                }}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchVariant}
                  onChange={(e) => {
                    setSearchVariant(e.target.value)
                    setSearchError('')
                    // Auto-buscar después de 2 caracteres
                    if (e.target.value.length >= 2) {
                      searchAvailableVariants(e.target.value)
                    } else {
                      setAvailableVariants([])
                    }
                  }}
                  placeholder="Escribe para buscar productos..."
                  className="w-full rounded-lg border px-3 py-2 pr-10"
                  autoFocus
                />
                {loadingVariants && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Busca por nombre de producto, SKU o atributos (color, talla, etc.)
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 pt-0">
              {searchError ? (
                <div className="py-8 text-center">
                  <p className="text-red-500">{searchError}</p>
                  <button
                    onClick={() => searchAvailableVariants(searchVariant)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Reintentar
                  </button>
                </div>
              ) : searchVariant.length < 2 ? (
                <p className="py-8 text-center text-gray-500">
                  Escribe al menos 2 caracteres para buscar
                </p>
              ) : availableVariants.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  {loadingVariants ? 'Buscando...' : 'No se encontraron productos'}
                </p>
              ) : (
                <div className="space-y-2">
                  {availableVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
                    >
                      {variant.imageUrl ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded bg-gray-100">
                          <Image
                            src={variant.imageUrl}
                            alt={variant.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{variant.productName}</p>
                        {variant.attributes && (
                          <p className="text-sm text-blue-600 truncate">{variant.attributes}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          SKU: {variant.sku} · Stock: {variant.stock}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">S/{variant.price.toFixed(2)}</p>
                        <button
                          onClick={() => addVariant(variant)}
                          className="mt-1 rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          + Agregar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

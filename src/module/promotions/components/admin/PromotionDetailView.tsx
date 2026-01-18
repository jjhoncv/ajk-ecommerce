'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Calendar,
  Package,
  Plus,
  Save,
  Tag,
  Trash2,
  X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { type Promotion, type PromotionVariantWithInfo } from '../../service/promotion/types'

interface PromotionDetailViewProps {
  promotion: Promotion | null
  variants: PromotionVariantWithInfo[]
}

export function PromotionDetailView({
  promotion,
  variants: initialVariants
}: PromotionDetailViewProps) {
  const router = useRouter()
  const isNew = !promotion

  // Form state
  const [name, setName] = useState(promotion?.name || '')
  const [description, setDescription] = useState(promotion?.description || '')
  const [discountType, setDiscountType] = useState<'fixed_amount' | 'percentage'>(
    promotion?.discountType || 'percentage'
  )
  const [discountValue, setDiscountValue] = useState(promotion?.discountValue?.toString() || '')
  const [startDate, setStartDate] = useState(
    promotion?.startDate
      ? new Date(promotion.startDate).toISOString().slice(0, 16)
      : ''
  )
  const [endDate, setEndDate] = useState(
    promotion?.endDate
      ? new Date(promotion.endDate).toISOString().slice(0, 16)
      : ''
  )
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(
    promotion?.minPurchaseAmount?.toString() || ''
  )
  const [isActive, setIsActive] = useState(promotion?.isActive === 1)

  const [variants, setVariants] = useState<PromotionVariantWithInfo[]>(initialVariants)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Add variant modal state
  const [showAddVariant, setShowAddVariant] = useState(false)
  const [newVariantSku, setNewVariantSku] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState('')
  const [newVariantStock, setNewVariantStock] = useState('')
  const [addingVariant, setAddingVariant] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const handleSave = async () => {
    if (!name || !discountValue || !startDate || !endDate) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setSaving(true)
    setError('')

    try {
      const data = {
        name,
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        startDate,
        endDate,
        minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : null,
        isActive
      }

      const url = isNew
        ? '/api/admin/promotions'
        : `/api/admin/promotions/${promotion.id}`

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        if (isNew && result.promotion) {
          router.push(`/admin/promotions/${result.promotion.id}`)
        } else {
          router.refresh()
        }
      } else {
        const result = await response.json()
        setError(result.error || 'Error al guardar')
      }
    } catch (err) {
      setError('Error al guardar la promoción')
    } finally {
      setSaving(false)
    }
  }

  const handleSearchVariant = async () => {
    if (!newVariantSku.trim()) return

    setSearching(true)
    try {
      const response = await fetch(`/api/admin/products/search?sku=${encodeURIComponent(newVariantSku)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.variants || [])
      }
    } catch (err) {
      console.error('Error searching:', err)
    } finally {
      setSearching(false)
    }
  }

  const handleAddVariant = async (variantId: number, variantInfo: any) => {
    if (!promotion) return

    setAddingVariant(true)
    try {
      const response = await fetch(`/api/admin/promotions/${promotion.id}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          promotionPrice: newVariantPrice ? parseFloat(newVariantPrice) : null,
          stockLimit: newVariantStock ? parseInt(newVariantStock) : variantInfo.stock
        })
      })

      if (response.ok) {
        setVariants([
          ...variants,
          {
            variantId,
            promotionPrice: newVariantPrice ? parseFloat(newVariantPrice) : null,
            stockLimit: newVariantStock ? parseInt(newVariantStock) : variantInfo.stock,
            createdAt: new Date(),
            variant: variantInfo
          }
        ])
        setShowAddVariant(false)
        setNewVariantSku('')
        setNewVariantPrice('')
        setNewVariantStock('')
        setSearchResults([])
      }
    } catch (err) {
      console.error('Error adding variant:', err)
    } finally {
      setAddingVariant(false)
    }
  }

  const handleRemoveVariant = async (variantId: number) => {
    if (!promotion) return
    if (!confirm('¿Eliminar esta variante de la promoción?')) return

    try {
      const response = await fetch(
        `/api/admin/promotions/${promotion.id}/variants?variantId=${variantId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        setVariants(variants.filter((v) => v.variantId !== variantId))
      }
    } catch (err) {
      console.error('Error removing variant:', err)
    }
  }

  const formatPrice = (price: number) => `S/${price.toFixed(2)}`

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basic info */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Tag className="h-4 w-4" />
              Información básica
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Nombre *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Cyber Monday 2026"
                  className="text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción de la promoción..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Tipo de descuento *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as 'fixed_amount' | 'percentage')
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed_amount">Monto fijo (S/)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Valor del descuento *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {discountType === 'percentage' ? '%' : 'S/'}
                    </span>
                    <Input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="0"
                      className="pl-8 text-sm"
                      step={discountType === 'percentage' ? '1' : '0.01'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4" />
              Período de vigencia
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Fecha inicio *
                </label>
                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Fecha fin *
                </label>
                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          {!isNew && (
            <div className="rounded-lg border bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Package className="h-4 w-4" />
                  Productos en promoción ({variants.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddVariant(true)}
                  className="h-8"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar
                </Button>
              </div>

              {variants.length > 0 ? (
                <div className="space-y-2">
                  {variants.map((pv) => (
                    <div
                      key={pv.variantId}
                      className="flex items-center justify-between rounded-lg border bg-gray-50 p-2"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-medium">{pv.variant.productName}</div>
                        <div className="text-xs text-gray-500">
                          SKU: {pv.variant.sku} | Precio: {formatPrice(pv.variant.price)}
                          {pv.promotionPrice && (
                            <span className="ml-2 text-green-600">
                              → {formatPrice(pv.promotionPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Stock promo: {pv.stockLimit}
                        </span>
                        <button
                          onClick={() => handleRemoveVariant(pv.variantId)}
                          className="rounded p-1 text-red-500 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-gray-500">
                  No hay productos en esta promoción
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Estado</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">Promoción activa</span>
            </label>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Condiciones</h3>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Compra mínima
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  S/
                </span>
                <Input
                  type="number"
                  value={minPurchaseAmount}
                  onChange={(e) => setMinPurchaseAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8 text-sm"
                  step="0.01"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Dejar en blanco si no hay mínimo
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <Button onClick={handleSave} disabled={saving} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Guardando...' : isNew ? 'Crear promoción' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </div>

      {/* Add variant modal */}
      {showAddVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Agregar producto</h3>
              <button
                onClick={() => {
                  setShowAddVariant(false)
                  setSearchResults([])
                  setNewVariantSku('')
                }}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Buscar por SKU
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newVariantSku}
                    onChange={(e) => setNewVariantSku(e.target.value)}
                    placeholder="Ingresa el SKU..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSearchVariant}
                    disabled={searching}
                    variant="outline"
                  >
                    {searching ? '...' : 'Buscar'}
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {searchResults.map((v) => {
                    const alreadyAdded = variants.some((pv) => pv.variantId === v.id)
                    return (
                      <div
                        key={v.id}
                        className={`flex items-center justify-between rounded-lg border p-2 ${
                          alreadyAdded ? 'bg-gray-100 opacity-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">{v.productName}</div>
                          <div className="text-xs text-gray-500">
                            SKU: {v.sku} | {formatPrice(v.price)}
                          </div>
                        </div>
                        {!alreadyAdded && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAddVariant(v.id, {
                                id: v.id,
                                sku: v.sku,
                                price: v.price,
                                stock: v.stock,
                                productId: v.productId,
                                productName: v.productName
                              })
                            }
                            disabled={addingVariant}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                        {alreadyAdded && (
                          <span className="text-xs text-gray-500">Ya agregado</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3 border-t pt-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Precio promocional (opcional)
                    </label>
                    <Input
                      type="number"
                      value={newVariantPrice}
                      onChange={(e) => setNewVariantPrice(e.target.value)}
                      placeholder="Dejar vacío para usar descuento general"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Stock para promoción
                    </label>
                    <Input
                      type="number"
                      value={newVariantStock}
                      onChange={(e) => setNewVariantStock(e.target.value)}
                      placeholder="Stock disponible para la promoción"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { Button } from '@/module/shared/components/Form/Input/Button'
import { Input } from '@/module/shared/components/Form/Input/Input'
import {
  Calendar,
  Copy,
  RefreshCw,
  Save,
  Ticket,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Coupon {
  id: number
  name: string
  code: string
  description?: string | null
  discountType: 'fixed_amount' | 'percentage'
  discountValue: number
  startDate: Date
  endDate: Date
  minPurchaseAmount?: number | null
  maxDiscountAmount?: number | null
  usageLimit?: number | null
  usageLimitPerCustomer?: number | null
  usedCount?: number | null
  isActive?: number | null
  applicableTo?: string | null
  applicableIds?: number[] | null
}

interface CouponUsage {
  id: number
  couponId: number
  customerId: number
  orderId: number
  discountAmount: number
  usedAt: Date
}

interface CouponDetailAdminProps {
  coupon: Coupon | null
  usages: CouponUsage[]
}

export function CouponDetailAdmin({
  coupon,
  usages
}: CouponDetailAdminProps) {
  const router = useRouter()
  const isNew = !coupon

  // Form state
  const [name, setName] = useState(coupon?.name || '')
  const [code, setCode] = useState(coupon?.code || '')
  const [description, setDescription] = useState(coupon?.description || '')
  const [discountType, setDiscountType] = useState<'fixed_amount' | 'percentage'>(
    coupon?.discountType || 'percentage'
  )
  const [discountValue, setDiscountValue] = useState(coupon?.discountValue?.toString() || '')
  const [startDate, setStartDate] = useState(
    coupon?.startDate
      ? new Date(coupon.startDate).toISOString().slice(0, 16)
      : ''
  )
  const [endDate, setEndDate] = useState(
    coupon?.endDate
      ? new Date(coupon.endDate).toISOString().slice(0, 16)
      : ''
  )
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(
    coupon?.minPurchaseAmount?.toString() || ''
  )
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    coupon?.maxDiscountAmount?.toString() || ''
  )
  const [usageLimit, setUsageLimit] = useState(coupon?.usageLimit?.toString() || '')
  const [usageLimitPerCustomer, setUsageLimitPerCustomer] = useState(
    coupon?.usageLimitPerCustomer?.toString() || ''
  )
  const [isActive, setIsActive] = useState(coupon?.isActive === 1)
  const [applicableTo, setApplicableTo] = useState(coupon?.applicableTo || 'all')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [generatingCode, setGeneratingCode] = useState(false)

  const generateCode = async () => {
    setGeneratingCode(true)
    try {
      // Generate a random code
      const prefix = name ? name.substring(0, 4).toUpperCase().replace(/\s/g, '') : 'COUP'
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase()
      setCode(`${prefix}-${randomSuffix}`)
    } finally {
      setGeneratingCode(false)
    }
  }

  const copyCode = async () => {
    if (code) {
      await navigator.clipboard.writeText(code)
    }
  }

  const handleSave = async () => {
    if (!name || !code || !discountValue || !startDate || !endDate) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setSaving(true)
    setError('')

    try {
      const data = {
        name,
        code: code.toUpperCase(),
        description: description || null,
        discountType,
        discountValue: parseFloat(discountValue),
        startDate,
        endDate,
        minPurchaseAmount: minPurchaseAmount ? parseFloat(minPurchaseAmount) : null,
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        usageLimitPerCustomer: usageLimitPerCustomer ? parseInt(usageLimitPerCustomer) : null,
        isActive,
        applicableTo
      }

      const url = isNew
        ? '/api/admin/coupons'
        : `/api/admin/coupons/${coupon.id}`

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        if (isNew && result.coupon) {
          router.push(`/admin/coupons/${result.coupon.id}`)
        } else {
          router.refresh()
        }
      } else {
        const result = await response.json()
        setError(result.error || 'Error al guardar')
      }
    } catch (err) {
      setError('Error al guardar el cupón')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price: number | string | null | undefined) => {
    const num = Number(price) || 0
    return `S/${num.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic info */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Ticket className="h-4 w-4" />
              Información del cupón
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Nombre *
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Descuento de bienvenida"
                  className="text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Código del cupón *
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Ej: BIENVENIDO20"
                    className="flex-1 font-mono text-sm uppercase"
                  />
                  <Button
                    type="button"
                    outline
                    onClick={generateCode}
                    disabled={generatingCode}
                    className="px-3"
                  >
                    <RefreshCw className={`h-4 w-4 ${generatingCode ? 'animate-spin' : ''}`} />
                  </Button>
                  {code && (
                    <Button
                      type="button"
                      outline
                      onClick={copyCode}
                      className="px-3"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción interna del cupón..."
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
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Fecha fin *
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Usage history - only for existing coupons */}
          {!isNew && usages.length > 0 && (
            <div className="rounded-lg border bg-white p-4">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                Historial de uso ({usages.length})
              </h3>

              <div className="max-h-48 space-y-2 overflow-y-auto">
                {usages.map((usage) => (
                  <div
                    key={usage.id}
                    className="flex items-center justify-between rounded border bg-gray-50 p-2 text-xs"
                  >
                    <div>
                      <span className="font-medium">Orden #{usage.orderId}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-500">Cliente #{usage.customerId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-green-600">
                        -{formatPrice(usage.discountAmount)}
                      </span>
                      <span className="text-gray-400">
                        {formatDate(usage.usedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Estado</h3>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">Cupón activo</span>
            </label>
            {!isNew && (
              <div className="mt-3 rounded bg-gray-50 p-2 text-xs text-gray-600">
                Usado: {coupon.usedCount || 0} veces
                {coupon.usageLimit && <span> / {coupon.usageLimit} máx</span>}
              </div>
            )}
          </div>

          {/* Limits */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Límites de uso</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Usos totales
                </label>
                <Input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="Sin límite"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Usos por cliente
                </label>
                <Input
                  type="number"
                  value={usageLimitPerCustomer}
                  onChange={(e) => setUsageLimitPerCustomer(e.target.value)}
                  placeholder="Sin límite"
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold">Condiciones</h3>
            <div className="space-y-3">
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
              </div>
              {discountType === 'percentage' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Descuento máximo
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      S/
                    </span>
                    <Input
                      type="number"
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(e.target.value)}
                      placeholder="Sin límite"
                      className="pl-8 text-sm"
                      step="0.01"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Aplicable a
                </label>
                <select
                  value={applicableTo}
                  onChange={(e) => setApplicableTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">Todos los productos</option>
                  <option value="products">Productos específicos</option>
                  <option value="categories">Categorías específicas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border bg-white p-4">
            <Button type="button" onClick={handleSave} disabled={saving} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Guardando...' : isNew ? 'Crear cupón' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

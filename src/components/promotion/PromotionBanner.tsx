import { getGradientByType } from '@/components/promotion/Promotion.helpers'
import { type Promotion } from '@/services/promotion/types'
import React from 'react'

interface PromotionBannerProps {
  promotion: Promotion
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({ promotion }) => {
  // Función para obtener el icono según el tipo
  const getIconByType = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'cyber':
        return '🚀'
      case 'liquidacion':
        return '🔥'
      case 'oferta':
        return '⚡'
      case 'descuento':
        return '💎'
      default:
        return '🎯'
    }
  }

  // Formatear fechas
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'short'
    })
  }

  // Calcular días restantes
  const getDaysRemaining = (): number | null => {
    if (promotion.endDate === '') return null
    const now = new Date()
    const endDate = new Date(promotion.endDate)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysRemaining = getDaysRemaining()
  const gradientClass = getGradientByType(promotion.type)
  const icon = getIconByType(promotion.type)

  return (
    <div
      className={`relative mb-8 overflow-hidden rounded-2xl ${gradientClass} shadow-2xl`}
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5"></div>

      {/* Contenido principal */}
      <div className="relative px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          {/* Lado izquierdo */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <div>
                <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  {promotion.type}
                </span>
              </div>
            </div>

            <h2 className="mb-2 text-3xl font-bold leading-tight md:text-4xl">
              {promotion.name}
            </h2>

            <p className="mb-4 max-w-2xl text-lg text-white/90 md:text-xl">
              {promotion.description}
            </p>

            {/* Descuento destacado */}
            {promotion.discountType === 'percentage' && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-5xl font-black text-yellow-300 md:text-6xl">
                  {promotion.discountValue}%
                </span>
                <span className="text-xl font-semibold">DE DESCUENTO</span>
              </div>
            )}

            {promotion.discountType === 'fixed_amount' && (
              <div className="mb-4 flex items-center gap-2">
                <span className="text-5xl font-black text-yellow-300 md:text-6xl">
                  S/{promotion.discountValue}
                </span>
                <span className="text-xl font-semibold">DE DESCUENTO</span>
              </div>
            )}
          </div>

          {/* Lado derecho - Contador */}
          {daysRemaining != null && daysRemaining > 0 && (
            <div className="hidden flex-col items-center rounded-xl border border-white/20 bg-white/15 p-6 backdrop-blur-sm md:flex">
              <div className="text-center">
                <div className="mb-1 text-4xl font-black text-yellow-300">
                  {daysRemaining}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider">
                  {daysRemaining === 1 ? 'Día' : 'Días'}
                </div>
                <div className="mt-1 text-xs text-white/80">Restantes</div>
              </div>

              {promotion.endDate !== '' && (
                <div className="mt-4 text-center">
                  <div className="mb-1 text-xs uppercase tracking-wider text-white/70">
                    Hasta
                  </div>
                  <div className="text-sm font-semibold">
                    {formatDate(promotion.endDate)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Barra inferior para móvil */}
        <div className="mt-6 flex items-center justify-between rounded-lg bg-white/10 p-3 backdrop-blur-sm md:hidden">
          {daysRemaining !== null && daysRemaining > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-yellow-300">
                {daysRemaining}
              </span>
              <span className="text-sm font-semibold">
                {daysRemaining === 1 ? 'día restante' : 'días restantes'}
              </span>
            </div>
          )}

          {promotion.endDate !== '' && (
            <div className="text-right">
              <div className="text-xs text-white/70">Hasta</div>
              <div className="text-sm font-semibold">
                {formatDate(promotion.endDate)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Efecto de brillo animado */}
      <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
    </div>
  )
}

export default PromotionBanner

import { getGradientByType } from '@/components/promotion/Promotion.helpers'
import { type Promotion } from '@/services/promotion/types'
import React from 'react'

interface PromotionBannerProps {
  promotion: Promotion
  size?: 'small' | 'medium' | 'large'
}

const PromotionBanner: React.FC<PromotionBannerProps> = ({
  promotion,
  size = 'large'
}) => {
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

  // Tamaños configurados
  const sizeClasses = {
    small: {
      container: 'mb-4',
      icon: 'text-xl',
      badge: 'text-xs px-2 py-0.5',
      title: 'text-lg font-bold',
      description: 'text-sm !mb-0',
      discountValue: 'text-2xl',
      discountText: 'text-sm',
      counterContainer: 'p-3',
      counterDays: 'text-xl',
      counterText: 'text-xs',
      mobileBar: 'p-2'
    },
    medium: {
      container: 'rounded-xl mb-6',
      icon: 'text-2xl',
      badge: 'text-xs px-3 py-1',
      title: 'text-2xl font-bold',
      description: 'text-base',
      discountValue: 'text-4xl',
      discountText: 'text-lg',
      counterContainer: 'p-4',
      counterDays: 'text-3xl',
      counterText: 'text-sm',
      mobileBar: 'p-3'
    },
    large: {
      container: 'mb-4',
      icon: 'text-3xl',
      badge: 'text-xs px-3 py-1',
      title: 'text-3xl md:text-4xl font-bold',
      description: 'text-lg md:text-xl',
      discountValue: 'text-5xl md:text-6xl',
      discountText: 'text-xl',
      counterContainer: 'p-6',
      counterDays: 'text-4xl',
      counterText: 'text-sm',
      mobileBar: 'p-3'
    }
  }

  const currentSize = sizeClasses[size]

  return (
    <div
      className={`relative overflow-hidden ${currentSize.container} ${gradientClass} shadow-lg`}
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5"></div>

      {/* Contenido principal */}
      <div className="relative mx-auto flex max-w-screen-4xl px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          {/* Lado izquierdo */}
          <div className="flex-1">
            {size !== 'small' && (
              <div className="mb-2 flex items-center gap-2">
                <span className={currentSize.icon}>{icon}</span>
                <div>
                  <span
                    className={`inline-block rounded-full bg-white/20 ${currentSize.badge} font-semibold uppercase tracking-wider backdrop-blur-sm`}
                  >
                    {promotion.type}
                  </span>
                </div>
              </div>
            )}

            <h2 className={`mb-1 ${currentSize.title} leading-tight`}>
              {promotion.name}
            </h2>

            <p
              className={`mb-3 max-w-2xl ${currentSize.description} text-white/90`}
            >
              {promotion.description}
            </p>

            {size !== 'small' && (
              <>
                {/* Descuento destacado */}
                {promotion.discountType === 'percentage' && (
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`${currentSize.discountValue} font-black text-yellow-300`}
                    >
                      {promotion.discountValue}%
                    </span>
                    <span
                      className={`${currentSize.discountText} font-semibold`}
                    >
                      DE DESCUENTO
                    </span>
                  </div>
                )}

                {promotion.discountType === 'fixed_amount' && (
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`${currentSize.discountValue} font-black text-yellow-300`}
                    >
                      S/{promotion.discountValue}
                    </span>
                    <span
                      className={`${currentSize.discountText} font-semibold`}
                    >
                      DE DESCUENTO
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Lado derecho - Contador */}
          {daysRemaining != null && daysRemaining > 0 && size !== 'small' && (
            <div
              className={`hidden flex-col items-center rounded-lg border border-white/20 bg-white/15 ${currentSize.counterContainer} backdrop-blur-sm md:flex`}
            >
              <div className="text-center">
                <div
                  className={`mb-1 font-black text-yellow-300 ${currentSize.counterDays}`}
                >
                  {daysRemaining}
                </div>
                <div
                  className={`${currentSize.counterText} font-semibold uppercase tracking-wider`}
                >
                  {daysRemaining === 1 ? 'Día' : 'Días'}
                </div>
                <div className="mt-1 text-xs text-white/80">Restantes</div>
              </div>

              {promotion.endDate !== '' && (
                <div className="mt-3 text-center">
                  <div className="mb-1 text-xs uppercase tracking-wider text-white/70">
                    Hasta
                  </div>
                  <div className={`${currentSize.counterText} font-semibold`}>
                    {formatDate(promotion.endDate)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Barra inferior para móvil */}
        {daysRemaining !== null && daysRemaining > 0 && (
          <div
            className={`mt-4 flex items-center justify-between rounded-md bg-white/10 ${currentSize.mobileBar} backdrop-blur-sm md:hidden`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-yellow-300 ${size === 'small' ? 'text-xl' : 'text-2xl'}`}
              >
                {daysRemaining}
              </span>
              <span className={`${currentSize.counterText} font-semibold`}>
                {daysRemaining === 1 ? 'día restante' : 'días restantes'}
              </span>
            </div>

            {promotion.endDate !== '' && (
              <div className="text-right">
                <div className="text-xs text-white/70">Hasta</div>
                <div className={`${currentSize.counterText} font-semibold`}>
                  {formatDate(promotion.endDate)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Efecto de brillo animado */}
      {size !== 'small' && (
        <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      )}
    </div>
  )
}

export default PromotionBanner

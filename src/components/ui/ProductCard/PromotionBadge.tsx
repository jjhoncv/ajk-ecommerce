// PromotionBadge.tsx
import { type FC } from 'react'

interface PromotionBadgeProps {
  prefix: 'Cyber' | 'Liquidación' | 'Ofertas' | string
  name: string
  discount?: string
}

export const PromotionBadge: FC<PromotionBadgeProps> = ({
  prefix,
  name,
  discount
}) => {
  const getBadgeStyles = (promotionType: string): string => {
    console.log('promotionType', promotionType)

    switch (promotionType.toLowerCase()) {
      case 'cyber':
        return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white'
      case 'liquidación':
        return 'bg-gradient-to-r from-red-600 to-red-800 text-white'
      case 'ofertas':
        return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'
    }
  }

  return (
    <div
      className={`mr-0.5 inline-flex h-[16px] min-w-0 max-w-fit items-center justify-center rounded-sm px-1 text-[10px] font-bold leading-[10px] shadow-sm ${getBadgeStyles(prefix)} `}
    >
      <span className="uppercase tracking-wide">
        {name}
        {discount != null && (
          <span className="ml-1 font-extrabold">{discount}</span>
        )}
      </span>
    </div>
  )
}

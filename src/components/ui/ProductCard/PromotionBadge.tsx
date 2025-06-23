// PromotionBadge.tsx
import { getGradientByType } from '@/components/promotion/Promotion.helpers'
import { type FC } from 'react'

interface PromotionBadgeProps {
  type: 'cyber' | 'liquidacion' | 'oferta' | string
  name: string
  discount?: string
}

export const PromotionBadge: FC<PromotionBadgeProps> = ({
  type,
  name,
  discount
}) => {
  // const getBadgeStyles = (promotionType: string): string => {
  //   switch (promotionType.toLowerCase()) {
  //     case 'cyber':
  //       return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white'
  //     case 'liquidacion':
  //       return 'bg-gradient-to-r from-red-600 to-red-800 text-white'
  //     case 'oferta':
  //       return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
  //     default:
  //       return 'bg-gradient-to-r from-gray-600 to-gray-800 text-white'
  //   }
  // }

  return (
    <div
      className={`mr-0.5 inline-flex h-[16px] min-w-0 max-w-fit items-center justify-center rounded-sm px-1 text-[10px] font-bold leading-[10px] shadow-sm ${getGradientByType(type)} `}
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

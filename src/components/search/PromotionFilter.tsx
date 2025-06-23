'use client'
import { type AvailableFilters } from '@/backend/filters'
import { type ProductSearchFilters } from '@/backend/search'
import CollapsibleSection from '@/components/ui/CollapsibleSection'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface PromotionFilterProps {
  availableFilters: AvailableFilters
  currentFilters: ProductSearchFilters
}

const PromotionFilter: React.FC<PromotionFilterProps> = ({
  availableFilters,
  currentFilters
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  if (
    !availableFilters?.promotions ||
    availableFilters.promotions.length === 0
  ) {
    return null
  }

  const handlePromotionChange = (promotionId: number, checked: boolean) => {
    const currentPromotions = currentFilters.promotionIds || []
    const newPromotions = checked
      ? [...currentPromotions, promotionId]
      : currentPromotions.filter((id) => id !== promotionId)

    const params = new URLSearchParams(searchParams.toString())

    if (newPromotions.length > 0) {
      params.set('promotions', newPromotions.join(','))
    } else {
      params.delete('promotions')
    }

    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cyber':
        return 'bg-purple-100 text-purple-800'
      case 'liquidacion':
        return 'bg-red-100 text-red-800'
      case 'oferta':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <CollapsibleSection title="Promociones" className="mb-0">
      <div className="space-y-2">
        {availableFilters.promotions.map((promotion) => (
          <label
            key={promotion.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                value={promotion.id}
                checked={
                  currentFilters.promotionIds?.includes(promotion.id) || false
                }
                onChange={(e) => {
                  handlePromotionChange(promotion.id, e.target.checked)
                }}
                className="mr-2"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{promotion.name}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </CollapsibleSection>
  )
}

export default PromotionFilter

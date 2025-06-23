import { formatPrice } from '@/helpers/utils'
import { type Categories } from '@/types/domain'
import Link from 'next/link'
import { type FC } from 'react'
import { type Promotion } from './Navigation.interfaces'

interface NavigationMainProps {
  categories: Categories[]
  promotions?: Promotion[]
}

export const NavigationMain: FC<NavigationMainProps> = ({
  categories,
  promotions
}) => {
  const promotionsMap = promotions ?? []

  return (
    <nav className="flex items-center gap-8 px-6">
      {promotionsMap.length > 0 ? (
        <>
          {promotionsMap.map((promotion, key) => (
            <Link
              key={key}
              href={`/promotion/${promotion.id}`}
              className="flex items-center gap-2 text-gray-700 transition-colors duration-300 hover:text-primary"
            >
              {promotion.name}{' '}
              {promotion.type === 'fixed_amount'
                ? `- ${formatPrice(promotion.value)}`
                : `- ${promotion.value}%`}
            </Link>
          ))}
        </>
      ) : (
        <>
          {categories
            .filter((category) => category.parentId === null)
            .map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.id}`}
                className="text-gray-700 transition-colors duration-300 hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
        </>
      )}
    </nav>
  )
}

import { type Categories } from '@/types/domain'
import Link from 'next/link'
import { type FC } from 'react'
import { type Promotion } from './Navigation.interfaces'

interface NavigationMainProps {
  navCategories?: Categories[]
  promotions?: Promotion[]
}

export const NavigationMain: FC<NavigationMainProps> = ({
  navCategories,
  promotions
}) => {
  const promotionsMap = promotions ?? []
  const navCategoriesMap = navCategories ?? []

  return (
    <nav className="flex items-center gap-8 px-6">
      {promotionsMap.length > 0 && (
        <>
          {promotionsMap.map((promotion, key) => (
            <Link
              key={key}
              href={`/promotion/${promotion.slug}`}
              className="flex items-center gap-2 text-gray-700 transition-colors duration-300 hover:text-primary"
            >
              {promotion.name}
            </Link>
          ))}
        </>
      )}

      {navCategoriesMap.length > 0 && (
        <>
          {navCategoriesMap.map((category, key) => (
            <Link
              key={key}
              href={`/categoria/${category.slug}`}
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

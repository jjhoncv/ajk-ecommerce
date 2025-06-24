import CategoryService from '@/services/categories'
import PromotionService from '@/services/promotion'
import { type Categories } from '@/types/domain'
import { type FC } from 'react'
import { NavigationFullClient } from './NavigationFullClient'

interface NavigationFullProps {
  categories: Categories[]
}

export const NavigationFull: FC<NavigationFullProps> = async ({
  categories
}) => {
  const promotions = await PromotionService.getPromotions()
  const navCategories = await CategoryService.getNavCategories()
  return (
    <>
      <NavigationFullClient
        categories={categories}
        navCategories={navCategories}
        promotions={promotions}
      />
    </>
  )
}

import NavigationMini from '@/components/ui/Navigation/NavigationMini'
import CategoryService from '@/services/categories'
import { type FC } from 'react'
import { type ButtonType } from './Navigation.interfaces'
import { NavigationFull } from './NavigationFull'

interface NavigationProps {
  type?: ButtonType
}

const Navigation: FC<NavigationProps> = async ({ type = 'normal' }) => {
  const categories = await CategoryService.getAllCategories()

  // Renderizado para versión mini
  if (type === 'mini') {
    return <NavigationMini categories={categories} />
  }

  // Renderizado para versión normal
  return <NavigationFull categories={categories} />
}

export default Navigation

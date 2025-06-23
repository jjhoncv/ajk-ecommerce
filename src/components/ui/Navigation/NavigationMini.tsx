'use client'
import { type Categories } from '@/types/domain'
import { type FC } from 'react'
import { NavigationButton } from './NavigationButton'
import { NavigationSlidePage } from './NavigationSlidePage'
import { useNavigation } from './use-navigation.hook'

interface NavigationMiniProps {
  categories: Categories[]
}

const NavigationMini: FC<NavigationMiniProps> = ({ categories }) => {
  const categoriesMenu = useNavigation()

  return (
    <>
      <NavigationButton type="mini" onClick={categoriesMenu.toggle} />
      <NavigationSlidePage
        isOpen={categoriesMenu.isOpen}
        onClose={categoriesMenu.close}
        categories={categories}
      />
    </>
  )
}

export default NavigationMini

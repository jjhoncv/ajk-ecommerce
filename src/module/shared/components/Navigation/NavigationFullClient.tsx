'use client'
import { type Categories } from '@/types/domain'
import { type FC } from 'react'
import { type Promotion } from './Navigation.interfaces'
import { NavigationButton } from './NavigationButton'
import { NavigationMain } from './NavigationMain'
import { NavigationSlidePage } from './NavigationSlidePage'
import { useNavigation } from './use-navigation.hook'

interface NavigationFullClientProps {
  categories: Categories[]
  navCategories: Categories[]
  promotions?: Promotion[]
}

export const NavigationFullClient: FC<NavigationFullClientProps> = ({
  categories,
  navCategories,
  promotions
}) => {
  const categoriesMenu = useNavigation()

  return (
    <>
      <div className="border-t border-none border-gray-200 bg-gray-100">
        <div className="mx-auto max-w-screen-4xl px-12">
          <div className="flex items-center">
            <div className="relative">
              <NavigationButton type="normal" onClick={categoriesMenu.toggle} />
            </div>
            <NavigationMain
              navCategories={navCategories}
              promotions={promotions}
            />
          </div>
        </div>
      </div>
      <NavigationSlidePage
        isOpen={categoriesMenu.isOpen}
        onClose={categoriesMenu.close}
        categories={categories}
      />
    </>
  )
}

'use client'
import { type Categories } from '@/types/domain'
import { type FC } from 'react'
import { type Promotion } from './Navigation.interfaces'
import { NavigationFullClient } from './NavigationFullClient'

interface NavigationFullProps {
  categories: Categories[]
}

export const NavigationFull: FC<NavigationFullProps> = ({ categories }) => {
  const promotions: Promotion[] = [
    {
      id: 1,
      name: 'Promo 1',
      type: 'fixed_amount',
      value: 40
    },
    {
      id: 1,
      name: 'Promo 2',
      type: 'percentage',
      value: 20
    }
  ]
  return (
    <>
      <NavigationFullClient categories={categories} promotions={promotions} />
    </>
  )
}

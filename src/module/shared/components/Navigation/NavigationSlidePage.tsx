import { CategoriesMenu } from '@/module/shared/components/ui'
import SlidePage from '@/module/shared/components/SlidePage'
import { type Categories } from '@/types/domain'
import { type FC } from 'react'

interface NavigationSlidePageProps {
  isOpen: boolean
  onClose: () => void
  categories: Categories[]
}

export const NavigationSlidePage: FC<NavigationSlidePageProps> = ({
  isOpen,
  onClose,
  categories
}) => (
  <SlidePage
    isOpen={isOpen}
    onClose={onClose}
    title="Categorías"
    direction="left"
    width={400}
  >
    <CategoriesMenu categories={categories} onClose={onClose} />
  </SlidePage>
)

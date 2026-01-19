import { Menu } from 'lucide-react'
import { type FC } from 'react'
import { type ButtonType } from './Navigation.interfaces'

interface NavigationButtonProps {
  type: ButtonType
  onClick: () => void
}

export const NavigationButton: FC<NavigationButtonProps> = ({
  type,
  onClick
}) => (
  <button
    className={`flex items-center gap-2 bg-primary text-white transition-colors hover:bg-primary/90 ${
      type === 'mini' ? 'rounded-sm px-2 py-2' : 'px-6 py-3'
    }`}
    onClick={onClick}
  >
    <Menu className="h-5 w-5" />
    {type === 'normal' && <span>Categorías</span>}
  </button>
)

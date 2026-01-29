import { Heart } from 'lucide-react'
import { type JSX, type ReactNode } from 'react'
import { CartButton } from '@/module/shared/components/ui'
import ServerLogo from '@/module/shared/components/ui/ServerLogo'
import { SearchBar } from '@/module/search/components'
import ServerAuthButton from '@/module/customers/components/auth/ServerAuthButton'

interface HeaderProps {
  children?: ReactNode
  navigationType?: 'mini' | 'normal'
}

const Header = async ({
  children,
  navigationType = 'normal'
}: HeaderProps): Promise<JSX.Element> => {
  return (
    <header className="sticky top-0 z-50 border-b border-none border-gray-200 bg-white">
      <div className="mx-auto max-w-screen-4xl px-12 py-4">
        <div className="flex items-center justify-between gap-6">
          <ServerLogo showDescription={false} />
          {navigationType === 'mini' && children}

          {/* Search */}
          <SearchBar />

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center">
              <Heart className="h-6 w-6" />
              <span className="mt-1 text-xs">Wishlist</span>
            </button>
            <CartButton />
            <ServerAuthButton />
          </div>
        </div>
      </div>
      {navigationType === 'normal' && children}

      {/* <Navigation categories={categories} /> */}
    </header>
  )
}

export default Header

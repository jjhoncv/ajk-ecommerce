'use client'
import { Heart, LogOut, MapPin, ShoppingBag, User } from 'lucide-react'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import React from 'react'
import SlidePage from './SlidePage'

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
  session: Session
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, session }) => {
  const handleSignOut = async () => {
    await signOut({ redirect: false })
    onClose()
  }

  const menuItems = [
    {
      icon: <User className="h-5 w-5" />,
      label: 'Mi cuenta',
      href: '/account'
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: 'Mis pedidos',
      href: '/orders'
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: 'Mis favoritos',
      href: '/favorites'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Mis direcciones',
      href: '/addresses'
    }
  ]

  return (
    <SlidePage
      isOpen={isOpen}
      onClose={onClose}
      title="Mi cuenta"
      direction="right"
      width={320}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{session.user?.name}</p>
              <p className="text-sm text-gray-500">{session.user?.email}</p>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <nav className="mt-2">
            <ul>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
                  >
                    <span className="mr-3 text-gray-500">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center rounded-md px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </SlidePage>
  )
}

export default UserMenu

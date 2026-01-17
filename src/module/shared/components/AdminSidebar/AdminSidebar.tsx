'use client'

import { type AdminSection } from '@/types/next-auth'
import {
  ChevronDown,
  ChevronLeft,
  CreditCard,
  HouseIcon,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  StickyNote,
  Truck,
  UserPen,
  Users,
  X,
  type LucideIcon
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type JSX, useState } from 'react'

// Definición de estructura de menú con submenús
interface MenuItemConfig {
  id: string
  label: string
  icon: LucideIcon
  href?: string
  children?: Array<{
    label: string
    href: string
    sectionUrl?: string
  }>
  sectionUrl?: string
}

// Configuración del menú principal con agrupación
const menuConfig: MenuItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HouseIcon,
    href: '/admin'
  },
  {
    id: 'catalog',
    label: 'Catálogo',
    icon: Package,
    children: [
      { label: 'Productos', href: '/admin/products', sectionUrl: '/products' },
      {
        label: 'Categorías',
        href: '/admin/categories',
        sectionUrl: '/categories'
      },
      {
        label: 'Atributos',
        href: '/admin/attributes',
        sectionUrl: '/attributes'
      }
    ]
  },
  {
    id: 'content',
    label: 'Contenido',
    icon: StickyNote,
    children: [
      { label: 'Banners', href: '/admin/banners', sectionUrl: '/banners' },
      { label: 'Páginas', href: '/admin/pages', sectionUrl: '/pages' },
      { label: 'Servicios', href: '/admin/services', sectionUrl: '/services' },
      { label: 'Proyectos', href: '/admin/projects', sectionUrl: '/projects' },
      { label: 'Galería', href: '/admin/gallery', sectionUrl: '/gallery' }
    ]
  },
  {
    id: 'shippings',
    label: 'Envíos',
    icon: Truck,
    children: [
      { label: 'General', href: '/admin/shippings', sectionUrl: '/shippings' },
      { label: 'Métodos', href: '/admin/shippings/methods', sectionUrl: '/shippings' },
      { label: 'Zonas', href: '/admin/shippings/zones', sectionUrl: '/shippings' }
    ]
  },
  {
    id: 'payments',
    label: 'Pagos',
    icon: CreditCard,
    children: [
      { label: 'Métodos', href: '/admin/payments/methods', sectionUrl: '/payments' }
    ]
  },
  {
    id: 'orders',
    label: 'Órdenes',
    icon: ShoppingCart,
    href: '/admin/orders',
    sectionUrl: '/orders'
  },
  {
    id: 'users-section',
    label: 'Usuarios',
    icon: Users,
    children: [
      { label: 'Usuarios', href: '/admin/users', sectionUrl: '/users' },
      { label: 'Roles', href: '/admin/roles', sectionUrl: '/roles' }
    ]
  },
  {
    id: 'profile',
    label: 'Mi Perfil',
    icon: UserPen,
    href: '/admin/profile',
    sectionUrl: '/profile'
  }
]

interface AdminSidebarProps {
  sections: AdminSection[]
  userName: string
  userEmail: string
  userRole?: string
}

export function AdminSidebar({
  sections,
  userName,
  userEmail,
  userRole
}: AdminSidebarProps): JSX.Element {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['catalog'])

  // Verificar si el usuario tiene acceso a una sección
  const hasAccess = (sectionUrl?: string): boolean => {
    if (sectionUrl === undefined || sectionUrl === '') return true
    return sections.some((s) => s.url === sectionUrl)
  }

  // Filtrar menú según permisos
  const filteredMenu = menuConfig
    .map((item) => {
      if (item.children !== undefined && item.children.length > 0) {
        const filteredChildren = item.children.filter((child) =>
          hasAccess(child.sectionUrl)
        )
        if (filteredChildren.length === 0) return null
        return { ...item, children: filteredChildren }
      }
      if (item.sectionUrl !== undefined && item.sectionUrl !== '' && !hasAccess(item.sectionUrl)) return null
      return item
    })
    .filter(Boolean) as MenuItemConfig[]

  // Toggle menú desplegable
  const toggleMenu = (menuId: string): void => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    )
  }

  // Verificar si una ruta está activa
  const isActive = (href: string): boolean => {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href) ?? false
  }

  // Verificar si un menú padre tiene algún hijo activo
  const hasActiveChild = (children?: MenuItemConfig['children']): boolean => {
    if (children === undefined || children.length === 0) return false
    return children.some((child) => isActive(child.href))
  }

  const handleSignOut = async (): Promise<void> => {
    await signOut({ callbackUrl: '/admin' })
  }

  const SidebarContent = (): JSX.Element => (
    <div className="flex h-full flex-col">
      {/* Logo/Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        <Link href="/admin" className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="text-lg font-bold text-gray-900">AJK Admin</span>
          )}
          {isCollapsed && (
            <span className="text-lg font-bold text-gray-900">AJK</span>
          )}
        </Link>
        <button
          onClick={() => { setIsCollapsed(!isCollapsed) }}
          className="hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:block"
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {filteredMenu.map((item) => (
            <li key={item.id}>
              {item.children !== undefined && item.children.length > 0 ? (
                // Menú con submenús
                <div>
                  <button
                    onClick={() => { toggleMenu(item.id) }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      hasActiveChild(item.children)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedMenus.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenú */}
                  {!isCollapsed && expandedMenus.includes(item.id) && (
                    <ul className="mt-1 space-y-1 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => { setIsMobileOpen(false) }}
                            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                              isActive(child.href)
                                ? 'bg-blue-100 font-medium text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Menú simple
                <Link
                  href={item.href ?? '/admin'}
                  onClick={() => { setIsMobileOpen(false) }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.href ?? '/admin')
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed && (
          <div className="mb-3">
            <p className="truncate text-sm font-medium text-gray-900">
              {userName}
            </p>
            <p className="truncate text-xs text-gray-500">{userEmail}</p>
            {userRole !== undefined && userRole !== '' && (
              <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {userRole}
              </span>
            )}
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => { setIsMobileOpen(true) }}
        className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => { setIsMobileOpen(false) }}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => { setIsMobileOpen(false) }}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-gray-200 bg-white transition-all lg:block ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for main content */}
      <div
        className={`hidden lg:block ${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 transition-all`}
      />
    </>
  )
}

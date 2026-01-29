'use client'

import { type AdminSection } from '@/types/next-auth'
import {
  BadgeCheck,
  ChevronLeft,
  CreditCard,
  FolderTree,
  HouseIcon,
  Image,
  LayoutDashboard,
  List,
  LogOut,
  Menu,
  Package,
  Percent,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  Ticket,
  Truck,
  User,
  UserPen,
  Users,
  Shield,
  X,
  Zap,
  type LucideIcon
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type JSX, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// Mapeo de nombres de iconos a componentes Lucide
const iconMap: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'house': HouseIcon,
  'package': Package,
  'folder-tree': FolderTree,
  'badge': BadgeCheck,
  'badge-check': BadgeCheck,
  'list': List,
  'image': Image,
  'ticket': Ticket,
  'percent': Percent,
  'tag': Tag,
  'zap': Zap,
  'shopping-cart': ShoppingCart,
  'user': User,
  'users': Users,
  'shield': Shield,
  'star': Star,
  'truck': Truck,
  'credit-card': CreditCard,
  'settings': Settings,
  'user-circle': UserPen,
  'user-pen': UserPen
}

// Configuración de grupos/secciones del menú
const groupConfig: Record<string, { label: string; order: number }> = {
  main: { label: '', order: 0 },
  sales: { label: 'Ventas', order: 1 },
  catalog: { label: 'Catálogo', order: 2 },
  marketing: { label: 'Marketing', order: 3 },
  config: { label: 'Configuración', order: 4 },
  admin: { label: 'Administración', order: 5 },
  other: { label: 'Otros', order: 6 }
}

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

  // Ref para control de scroll
  const navRef = useRef<HTMLElement>(null)

  // Verificar si una ruta está activa
  const isActive = (url: string): boolean => {
    if (url === '' || url === '/') return pathname === '/admin'
    return pathname?.startsWith(`/admin${url}`) ?? false
  }

  // Guardar scroll en cada scroll del usuario
  const handleScroll = (): void => {
    if (navRef.current && navRef.current.scrollTop > 0) {
      sessionStorage.setItem('sidebar-scroll', navRef.current.scrollTop.toString())
    }
  }

  // Restaurar scroll cuando cambia la ruta
  useLayoutEffect(() => {
    const savedScroll = sessionStorage.getItem('sidebar-scroll')
    if (savedScroll && navRef.current) {
      navRef.current.scrollTop = parseInt(savedScroll, 10)
    }
  }, [pathname])

  // Obtener el icono para una sección
  const getIcon = (iconName?: string): LucideIcon => {
    if (!iconName) return Package
    const normalizedName = iconName.toLowerCase().replace(/_/g, '-')
    return iconMap[normalizedName] || Package
  }

  // Agrupar secciones por sectionGroup
  const groupedSections = useMemo(() => {
    // Agregar Dashboard manualmente si no está en sections
    const allSections = [...sections]
    const hasDashboard = sections.some(s => s.url === '' || s.url === '/')

    if (!hasDashboard) {
      allSections.unshift({
        id: 0,
        name: 'Dashboard',
        url: '',
        image: 'layout-dashboard',
        displayOrder: 0,
        sectionGroup: 'main'
      })
    }

    // Agrupar por sectionGroup
    const groups: Record<string, AdminSection[]> = {}

    allSections.forEach(section => {
      const group = section.sectionGroup || 'other'
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(section)
    })

    // Ordenar secciones dentro de cada grupo
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    })

    // Convertir a array ordenado por grupo
    return Object.entries(groups)
      .map(([groupKey, items]) => ({
        key: groupKey,
        label: groupConfig[groupKey]?.label || groupKey,
        order: groupConfig[groupKey]?.order || 99,
        items
      }))
      .sort((a, b) => a.order - b.order)
      .filter(group => group.items.length > 0)
  }, [sections])

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
      <nav
        ref={navRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4"
      >
        <div className="space-y-6">
          {groupedSections.map((group) => (
            <div key={group.key}>
              {/* Group Header */}
              {group.label && !isCollapsed && (
                <div className="mb-2 px-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {group.label}
                  </span>
                </div>
              )}
              {group.label && isCollapsed && (
                <div className="mb-2 flex justify-center">
                  <div className="h-px w-8 bg-gray-200" />
                </div>
              )}

              {/* Group Items */}
              <ul className="space-y-1">
                {group.items.map((section) => {
                  const Icon = getIcon(section.image)
                  const href = section.url === '' || section.url === '/'
                    ? '/admin'
                    : `/admin${section.url}`
                  const itemIsActive = isActive(section.url || '')

                  return (
                    <li key={section.id}>
                      <Link
                        href={href}
                        data-active={itemIsActive ? 'true' : undefined}
                        onClick={(e) => {
                          if (itemIsActive) {
                            e.preventDefault()
                            return
                          }
                          setIsMobileOpen(false)
                        }}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          itemIsActive
                            ? 'bg-blue-50 text-blue-700 cursor-default'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span>{section.name}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
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

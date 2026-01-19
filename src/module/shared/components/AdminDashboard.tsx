'use client'

import {
  type DashboardMetrics,
  type LowStockProduct,
  type RecentOrder,
  type TopSellingProduct
} from '@/module/shared/services/dashboard'
import { type AdminSection } from '@/types/next-auth'
import {
  AlertTriangle,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users
} from 'lucide-react'
import { type User } from 'next-auth'
import { type JSX } from 'react'
import {
  LowStockProductsList,
  MetricCard,
  RecentOrdersList,
  TopSellingProductsList
} from './Dashboard'
import { PageUI } from './Page/Page'
import { PageTitle } from './Page/PageTitle'

interface AdminDashboardProps {
  user: User
  metrics: DashboardMetrics
  recentOrders: RecentOrder[]
  lowStockProducts: LowStockProduct[]
  topSellingProducts: TopSellingProduct[]
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount)
}

function hasSection(sections: AdminSection[] | undefined, sectionName: string): boolean {
  if (!sections) return false
  return sections.some((s) => s.name === sectionName || s.url === `/${sectionName}`)
}

export function AdminDashboard({
  user,
  metrics,
  recentOrders,
  lowStockProducts,
  topSellingProducts
}: AdminDashboardProps): JSX.Element {
  const sections = user.sections
  const isSuperAdmin = user.roleId === 1

  // Determinar qué secciones puede ver el usuario
  const canSeeOrders = isSuperAdmin || hasSection(sections, 'orders')
  const canSeeProducts = isSuperAdmin || hasSection(sections, 'products')
  const canSeeUsers = isSuperAdmin || hasSection(sections, 'users')

  // Si no tiene acceso a ninguna sección relevante, mostrar mensaje
  const hasAnyDashboardSection = canSeeOrders || canSeeProducts || canSeeUsers

  if (!hasAnyDashboardSection) {
    return (
      <PageUI
        title={<PageTitle title="Dashboard" />}
        subtitle={`Bienvenido, ${user.name}`}
        breadcrumb={[{ label: 'Dashboard' }]}
      >
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">
            No tienes secciones asignadas con estadísticas disponibles.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Usa el menú lateral para acceder a las secciones disponibles.
          </p>
        </div>
      </PageUI>
    )
  }

  return (
    <PageUI
      title={<PageTitle title="Dashboard" />}
      subtitle={`Bienvenido, ${user.name}`}
      breadcrumb={[{ label: 'Dashboard' }]}
    >
      {/* Primary Metrics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {canSeeOrders && (
          <>
            <MetricCard
              title="Ventas de Hoy"
              value={formatCurrency(metrics.salesToday)}
              icon={DollarSign}
              color="green"
            />
            <MetricCard
              title="Ventas del Mes"
              value={formatCurrency(metrics.salesThisMonth)}
              icon={TrendingUp}
              color="blue"
            />
            <MetricCard
              title="Órdenes Pendientes"
              value={metrics.pendingOrders}
              icon={ShoppingCart}
              color="yellow"
            />
          </>
        )}
        {canSeeUsers && (
          <MetricCard
            title="Nuevos Clientes (Mes)"
            value={metrics.newCustomersThisMonth}
            icon={Users}
            color="purple"
          />
        )}
      </div>

      {/* Secondary Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {canSeeProducts && (
          <>
            <MetricCard
              title="Total de Productos"
              value={metrics.totalProducts}
              icon={Package}
              color="blue"
            />
            <MetricCard
              title="Productos con Stock Bajo"
              value={metrics.lowStockProducts}
              icon={AlertTriangle}
              color={metrics.lowStockProducts > 0 ? 'red' : 'green'}
            />
          </>
        )}
        {canSeeOrders && (
          <MetricCard
            title="Total de Órdenes"
            value={metrics.totalOrders}
            icon={ShoppingCart}
            color="green"
          />
        )}
      </div>

      {/* Two Column Layout for Lists */}
      {(canSeeOrders || canSeeProducts) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {canSeeOrders && <RecentOrdersList orders={recentOrders} />}
          {canSeeProducts && <LowStockProductsList products={lowStockProducts} />}
        </div>
      )}

      {/* Top Selling Products - Full Width */}
      {canSeeProducts && (
        <div className="mt-6">
          <TopSellingProductsList products={topSellingProducts} />
        </div>
      )}
    </PageUI>
  )
}

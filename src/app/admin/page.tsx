import { AdminClientWrapper } from '@/module/shared/components/admin'
import { AdminDashboard } from '@/module/shared/components/AdminDashboard'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import dashboardService from '@/module/shared/services/dashboard'
import { getServerSession } from 'next-auth'

export default async function AdminPage(): Promise<React.JSX.Element> {
  const session = await getServerSession(adminAuthOptions)

  // Si hay sesión válida con roleId, mostrar dashboard
  if (session?.user != null && session.user.roleId != null) {
    // Fetch dashboard data in parallel
    const [metrics, recentOrders, lowStockProducts, topSellingProducts] =
      await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentOrders(5),
        dashboardService.getLowStockProducts(5),
        dashboardService.getTopSellingProducts(5)
      ])

    return (
      <LayoutPageAdmin>
        <AdminDashboard
          user={session.user}
          metrics={metrics}
          recentOrders={recentOrders}
          lowStockProducts={lowStockProducts}
          topSellingProducts={topSellingProducts}
        />
      </LayoutPageAdmin>
    )
  }

  return <AdminClientWrapper />
}

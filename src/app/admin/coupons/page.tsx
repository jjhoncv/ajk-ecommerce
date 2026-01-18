import couponModel from '@/backend/coupon/Coupon.model'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'
import CouponsListAdmin from './CouponsListAdmin'

export default async function AdminCouponsPage(): Promise<JSX.Element> {
  const coupons = await couponModel.getCouponsWithStats()
  const stats = await couponModel.getCouponStats()

  if (!coupons || coupons.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Cupones" />}
          subtitle="Gestión de cupones de descuento"
          breadcrumb={[{ label: 'Cupones' }]}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay cupones registrados</p>
            <a
              href="/admin/coupons/new"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Crear primer cupón
            </a>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Cupones" />}
        subtitle="Gestión de cupones de descuento"
        breadcrumb={[{ label: 'Cupones' }]}
      >
        <CouponsListAdmin initialCoupons={coupons} stats={stats} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

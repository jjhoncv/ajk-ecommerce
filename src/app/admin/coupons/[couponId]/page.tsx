import { couponModel } from '@/module/coupons/core'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'
import CouponDetailAdmin from './CouponDetailAdmin'

interface PageProps {
  params: Promise<{ couponId: string }>
}

export default async function AdminCouponDetailPage({
  params
}: PageProps): Promise<JSX.Element> {
  const { couponId } = await params

  // Handle "new" coupon
  if (couponId === 'new') {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Nuevo Cupón" />}
          subtitle="Crear un nuevo cupón de descuento"
          breadcrumb={[
            { label: 'Cupones', href: '/admin/coupons' },
            { label: 'Nuevo' }
          ]}
        >
          <CouponDetailAdmin coupon={null} usages={[]} />
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const couponIdNum = parseInt(couponId)

  if (isNaN(couponIdNum)) {
    notFound()
  }

  const coupon = await couponModel.getCouponById(couponIdNum)
  if (!coupon) {
    notFound()
  }

  const usages = await couponModel.getCouponUsages(couponIdNum)

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={coupon.name} />}
        subtitle="Editar cupón"
        breadcrumb={[
          { label: 'Cupones', href: '/admin/coupons' },
          { label: coupon.code }
        ]}
      >
        <CouponDetailAdmin coupon={coupon} usages={usages || []} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

import { PromotionDetailView } from '@/module/promotions/components/admin'
import PromotionService from '@/module/promotions/service/promotion'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'

interface PageProps {
  params: Promise<{ promotionId: string }>
}

export default async function AdminPromotionDetailPage({
  params
}: PageProps): Promise<JSX.Element> {
  const { promotionId } = await params

  // Handle "new" promotion
  if (promotionId === 'new') {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Nueva Promoción" />}
          subtitle="Crear una nueva promoción"
          breadcrumb={[
            { label: 'Promociones', url: '/admin/promotions' },
            { label: 'Nueva' }
          ]}
        >
          <PromotionDetailView promotion={null} variants={[]} />
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const promotionIdNum = parseInt(promotionId)

  if (isNaN(promotionIdNum)) {
    notFound()
  }

  const promotion = await PromotionService.getPromotionById(promotionIdNum)
  if (!promotion) {
    notFound()
  }

  const variants = await PromotionService.getPromotionVariantsWithInfo(promotionIdNum)

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={promotion.name} />}
        subtitle="Editar promoción"
        breadcrumb={[
          { label: 'Promociones', url: '/admin/promotions' },
          { label: promotion.name }
        ]}
      >
        <PromotionDetailView promotion={promotion} variants={variants} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

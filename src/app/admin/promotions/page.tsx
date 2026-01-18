import promotionModel from '@/backend/promotion/Promotion.model'
import promotionVariantModel from '@/backend/promotion-variant/PromotionVariant.model'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'
import PromotionsListAdmin from './PromotionsListAdmin'

export default async function AdminPromotionsPage(): Promise<JSX.Element> {
  const promotions = await promotionModel.getPromotions()

  if (!promotions || promotions.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Promociones" />}
          subtitle="Gestión de promociones y descuentos"
          breadcrumb={[{ label: 'Promociones' }]}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay promociones registradas</p>
            <a
              href="/admin/promotions/new"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Crear primera promoción
            </a>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  // Get variant counts for each promotion
  const promotionsWithMetrics = await Promise.all(
    promotions.map(async (promotion) => {
      const metrics = await promotionVariantModel.getPromotionMetrics(promotion.id)
      return {
        ...promotion,
        variantCount: metrics?.totalVariants || 0,
        variantsWithStock: metrics?.variantsWithStock || 0,
        totalStockLimit: metrics?.totalStockLimit || 0
      }
    })
  )

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Promociones" />}
        subtitle="Gestión de promociones y descuentos"
        breadcrumb={[{ label: 'Promociones' }]}
      >
        <PromotionsListAdmin initialPromotions={promotionsWithMetrics} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

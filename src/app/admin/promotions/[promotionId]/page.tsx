import promotionModel from '@/backend/promotion/Promotion.model'
import promotionVariantModel from '@/backend/promotion-variant/PromotionVariant.model'
import { executeQuery } from '@/lib/db'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { notFound } from 'next/navigation'
import { type JSX } from 'react'
import PromotionDetailAdmin from './PromotionDetailAdmin'

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
            { label: 'Promociones', href: '/admin/promotions' },
            { label: 'Nueva' }
          ]}
        >
          <PromotionDetailAdmin promotion={null} variants={[]} />
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const promotionIdNum = parseInt(promotionId)

  if (isNaN(promotionIdNum)) {
    notFound()
  }

  const promotion = await promotionModel.getPromotionById(promotionIdNum)
  if (!promotion) {
    notFound()
  }

  // Get promotion variants with product info
  const variantsWithInfo = await executeQuery<any[]>({
    query: `
      SELECT
        pv.promotion_id,
        pv.variant_id,
        pv.promotion_price,
        pv.stock_limit,
        pv.created_at,
        v.id as variant_id,
        v.sku,
        v.price as variant_price,
        v.stock as variant_stock,
        v.product_id,
        p.name as product_name
      FROM promotion_variants pv
      JOIN product_variants v ON pv.variant_id = v.id
      JOIN products p ON v.product_id = p.id
      WHERE pv.promotion_id = ?
      ORDER BY p.name, v.sku
    `,
    values: [promotionIdNum]
  })

  const formattedVariants = variantsWithInfo.map((row) => ({
    variantId: row.variant_id,
    promotionPrice: row.promotion_price ? Number(row.promotion_price) : null,
    stockLimit: row.stock_limit,
    createdAt: row.created_at,
    variant: {
      id: row.variant_id,
      sku: row.sku,
      price: Number(row.variant_price),
      stock: row.variant_stock,
      productId: row.product_id,
      productName: row.product_name
    }
  }))

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={promotion.name} />}
        subtitle="Editar promoción"
        breadcrumb={[
          { label: 'Promociones', href: '/admin/promotions' },
          { label: promotion.name }
        ]}
      >
        <PromotionDetailAdmin promotion={promotion} variants={formattedVariants} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

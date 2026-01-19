import { PromotionsListView } from '@/module/promotions/components/admin'
import PromotionService from '@/module/promotions/service/promotion'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import Link from 'next/link'
import { type JSX } from 'react'

export default async function AdminPromotionsPage(): Promise<JSX.Element> {
  const promotions = await PromotionService.getPromotionsWithMetrics()

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Promociones" />}
        subtitle="Gestión de promociones y descuentos"
        breadcrumb={[{ label: 'Promociones' }]}
      >
        {promotions.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No hay promociones registradas</p>
            <Link
              href="/admin/promotions/new"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Crear primera promoción
            </Link>
          </div>
        ) : (
          <PromotionsListView promotions={promotions} />
        )}
      </PageUI>
    </LayoutPageAdmin>
  )
}

import { OffersListView } from '@/module/offers/components/admin/OffersListView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { Plus } from 'lucide-react'
import { type JSX } from 'react'

export default async function AdminOffersPage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Ofertas" />}
        subtitle="Gestiona ofertas, flash sales y descuentos especiales"
        breadcrumb={[{ label: 'Ofertas' }]}
        actions={
          <PageButton href="/admin/offers/new" icon={Plus}>
            Nueva Oferta
          </PageButton>
        }
      >
        <OffersListView />
      </PageUI>
    </LayoutPageAdmin>
  )
}

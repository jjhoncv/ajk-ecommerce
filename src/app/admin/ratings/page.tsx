import { RatingsListView } from '@/module/ratings/components/admin'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function AdminRatingsPage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Valoraciones" />}
        subtitle="Moderación de valoraciones de clientes"
        breadcrumb={[{ label: 'Valoraciones' }]}
      >
        <RatingsListView />
      </PageUI>
    </LayoutPageAdmin>
  )
}

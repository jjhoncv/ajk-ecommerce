import { OfferDetailView } from '@/module/offers/components/admin/OfferDetailView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

interface Props {
  params: Promise<{ offerId: string }>
}

export default async function AdminOfferDetailPage({ params }: Props): Promise<JSX.Element> {
  const { offerId } = await params
  const isNew = offerId === 'new'

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title={isNew ? 'Nueva Oferta' : 'Editar Oferta'} />}
        subtitle={isNew ? 'Crear una nueva oferta o descuento' : 'Modificar configuración de la oferta'}
        breadcrumb={[
          { label: 'Ofertas', url: '/admin/offers' },
          { label: isNew ? 'Nueva' : `#${offerId}` }
        ]}
      >
        <OfferDetailView offerId={offerId} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

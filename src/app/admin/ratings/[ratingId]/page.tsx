import { RatingDetailView } from '@/module/ratings/components/admin/RatingDetailView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

interface Props {
  params: Promise<{ ratingId: string }>
}

export default async function AdminRatingDetailPage({ params }: Props): Promise<JSX.Element> {
  const { ratingId } = await params

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Detalle de Valoración" />}
        subtitle="Revisar y moderar valoración"
        breadcrumb={[
          { label: 'Valoraciones', url: '/admin/ratings' },
          { label: `#${ratingId}` }
        ]}
      >
        <RatingDetailView ratingId={ratingId} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

import { BannerListView } from '@/module/banners/components/admin/BannerListView'
import bannerService from '@/module/banners/service/banner'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { Suspense } from 'react'

function LoadingTable() {
  return <div>Cargando banners...</div>
}

export default async function BannerListPage({
  searchParams: { q }
}: {
  searchParams: { q: string }
}) {
  const banners = q
    ? await bannerService.searchBanners(q)
    : await bannerService.getBanners()

  if (!banners) return <div>No se encontraron banners</div>

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Banners" />}
        subtitle="Todos los banners"
        breadcrumb={[{ label: 'Banners' }]}
        options={
          <PageButton href="/admin/banners/new">Nuevo banner</PageButton>
        }
      >
        <Suspense fallback={<LoadingTable />}>
          <BannerListView banners={banners} />
        </Suspense>
      </PageUI>
    </LayoutPageAdmin>
  )
}

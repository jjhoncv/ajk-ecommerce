import { BannerListView } from '@/module/banners/components/admin/BannerListView'
import bannerService from '@/module/banners/service/banner'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX, Suspense } from 'react'

function LoadingTable(): JSX.Element {
  return <div>Cargando banners...</div>
}

export default async function BannerListPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<JSX.Element> {
  const { q } = await searchParams
  const banners =
    q != null
      ? await bannerService.searchBanners(q)
      : await bannerService.getBanners()

  if (banners.length === 0) return <div>No se encontraron banners</div>

  const bannerMapped = banners.map((banner) => ({
    ...banner,
    image_url: banner.image
  }))

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
          <BannerListView banners={bannerMapped} />
        </Suspense>
      </PageUI>
    </LayoutPageAdmin>
  )
}

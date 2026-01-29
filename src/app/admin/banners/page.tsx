import { BannerListView } from '@/module/banners/components/admin/BannerListView'
import bannerService from '@/module/banners/service/banner'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

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

  if (banners.length === 0) {
    const isSearch = q != null && q.length > 0
    const emptyMessage = isSearch
      ? `No se encontraron banners para "${q}"`
      : 'No hay banners creados'

    const emptySubtitle = isSearch
      ? 'Intenta con otros términos de búsqueda o crea un nuevo banner'
      : 'Los banners se muestran en el carrusel principal de la tienda'

    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Banners" />}
          subtitle={emptySubtitle}
          breadcrumb={[{ label: 'Banners' }]}
          options={
            <PageButton href="/admin/banners/new">Nuevo banner</PageButton>
          }
        >
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {emptyMessage}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">
              {emptySubtitle}
            </p>
            <PageButton href="/admin/banners/new">+ Crear banner</PageButton>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

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
        <BannerListView banners={bannerMapped} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

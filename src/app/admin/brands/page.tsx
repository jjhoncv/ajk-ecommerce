import { BrandListView } from '@/module/brands/components/admin/BrandListView'
import BrandService from '@/module/brands/service/brand'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function BrandListPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<JSX.Element> {
  const { q } = await searchParams
  const brands =
    q != null
      ? await BrandService.searchBrands(q)
      : await BrandService.getBrands()

  if (brands.length === 0) {
    const isSearch = q != null && q.length > 0
    const emptyMessage = isSearch
      ? `No se encontraron marcas para "${q}"`
      : 'No hay marcas creadas'

    const emptySubtitle = isSearch
      ? 'Intenta con otros términos de búsqueda o crea una nueva marca'
      : 'Las marcas ayudan a organizar y filtrar los productos en la tienda'

    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Marcas" />}
          subtitle={emptySubtitle}
          breadcrumb={[{ label: 'Marcas' }]}
          options={
            <PageButton href="/admin/brands/new">Nueva marca</PageButton>
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {emptyMessage}
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">
              {emptySubtitle}
            </p>
            <PageButton href="/admin/brands/new">+ Crear marca</PageButton>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Marcas" />}
        subtitle="Todas las marcas"
        breadcrumb={[{ label: 'Marcas' }]}
        options={
          <PageButton href="/admin/brands/new">Nueva marca</PageButton>
        }
      >
        <BrandListView brands={brands} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

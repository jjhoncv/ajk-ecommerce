import productModel from '@/backend/product'
import { ProductListView } from '@/module/products/components/admin/ProductListView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX, Suspense } from 'react'

function LoadingTable(): JSX.Element {
  return <div>Cargando productos...</div>
}

export default async function ProductListPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<JSX.Element> {
  const { q } = await searchParams

  // Obtener productos
  let products
  if (q != null) {
    products = await productModel.searchProductsByName(q)
  } else {
    products = await productModel.getProducts()
  }

  if (!products || products.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Productos" />}
          subtitle="Todos los productos"
          breadcrumb={[{ label: 'Productos' }]}
          options={
            <PageButton href="/admin/products/new">Nuevo producto</PageButton>
          }
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Productos" />}
        subtitle="Todos los productos"
        breadcrumb={[{ label: 'Productos' }]}
        options={
          <PageButton href="/admin/products/new">Nuevo producto</PageButton>
        }
      >
        <Suspense fallback={<LoadingTable />}>
          <ProductListView products={products} />
        </Suspense>
      </PageUI>
    </LayoutPageAdmin>
  )
}

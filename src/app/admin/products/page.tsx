import { ProductListView } from '@/module/products/components/admin/ProductListView'
import ProductService from '@/module/products/service/product'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function ProductListPage(): Promise<JSX.Element> {
  // Obtener productos con estadísticas para admin
  const products = await ProductService.getProductsForAdmin()

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
        <ProductListView products={products as any} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

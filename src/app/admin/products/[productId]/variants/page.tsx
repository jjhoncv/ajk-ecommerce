import productModel from '@/backend/product'
import productVariantModel from '@/backend/product-variant'
import { VariantListView } from '@/module/products/components/admin/variants/VariantListView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX, Suspense } from 'react'

function LoadingTable(): JSX.Element {
  return <div>Cargando variantes...</div>
}

interface VariantListPageProps {
  params: Promise<{ productId: string }>
}

export default async function VariantListPage({
  params
}: VariantListPageProps): Promise<JSX.Element> {
  const { productId } = await params
  const product = await productModel.getProductById(Number(productId))
  const variants = await productVariantModel.getProductVariantsByProductId(
    Number(productId)
  )

  if (product == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[{ label: 'Productos', url: '/admin/products' }]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró el producto</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  if (!variants || variants.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Variantes" />}
          subtitle={`Variantes de: ${product.name}`}
          breadcrumb={[
            { label: 'Productos', url: '/admin/products' },
            { label: product.name, url: `/admin/products/${productId}` },
            { label: 'Variantes' }
          ]}
          options={
            <PageButton href={`/admin/products/${productId}/variants/new`}>
              Nueva variante
            </PageButton>
          }
        >
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No se encontraron variantes para este producto
            </p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Variantes" />}
        subtitle={`Variantes de: ${product.name}`}
        breadcrumb={[
          { label: 'Productos', url: '/admin/products' },
          { label: product.name, url: `/admin/products/${productId}` },
          { label: 'Variantes' }
        ]}
        options={
          <PageButton href={`/admin/products/${productId}/variants/new`}>
            Nueva variante
          </PageButton>
        }
      >
        <Suspense fallback={<LoadingTable />}>
          <VariantListView variants={variants} productId={Number(productId)} />
        </Suspense>
      </PageUI>
    </LayoutPageAdmin>
  )
}

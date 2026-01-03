import productModel from '@/backend/product'
import { VariantFields } from '@/module/products/components/admin/variants/variantFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

interface NewVariantPageProps {
  params: Promise<{ productId: string }>
}

export default async function NewVariantPage({
  params
}: NewVariantPageProps): Promise<JSX.Element> {
  const { productId } = await params
  const product = await productModel.getProductById(Number(productId))

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

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nueva Variante" />}
        subtitle={`Crear variante para: ${product.name}`}
        breadcrumb={[
          { label: 'Productos', url: '/admin/products' },
          { label: product.name, url: `/admin/products/${productId}` },
          { label: 'Variantes', url: `/admin/products/${productId}/variants` },
          { label: 'Nueva Variante' }
        ]}
      >
        <FormCreate
          api={{
            url: `/api/admin/products/${productId}/variants`,
            method: 'POST',
            withFiles: true
          }}
          form={{
            redirect: `/admin/products/${productId}/variants`,
            fields: VariantFields
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

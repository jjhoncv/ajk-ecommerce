import productModel from '@/backend/product'
import productVariantModel from '@/backend/product-variant'
import { VariantFields } from '@/module/products/components/admin/variants/variantFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

interface EditVariantPageProps {
  params: Promise<{ productId: string; variantId: string }>
}

export default async function EditVariantPage({
  params
}: EditVariantPageProps): Promise<JSX.Element> {
  const { productId, variantId } = await params
  const product = await productModel.getProductById(Number(productId))
  const variant = await productVariantModel.getProductVariantById(
    Number(variantId)
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

  if (variant == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Error" />}
          breadcrumb={[
            { label: 'Productos', url: '/admin/products' },
            { label: product.name, url: `/admin/products/${productId}` },
            { label: 'Variantes', url: `/admin/products/${productId}/variants` }
          ]}
        >
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600">No se encontró la variante</p>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const fieldsWithValues = mergeFieldsWithData(VariantFields, {
    sku: variant.sku,
    price: variant.price?.toString() || '',
    stock: variant.stock?.toString() || '0'
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Variante" />}
        subtitle={`Editando variante: ${variant.sku}`}
        breadcrumb={[
          { label: 'Productos', url: '/admin/products' },
          { label: product.name, url: `/admin/products/${productId}` },
          { label: 'Variantes', url: `/admin/products/${productId}/variants` },
          { label: 'Editar Variante' }
        ]}
      >
        <FormCreate
          type="edit"
          api={{
            url: `/api/admin/products/${productId}/variants`,
            method: 'PATCH',
            withFiles: true
          }}
          form={{
            redirect: `/admin/products/${productId}/variants`,
            fields: fieldsWithValues,
            customFields: { id: variantId }
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

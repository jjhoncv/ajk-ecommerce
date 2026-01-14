import attributeModel from '@/backend/attribute'
import productModel from '@/backend/product'
import productVariantModel from '@/backend/product-variant'
import variantAttributeOptionModel from '@/backend/variant-attribute-option'
import { VariantForm } from '@/module/products/components/admin/variants/VariantForm'
import { VariantImageManager } from '@/module/products/components/admin/variants/VariantImageManager'
import { VariantFields } from '@/module/products/components/admin/variants/variantFields'
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
  const attributes = await attributeModel.getAttributes()
  const variantAttributeOptions =
    await variantAttributeOptionModel.getVariantAttributeOptionsWithDetailsById(
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

  // Construir objeto de atributos seleccionados: { attributeId: optionId }
  const selectedAttributes: Record<number, number> = {}
  if (variantAttributeOptions) {
    variantAttributeOptions.forEach((vao) => {
      if (vao.attributeOption?.attributeId) {
        selectedAttributes[vao.attributeOption.attributeId] =
          vao.attributeOptionId
      }
    })
  }

  // Obtener la opción del atributo que controla las imágenes
  const imageAttributeOptionId = variant.imageAttributeId
    ? selectedAttributes[variant.imageAttributeId]
    : undefined

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
        <div className="space-y-6">
          {/* Formulario de variante */}
          <VariantForm
            type="edit"
            productId={productId}
            fields={fieldsWithValues}
            attributes={attributes || []}
            selectedAttributes={selectedAttributes}
            imageAttributeId={variant.imageAttributeId}
            customFields={{ id: variantId }}
            redirectUrl={`/admin/products/${productId}/variants`}
          />

          {/* Gestión de imágenes */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <VariantImageManager
              variantId={Number(variantId)}
              productId={Number(productId)}
              imageAttributeId={variant.imageAttributeId}
              imageAttributeOptionId={imageAttributeOptionId}
            />
          </div>
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}

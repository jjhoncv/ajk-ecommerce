import brandModel from '@/backend/brand'
import categoryModel from '@/backend/category'
import productModel from '@/backend/product'
import productAttributeOptionModel from '@/backend/product-attribute-option'
import productVariantModel from '@/backend/product-variant'
import { getProductFieldsWithData } from '@/module/products/components/admin/productFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { Boxes, ChevronRight, Layers } from 'lucide-react'
import Link from 'next/link'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

interface EditProductPageProps {
  params: Promise<{ productId: string }>
}

export default async function EditProductPage({
  params
}: EditProductPageProps): Promise<JSX.Element> {
  const { productId } = await params
  const product = await productModel.getProductById(Number(productId))
  const brands = await brandModel.getBrands()
  const categories = await categoryModel.getCategories()
  const productCategories = await categoryModel.getCategoriesByProductId(Number(productId))

  // Obtener variantes y atributos del producto
  const variants = await productVariantModel.getProductVariantsByProductId(Number(productId))
  const attributes = await productAttributeOptionModel.getProductAttributesWithOptions(Number(productId))

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

  const fields = getProductFieldsWithData(brands ?? [], categories ?? [])
  const selectedCategoryIds = productCategories?.map((cat) => cat.id.toString()) || []

  const fieldsWithValues = mergeFieldsWithData(fields, {
    name: product.name,
    description: product.description || '',
    base_price: product.basePrice?.toString() || '',
    brand_id: product.brand?.id?.toString() || '',
    categories: selectedCategoryIds
  })

  const variantsCount = variants?.length ?? 0
  const attributesCount = attributes?.length ?? 0

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Producto" />}
        subtitle={`Editando: ${product.name}`}
        breadcrumb={[
          { label: 'Productos', url: '/admin/products' },
          { label: 'Editar Producto' }
        ]}
      >
        <div className="space-y-6">
          {/* Acciones rápidas */}
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href={`/admin/products/${productId}/variants`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                  <Boxes size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Variantes</h3>
                  <p className="text-sm text-gray-500">
                    {variantsCount === 0
                      ? 'Sin variantes creadas'
                      : `${variantsCount} variante${variantsCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
            </Link>

            <Link
              href={`/admin/products/${productId}/attributes`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Atributos</h3>
                  <p className="text-sm text-gray-500">
                    {attributesCount === 0
                      ? 'Sin atributos asignados'
                      : `${attributesCount} atributo${attributesCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-purple-600" />
            </Link>
          </div>

          {/* Formulario de edición */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold">Información del producto</h2>
            </div>
            <div className="p-6">
              <FormCreate
                type="edit"
                api={{
                  url: '/api/admin/products',
                  method: 'PATCH',
                  withFiles: true
                }}
                form={{
                  redirect: '/admin/products',
                  fields: fieldsWithValues,
                  customFields: { id: productId }
                }}
              />
            </div>
          </div>
        </div>
      </PageUI>
    </LayoutPageAdmin>
  )
}

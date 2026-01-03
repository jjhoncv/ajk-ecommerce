import brandModel from '@/backend/brand'
import categoryModel from '@/backend/category'
import productModel from '@/backend/product'
import { getProductFieldsWithData } from '@/module/products/components/admin/productFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
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
      </PageUI>
    </LayoutPageAdmin>
  )
}

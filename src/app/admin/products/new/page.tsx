import brandModel from '@/backend/brand'
import categoryModel from '@/backend/category'
import { getProductFieldsWithData } from '@/module/products/components/admin/productFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function NewProductPage(): Promise<JSX.Element> {
  const brands = await brandModel.getBrands()
  const categories = await categoryModel.getCategories()
  const fields = getProductFieldsWithData(brands ?? [], categories ?? [])

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Producto" />}
        subtitle="Crear un nuevo producto"
        breadcrumb={[
          { label: 'Productos', url: '/admin/products' },
          { label: 'Nuevo Producto' }
        ]}
      >
        <FormCreate
          api={{
            url: '/api/admin/products',
            method: 'POST',
            withFiles: true
          }}
          form={{ redirect: '/admin/products', fields }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

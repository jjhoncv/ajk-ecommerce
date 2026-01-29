import { BrandFields } from '@/module/brands/components/admin/brandFields'
import BrandService from '@/module/brands/service/brand'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

export default async function BrandEditPage({
  params
}: {
  params: Promise<{ id: number }>
}): Promise<JSX.Element> {
  const { id } = await params

  const result = await BrandService.getBrandWithAudit(Number(id))

  if (result == null || result.brand == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="No encontrada" />}
          breadcrumb={[{ label: 'Marcas', url: '/admin/brands' }]}
        >
          <p className="text-gray-500">La marca no existe o fue eliminada.</p>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const { brand, audit } = result

  const fieldsWithValues = mergeFieldsWithData(BrandFields, {
    name: brand.name,
    image_url: brand.imageUrl || ''
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Marca" />}
        breadcrumb={[
          { label: 'Marcas', url: '/admin/brands' },
          { label: 'Editar Marca' }
        ]}
        subtitle={`Editando: ${brand.name}`}
      >
        <FormCreate
          type="edit"
          api={{ url: '/api/admin/brands', method: 'PATCH', withFiles: true }}
          form={{
            redirect: '/admin/brands',
            fields: fieldsWithValues,
            customFields: { id }
          }}
          audit={audit}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

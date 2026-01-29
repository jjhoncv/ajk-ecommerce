import { BrandFields } from '@/module/brands/components/admin/brandFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function BrandNewPage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nueva Marca" />}
        breadcrumb={[
          { label: 'Marcas', url: '/admin/brands' },
          { label: 'Nueva Marca' }
        ]}
        subtitle="Crear nueva marca"
      >
        <FormCreate
          api={{ url: '/api/admin/brands', method: 'POST', withFiles: true }}
          form={{ redirect: '/admin/brands', fields: BrandFields }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

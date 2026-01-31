import { TagFields } from '@/module/tags/components/admin/tagFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function NewTagPage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Tag" />}
        subtitle="Crear un nuevo tag para clasificar productos"
        breadcrumb={[
          { label: 'Tags', url: '/admin/tags' },
          { label: 'Nuevo Tag' }
        ]}
      >
        <FormCreate
          api={{
            url: '/api/admin/tags',
            method: 'POST',
            withFiles: true
          }}
          form={{
            redirect: '/admin/tags',
            fields: TagFields
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

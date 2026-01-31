import { TagFields } from '@/module/tags/components/admin/tagFields'
import tagService from '@/module/tags/service/tags'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estatico

interface EditTagPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTagPage({
  params
}: EditTagPageProps): Promise<JSX.Element> {
  const { id } = await params

  const result = await tagService.getTagWithAudit(Number(id))

  if (result == null || result.tag == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="No encontrado" />}
          breadcrumb={[{ label: 'Tags', url: '/admin/tags' }]}
        >
          <p className="text-gray-500">El tag no existe o fue eliminado.</p>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const { tag, audit } = result

  const fieldsWithValues = mergeFieldsWithData(TagFields, {
    ...(tag as unknown as Record<string, unknown>),
    color: tag.color || '#6B7280',
    slug: tag.slug || '',
    display_order: tag.displayOrder?.toString() || '0'
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Tag" />}
        subtitle={`Editando: ${tag.name}`}
        breadcrumb={[
          { label: 'Tags', url: '/admin/tags' },
          { label: 'Editar Tag' }
        ]}
      >
        <FormCreate
          type="edit"
          api={{
            url: '/api/admin/tags',
            method: 'PATCH',
            withFiles: true
          }}
          form={{
            redirect: '/admin/tags',
            fields: fieldsWithValues,
            customFields: { id }
          }}
          audit={audit}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

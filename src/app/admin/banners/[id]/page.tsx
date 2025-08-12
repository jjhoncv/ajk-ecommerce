import { BannerFields } from '@/module/banners/components/admin/bannerFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'

import { type JSX } from 'react'

import BannerService from '@/module/banners/service/banner'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'

export const revalidate = 0 // Deshabilitar cache estático

export default async function UserEditPage({
  params
}: {
  params: Promise<{ id: number }>
}): Promise<JSX.Element> {
  const { id } = await params

  const banner = await BannerService.getBanner(id)

  const fieldsWithValues = mergeFieldsWithData(BannerFields, {
    ...banner,
    image_url: banner?.image
  })

  if (banner === undefined) return <div>No se encontraron banner</div>

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Banner" />}
        breadcrumb={[
          { label: 'Banners', url: '/admin/banners' },
          { label: 'Editar Banner' }
        ]}
        subtitle="Editar Banner"
      >
        <FormCreate
          type="edit"
          api={{ url: '/api/admin/banners', method: 'PATCH', withFiles: true }}
          form={{
            redirect: '/admin/banners',
            fields: fieldsWithValues,
            customFields: { id }
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

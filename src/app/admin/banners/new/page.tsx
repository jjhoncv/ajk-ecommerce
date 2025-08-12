import { BannerFields } from '@/module/banners/components/admin/bannerFields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function BannerNewPage(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo Banner" />}
        breadcrumb={[
          { label: 'Banners', url: '/admin/banners' },
          { label: 'Nuevo Banner' }
        ]}
        subtitle="Crear nuevo banner"
      >
        <FormCreate
          api={{ url: '/api/admin/banners', method: 'POST', withFiles: true }}
          form={{ redirect: '/admin/banners', fields: BannerFields }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

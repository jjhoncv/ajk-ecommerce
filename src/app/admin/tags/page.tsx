import { TagListView } from '@/module/tags/components/admin/TagListView'
import tagService from '@/module/tags/service/tags'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function TagListPage(): Promise<JSX.Element> {
  const items = await tagService.getTags()

  if (items.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="Tags" />}
          subtitle="No hay tags creados"
          breadcrumb={[{ label: 'Tags', url: '/admin/tags' }]}
          options={<PageButton href="/admin/tags/new">Nuevo Tag</PageButton>}
        >
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No hay tags creados
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">
              Los tags permiten clasificar productos con etiquetas visuales
              como Nuevo, Oferta, Tendencia, etc.
            </p>
            <PageButton href="/admin/tags/new">+ Crear tag</PageButton>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Tags" />}
        subtitle="Gestiona los tags para clasificar productos"
        breadcrumb={[{ label: 'Tags', url: '/admin/tags' }]}
        options={<PageButton href="/admin/tags/new">Nuevo Tag</PageButton>}
      >
        <TagListView items={items} />
      </PageUI>
    </LayoutPageAdmin>
  )
}

import { CategoryFields } from '@/module/categories/components/admin/categoryFields'
import categoryService from '@/module/categories/service/category'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ parent?: string }>
}

export default async function EditCategoryPage({
  params,
  searchParams
}: EditCategoryPageProps): Promise<JSX.Element> {
  const { id } = await params
  const { parent } = await searchParams
  const parentId = parent ? Number(parent) : null

  console.log('[EditCategoryPage] Fetching category with id:', id)

  const result = await categoryService.getCategoryWithAudit(Number(id))

  console.log('[EditCategoryPage] Result:', JSON.stringify(result, null, 2))

  if (result == null || result.category == null) {
    console.log('[EditCategoryPage] Category not found for id:', id)
    return <div>No se encontró la categoría (ID: {id})</div>
  }

  const { category, audit } = result

  const fieldsWithValues = mergeFieldsWithData(CategoryFields, {
    ...category,
    // Basic fields
    parent_id: category.parentId?.toString() || '',
    image_url: category.imageUrl || '',
    show_nav: category.showNav ? '1' : '0',
    slug: category.slug || '',
    // Banner fields
    banner_image: category.bannerImage || '',
    banner_image_mobile: category.bannerImageMobile || '',
    banner_title: category.bannerTitle || '',
    banner_subtitle: category.bannerSubtitle || '',
    banner_description: category.bannerDescription || '',
    banner_cta_text: category.bannerCtaText || '',
    banner_cta_link: category.bannerCtaLink || '',
    // SEO fields
    meta_title: category.metaTitle || '',
    meta_description: category.metaDescription || ''
  })

  // Construir URL de redirección manteniendo el contexto
  // Si tenemos parent en la URL, usarlo; si no, usar el parentId de la categoría
  const contextParentId = parentId ?? category.parentId
  const redirectUrl =
    contextParentId != null
      ? `/admin/categories?parent=${contextParentId}`
      : '/admin/categories'

  console.log({ category, fieldsWithValues })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar Categoría" />}
        subtitle={`Editando: ${category.name}`}
        breadcrumb={[
          { label: 'Categorías', url: '/admin/categories' },
          { label: 'Editar Categoría' }
        ]}
      >
        <FormCreate
          type="edit"
          api={{
            url: '/api/admin/categories',
            method: 'PATCH',
            withFiles: true
          }}
          form={{
            redirect: redirectUrl,
            fields: fieldsWithValues,
            customFields: { id }
          }}
          audit={audit}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}

import { type Categories as CategoryRaw } from '@/types/database'
import { type Categories as Category } from '@/types/domain'

export const CategoryMapper = (data: CategoryRaw): Category => {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    imageUrl: data.image_url,
    parentId: data.parent_id,
    displayOrder: data.display_order,
    showNav: data.show_nav,
    // Banner fields
    bannerImage: data.banner_image,
    bannerImageMobile: data.banner_image_mobile,
    bannerTitle: data.banner_title,
    bannerSubtitle: data.banner_subtitle,
    bannerDescription: data.banner_description,
    bannerCtaText: data.banner_cta_text,
    bannerCtaLink: data.banner_cta_link,
    // SEO fields
    metaTitle: data.meta_title,
    metaDescription: data.meta_description,
    // Audit fields
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by
  }
}

export const CategoriesMapper = (
  data: CategoryRaw[] | null
): Category[] | undefined => {
  if (data === null) return undefined
  return data.map(CategoryMapper)
}

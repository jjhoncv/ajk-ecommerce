import { type Sections as SectionRaw } from '@/types/database'
import { type Sections as Section } from '@/types/domain'

export const SectionMapper = (data: SectionRaw): Section => {
  return {
    id: data.id,
    name: data.name,
    url: data.url,
    image: data.image,
    displayOrder: Number(data.display_order)
  }
}

export const SectionsMapper = (
  data: SectionRaw[] | null
): Section[] | undefined => {
  if (data === null) return undefined
  return data.map(SectionMapper)
}

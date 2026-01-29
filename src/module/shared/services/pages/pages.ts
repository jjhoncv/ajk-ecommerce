import { executeQuery } from '@/lib/db'
import { type Page } from './types'

interface FooterLinkRaw {
  id: number
  name: string
  url: string
  display_order: number
  is_active: number
}

export const getPages = async (): Promise<Page[]> => {
  const results = await executeQuery<FooterLinkRaw[]>({
    query: `
      SELECT id, name, url, display_order, is_active
      FROM footer_links
      WHERE is_active = 1
      ORDER BY display_order ASC, id ASC
    `
  })

  if (!results || results.length === 0) {
    return []
  }

  return results.map((link) => ({
    name: link.name,
    href: link.url
  }))
}

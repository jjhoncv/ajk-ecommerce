import { executeQuery } from '@/lib/db'
import {
  type StoreConfig,
  type StoreConfigRaw,
  type UpdateStoreConfigData,
  type SocialLink
} from './types'

const mapStoreConfig = (raw: StoreConfigRaw): StoreConfig => ({
  id: raw.id,
  storeName: raw.store_name,
  storeDescription: raw.store_description,
  logoUrl: raw.logo_url,
  logoWidth: raw.logo_width,
  logoHeight: raw.logo_height,
  address: raw.address,
  businessHours: raw.business_hours,
  phone: raw.phone,
  email: raw.email,
  instagramUrl: raw.instagram_url,
  facebookUrl: raw.facebook_url,
  twitterUrl: raw.twitter_url,
  whatsappNumber: raw.whatsapp_number
})

export const getStoreConfig = async (): Promise<StoreConfig | null> => {
  const results = await executeQuery<StoreConfigRaw[]>({
    query: 'SELECT * FROM store_config WHERE id = 1'
  })

  if (!results || results.length === 0) {
    return null
  }

  return mapStoreConfig(results[0])
}

export const updateStoreConfig = async (
  data: UpdateStoreConfigData
): Promise<StoreConfig | null> => {
  // Verificar si existe el registro
  const existing = await getStoreConfig()

  if (!existing) {
    // Crear registro inicial
    await executeQuery({
      query: `
        INSERT INTO store_config (id, store_name, store_description, logo_url, logo_width, logo_height, address, business_hours, phone, email, instagram_url, facebook_url, twitter_url, whatsapp_number)
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        data.storeName ?? 'Mi Tienda',
        data.storeDescription ?? null,
        data.logoUrl ?? null,
        data.logoWidth ?? 150,
        data.logoHeight ?? 50,
        data.address ?? null,
        data.businessHours ?? null,
        data.phone ?? null,
        data.email ?? null,
        data.instagramUrl ?? null,
        data.facebookUrl ?? null,
        data.twitterUrl ?? null,
        data.whatsappNumber ?? null
      ]
    })
  } else {
    // Actualizar registro existente
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (data.storeName !== undefined) {
      fields.push('store_name = ?')
      values.push(data.storeName)
    }
    if (data.storeDescription !== undefined) {
      fields.push('store_description = ?')
      values.push(data.storeDescription)
    }
    if (data.logoUrl !== undefined) {
      fields.push('logo_url = ?')
      values.push(data.logoUrl)
    }
    if (data.logoWidth !== undefined) {
      fields.push('logo_width = ?')
      values.push(data.logoWidth)
    }
    if (data.logoHeight !== undefined) {
      fields.push('logo_height = ?')
      values.push(data.logoHeight)
    }
    if (data.address !== undefined) {
      fields.push('address = ?')
      values.push(data.address)
    }
    if (data.businessHours !== undefined) {
      fields.push('business_hours = ?')
      values.push(data.businessHours)
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?')
      values.push(data.phone)
    }
    if (data.email !== undefined) {
      fields.push('email = ?')
      values.push(data.email)
    }
    if (data.instagramUrl !== undefined) {
      fields.push('instagram_url = ?')
      values.push(data.instagramUrl)
    }
    if (data.facebookUrl !== undefined) {
      fields.push('facebook_url = ?')
      values.push(data.facebookUrl)
    }
    if (data.twitterUrl !== undefined) {
      fields.push('twitter_url = ?')
      values.push(data.twitterUrl)
    }
    if (data.whatsappNumber !== undefined) {
      fields.push('whatsapp_number = ?')
      values.push(data.whatsappNumber)
    }

    if (fields.length > 0) {
      await executeQuery({
        query: `UPDATE store_config SET ${fields.join(', ')} WHERE id = 1`,
        values
      })
    }
  }

  return getStoreConfig()
}

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const config = await getStoreConfig()
  if (!config) return []

  const links: SocialLink[] = []

  if (config.instagramUrl) {
    links.push({ name: 'Instagram', url: config.instagramUrl, type: 'instagram' })
  }
  if (config.facebookUrl) {
    links.push({ name: 'Facebook', url: config.facebookUrl, type: 'facebook' })
  }
  if (config.twitterUrl) {
    links.push({ name: 'Twitter', url: config.twitterUrl, type: 'twitter' })
  }
  if (config.whatsappNumber) {
    links.push({
      name: 'WhatsApp',
      url: `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}`,
      type: 'whatsapp'
    })
  }

  return links
}

export interface StoreConfigRaw {
  id: number
  store_name: string
  store_description: string | null
  logo_url: string | null
  logo_width: number | null
  logo_height: number | null
  address: string | null
  business_hours: string | null
  phone: string | null
  email: string | null
  instagram_url: string | null
  facebook_url: string | null
  twitter_url: string | null
  whatsapp_number: string | null
  created_at: string
  updated_at: string
}

export interface StoreConfig {
  id: number
  storeName: string
  storeDescription: string | null
  logoUrl: string | null
  logoWidth: number | null
  logoHeight: number | null
  address: string | null
  businessHours: string | null
  phone: string | null
  email: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  twitterUrl: string | null
  whatsappNumber: string | null
}

export interface UpdateStoreConfigData {
  storeName?: string
  storeDescription?: string | null
  logoUrl?: string | null
  logoWidth?: number | null
  logoHeight?: number | null
  address?: string | null
  businessHours?: string | null
  phone?: string | null
  email?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  twitterUrl?: string | null
  whatsappNumber?: string | null
}

export interface SocialLink {
  name: string
  url: string
  type: 'instagram' | 'facebook' | 'twitter' | 'whatsapp'
}

export interface StoreFeatureRaw {
  id: number
  icon: string
  title: string
  description: string
  display_order: number
  is_active: number
  created_at: string
  updated_at: string
}

export interface StoreFeature {
  id: number
  icon: string
  title: string
  description: string
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateStoreFeatureData {
  icon: string
  title: string
  description: string
  displayOrder?: number
  isActive?: boolean
}

export interface UpdateStoreFeatureData {
  icon?: string
  title?: string
  description?: string
  displayOrder?: number
  isActive?: boolean
}

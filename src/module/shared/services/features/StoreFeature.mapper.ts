import { type StoreFeature, type StoreFeatureRaw } from './StoreFeature.interfaces'

export const mapStoreFeature = (raw: StoreFeatureRaw): StoreFeature => ({
  id: raw.id,
  icon: raw.icon,
  title: raw.title,
  description: raw.description,
  displayOrder: raw.display_order,
  isActive: raw.is_active === 1,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at)
})

export const mapStoreFeatures = (raw: StoreFeatureRaw[]): StoreFeature[] =>
  raw.map(mapStoreFeature)

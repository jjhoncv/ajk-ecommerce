import { StoreFeatureRepository } from './StoreFeature.repository'
import { mapStoreFeature, mapStoreFeatures } from './StoreFeature.mapper'
import {
  type StoreFeature,
  type CreateStoreFeatureData,
  type UpdateStoreFeatureData
} from './StoreFeature.interfaces'

export class StoreFeatureModel {
  private readonly repository: StoreFeatureRepository

  constructor() {
    this.repository = new StoreFeatureRepository()
  }

  public async getActiveFeatures(): Promise<StoreFeature[]> {
    const raw = await this.repository.getAll()
    if (!raw || raw.length === 0) return []
    return mapStoreFeatures(raw)
  }

  public async getById(id: number): Promise<StoreFeature | null> {
    const raw = await this.repository.getById(id)
    if (!raw) return null
    return mapStoreFeature(raw)
  }

  public async create(data: CreateStoreFeatureData): Promise<StoreFeature | null> {
    const id = await this.repository.create(data)
    return this.getById(id)
  }

  public async update(
    id: number,
    data: UpdateStoreFeatureData
  ): Promise<StoreFeature | null> {
    const success = await this.repository.update(id, data)
    if (!success) return null
    return this.getById(id)
  }

  public async delete(id: number): Promise<boolean> {
    return this.repository.delete(id)
  }
}

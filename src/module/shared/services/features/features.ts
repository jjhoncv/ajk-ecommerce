import { StoreFeatureModel } from './StoreFeature.model'
import { type Feature } from './types'

export const getFeatures = async (): Promise<Feature[]> => {
  const model = new StoreFeatureModel()
  const storeFeatures = await model.getActiveFeatures()

  // Mapear de StoreFeature a Feature (formato esperado por el componente)
  return storeFeatures.map((sf) => ({
    icon: sf.icon,
    title: sf.title,
    description: sf.description
  }))
}

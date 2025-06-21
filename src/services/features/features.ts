import { dataMock } from './mock'
import { type Feature } from './types'

export const getFeatures = async (): Promise<Feature[]> => {
  return await new Promise((resolve) => {
    resolve(dataMock)
  })
}

import { dataMock } from './mock'
import { Feature } from './types'

export const getFeatures = async (): Promise<Feature[]> => {
  return new Promise((resolve) => {
    resolve(dataMock)
  })
}

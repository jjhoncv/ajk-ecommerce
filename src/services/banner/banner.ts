import { dataMock } from './mock'
import { Banner } from './types'

export const getBanner = async (): Promise<Banner[]> => {
  return new Promise((resolve) => {
    resolve(dataMock)
  })
}

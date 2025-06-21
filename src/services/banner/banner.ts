import { dataMock } from './mock'
import { type Banner } from './types'

export const getBanner = async (): Promise<Banner[]> => {
  return await new Promise((resolve) => {
    resolve(dataMock)
  })
}

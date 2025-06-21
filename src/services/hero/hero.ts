import { dataMock } from './mock'
import { type Hero } from './types'

export const getHero = async (): Promise<Hero[]> => {
  return await new Promise((resolve) => {
    resolve(dataMock)
  })
}

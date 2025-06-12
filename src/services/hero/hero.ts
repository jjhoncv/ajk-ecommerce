import { dataMock } from './mock'
import { Hero } from './types'

export const getHero = async (): Promise<Hero[]> => {
  return new Promise((resolve) => {
    resolve(dataMock)
  })
}

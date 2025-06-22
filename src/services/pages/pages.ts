import { pagesMock } from './mock'
import { type Page } from './types'

export const getPages = async (): Promise<Page[]> => {
  try {
    return await new Promise((resolve) => {
      resolve(pagesMock)
    })
  } catch (error) {
    throw new Error(
      `Error al obtener getPages ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}

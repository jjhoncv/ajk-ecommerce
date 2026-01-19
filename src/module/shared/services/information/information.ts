import { dataInformation } from './mock'
import { type Information } from './types'

export const getInformation = async (): Promise<Information[]> => {
  try {
    return await new Promise((resolve) => {
      resolve(dataInformation)
    })
  } catch (error) {
    throw new Error(
      `Error al obtener getInformation ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}

import { type FooterModel } from './'
import { dataMock } from './mock'

export const getFooter = async (): Promise<FooterModel> => {
  try {
    return new Promise((resolve) => {
      resolve({
        sections: dataMock.sections,
        socialLinks: dataMock.socialLinks
      })
    })
  } catch (error) {
    throw new Error(
      `Error al obtener getHeader ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}

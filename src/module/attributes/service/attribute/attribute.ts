import { attributeModel } from '../../core'

export const getAttributes = async () => {
  return await attributeModel.getAttributes()
}

export const getAttributeById = async (id: number) => {
  return await attributeModel.getAttributeById(id)
}

export const getAttributeWithOptions = async (id: number) => {
  return await attributeModel.getAttributeWithOptions(id)
}

import { type Field } from './types/fileManagement'

export const extractDefaultValues = (fields: Field[]): Record<string, any> => {
  return fields.reduce<Record<string, any>>(
    (acc, field) => {
      if ('value' in field && field.value !== undefined) {
        acc[field.key] = field.value
      }
      return acc
    },
    {}
  )
}

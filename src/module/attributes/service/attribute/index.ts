import { getAttributeById, getAttributes, getAttributeWithAudit } from './attribute'

export type { AttributeWithAudit } from './attribute'

const AttributeService = {
  getAttributes,
  getAttributeById,
  getAttributeWithAudit
}

export default AttributeService

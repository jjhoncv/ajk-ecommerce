export interface Attribute {
  id: number
  name: string
  displayName?: string | null
  type: string
  isRequired?: boolean
  displayOrder?: number
  attributeOptions?: AttributeOption[]
}

export interface AttributeOption {
  id: number
  attributeId: number
  value: string
  displayOrder?: number
  colorCode?: string | null
}

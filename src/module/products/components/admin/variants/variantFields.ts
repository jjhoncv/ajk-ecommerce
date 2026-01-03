import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'

export const VariantFields: Field[] = [
  {
    key: 'sku',
    label: 'SKU',
    type: 'text',
    required: {
      min: 'El SKU es requerido'
    }
  },
  {
    key: 'price',
    label: 'Precio',
    type: 'text',
    required: {
      min: 'El precio es requerido'
    }
  },
  {
    key: 'stock',
    label: 'Stock',
    type: 'text',
    required: {
      min: 'El stock es requerido'
    }
  }
]

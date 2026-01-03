import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'

export const AttributeOptionFields: Field[] = [
  {
    key: 'value',
    label: 'Valor de la opción',
    type: 'text',
    required: {
      min: 'El valor es requerido'
    }
  },
  {
    key: 'additional_cost',
    label: 'Costo adicional (opcional)',
    type: 'text'
  }
]

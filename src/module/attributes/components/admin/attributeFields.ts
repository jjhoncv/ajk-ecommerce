import {
  type Field,
  type SelectOption
} from '@/module/shared/components/FormCreate/types/fileManagement'

const displayTypeOptions: SelectOption[] = [
  { value: 'select', label: 'Select (Dropdown)' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'pills', label: 'Pills (Botones)' },
  { value: 'color', label: 'Color Picker' },
  { value: 'custom', label: 'Personalizado' }
]

export const AttributeFields: Field[] = [
  {
    key: 'name',
    label: 'Nombre del atributo',
    type: 'text',
    required: {
      min: 'El nombre del atributo es requerido'
    }
  },
  {
    key: 'display_type',
    label: 'Tipo de visualización',
    type: 'select',
    selectOptions: displayTypeOptions,
    placeholder: 'Selecciona un tipo',
    required: {
      min: 'El tipo de visualización es requerido'
    }
  }
]

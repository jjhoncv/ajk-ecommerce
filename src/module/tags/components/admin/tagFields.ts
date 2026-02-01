import {
  type Field
} from '@/module/shared/components/FormCreate/types/fileManagement'

export const TagFields: Field[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: {
      min: 'Nombre es requerido'
    },
    placeholder: 'ej: Nuevo, Bestseller, Eco-Friendly'
  },
  {
    key: 'slug',
    label: 'URL amigable (slug)',
    type: 'text',
    placeholder: 'ej: nuevo (se genera automaticamente del nombre)'
  },
  {
    key: 'description',
    label: 'Descripcion',
    type: 'textarea',
    placeholder: 'Descripcion opcional del tag'
  },
  {
    key: 'color',
    label: 'Color (hex)',
    type: 'text',
    value: '#3B82F6',
    placeholder: '#3B82F6'
  },
  {
    key: 'is_active',
    label: 'Estado',
    type: 'select',
    value: '1',
    selectOptions: [
      { value: '1', label: 'Activo' },
      { value: '0', label: 'Inactivo' }
    ]
  },
  {
    key: 'display_order',
    label: 'Orden de visualizacion',
    type: 'text',
    value: '0',
    placeholder: '0'
  }
]

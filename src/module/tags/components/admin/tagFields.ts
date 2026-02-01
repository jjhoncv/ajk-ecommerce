import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'

export const TagFields: Field[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: {
      min: 'Nombre es requerido'
    },
    placeholder: 'ej: Nuevo, Bestseller, Oferta'
  },
  {
    key: 'slug',
    label: 'URL amigable (slug)',
    type: 'text',
    placeholder: 'ej: nuevo (se genera automaticamente)'
  },
  {
    key: 'description',
    label: 'Descripcion',
    type: 'textarea',
    placeholder: 'Descripcion opcional del tag'
  },
  {
    key: 'color',
    label: 'Color del badge (hex)',
    type: 'text',
    value: '#6B7280',
    placeholder: '#22C55E'
  },
  {
    key: 'display_order',
    label: 'Orden de visualizacion',
    type: 'text',
    value: '0',
    placeholder: '0'
  },
  {
    key: 'is_active',
    label: 'Estado',
    type: 'select',
    value: '1',
    selectOptions: [
      { id: '1', name: 'Activo' },
      { id: '0', name: 'Inactivo' }
    ]
  }
]

// src/module/tags/components/admin/tagFields.ts
import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'

export const TagFields: Field[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: {
      min: 'Nombre es requerido'
    },
    placeholder: 'Ej: Nuevo, Oferta, Tendencia'
  },
  {
    key: 'slug',
    label: 'URL amigable (slug)',
    type: 'text',
    placeholder: 'ej: nuevo-producto (se genera automaticamente)'
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
    placeholder: '#6B7280'
  },
  {
    key: 'display_order',
    label: 'Orden de visualizacion',
    type: 'text',
    value: '0',
    placeholder: '0'
  }
]

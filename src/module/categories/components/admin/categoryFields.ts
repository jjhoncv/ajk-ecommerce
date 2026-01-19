import {
  type Field,
  type FileOptions
} from '@/module/shared/components/FormCreate/types/fileManagement'

export const CategoryFileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 200, height: 200 },
    max: { width: 800, height: 800 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

export const CategoryFields: Field[] = [
  {
    key: 'name',
    label: 'Nombre de la categoría',
    type: 'text',
    required: {
      min: 'Nombre es requerido'
    }
  },
  {
    key: 'description',
    label: 'Descripción',
    type: 'textarea'
  },
  {
    key: 'parent_id',
    label: 'Categoría Padre',
    type: 'text'
  },
  {
    key: 'image_url',
    label: 'Imagen de la categoría',
    type: 'file',
    multiple: false,
    required: false,
    options: CategoryFileOptions
  },
  {
    key: 'display_order',
    label: 'Orden de visualización',
    type: 'text',
    placeholder: 'Menor número = mayor prioridad'
  },
  {
    key: 'show_nav',
    label: 'Mostrar en navegación',
    type: 'select',
    selectOptions: [
      { value: '1', label: 'Sí - Mostrar en menú' },
      { value: '0', label: 'No - Ocultar del menú' }
    ]
  }
]

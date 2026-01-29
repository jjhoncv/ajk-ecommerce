import {
  type Field,
  type FileOptions
} from '@/module/shared/components/FormCreate/types/fileManagement'

export const BrandFileOptions: FileOptions = {
  maxFileSize: 50 * 1024, // 50KB
  dimensions: {
    min: { width: 100, height: 100 },
    max: { width: 400, height: 400 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

export const BrandFields: Field[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: {
      min: 'Nombre es requerido'
    }
  },
  {
    key: 'image_url',
    label: 'Logo (400x400px, max 50KB)',
    type: 'file',
    multiple: false,
    options: BrandFileOptions
  }
]

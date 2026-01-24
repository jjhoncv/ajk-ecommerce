import {
  type Field,
  type FileOptions
} from '@/module/shared/components/FormCreate/types/fileManagement'

// Imagen cuadrada para la categoría (listado)
export const CategoryFileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 200, height: 200 },
    max: { width: 800, height: 800 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Banner desktop para la página de categoría
export const CategoryBannerFileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 1200, height: 300 },
    max: { width: 1920, height: 500 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Banner móvil para la página de categoría
export const CategoryBannerMobileFileOptions: FileOptions = {
  maxFileSize: 0.3 * 1024 * 1024, // 300KB
  dimensions: {
    min: { width: 600, height: 300 },
    max: { width: 800, height: 400 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

export const CategoryFields: Field[] = [
  // ═══════════════════════════════════════════════════════════════════
  // Información Básica
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'name',
    label: 'Nombre de la categoría',
    type: 'text',
    required: {
      min: 'Nombre es requerido'
    }
  },
  {
    key: 'slug',
    label: 'URL amigable (slug)',
    type: 'text',
    required: {
      min: 'Slug es requerido'
    },
    placeholder: 'ej: ropa-de-hombre (se genera automáticamente)'
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
    key: 'show_nav',
    label: 'Mostrar en navegación',
    type: 'select',
    selectOptions: [
      { value: '1', label: 'Sí - Mostrar en menú' },
      { value: '0', label: 'No - Ocultar del menú' }
    ]
  },
  {
    key: 'image_url',
    label: 'Imagen de la categoría (cuadrada)',
    type: 'file',
    multiple: false,
    required: false,
    options: CategoryFileOptions
  },

  // ═══════════════════════════════════════════════════════════════════
  // Banner de Página
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'banner_image',
    label: 'Banner Desktop (1200x300 - 1920x500)',
    type: 'file',
    multiple: false,
    required: false,
    options: CategoryBannerFileOptions
  },
  {
    key: 'banner_image_mobile',
    label: 'Banner Móvil (600x300 - 800x400)',
    type: 'file',
    multiple: false,
    required: false,
    options: CategoryBannerMobileFileOptions
  },
  {
    key: 'banner_title',
    label: 'Título del banner',
    type: 'text',
    placeholder: 'Dejar vacío para usar el nombre de la categoría'
  },
  {
    key: 'banner_subtitle',
    label: 'Subtítulo del banner',
    type: 'text'
  },
  {
    key: 'banner_description',
    label: 'Descripción del banner',
    type: 'textarea'
  },
  {
    key: 'banner_cta_text',
    label: 'Texto del botón CTA',
    type: 'text',
    placeholder: 'Ej: Ver productos, Comprar ahora'
  },
  {
    key: 'banner_cta_link',
    label: 'Enlace del botón CTA',
    type: 'text',
    placeholder: 'Ej: /search?category=1'
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEO
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'meta_title',
    label: 'Meta título',
    type: 'text',
    placeholder: 'Dejar vacío para usar el nombre de la categoría'
  },
  {
    key: 'meta_description',
    label: 'Meta descripción',
    type: 'textarea',
    placeholder: 'Descripción para motores de búsqueda (máx. 160 caracteres)'
  }
]

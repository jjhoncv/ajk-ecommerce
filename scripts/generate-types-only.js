const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Directorio donde Prisma genera los archivos
const prismaOutputDir = path.join(__dirname, '../src/types/database')
const typesOnlyDir = path.join(__dirname, '../src/types/prisma')

// Crear directorio para tipos únicamente
if (!fs.existsSync(typesOnlyDir)) {
  fs.mkdirSync(typesOnlyDir, { recursive: true })
}

// Generar cliente de Prisma temporalmente
console.log('Generando cliente de Prisma...')
execSync('npx prisma generate', { stdio: 'inherit' })

// Extraer solo los archivos de tipos que necesitamos
const filesToKeep = [
  'index.d.ts',
  'client.d.ts',
  'default.d.ts',
  'edge.d.ts',
  'wasm.d.ts'
]

console.log('Extrayendo solo archivos de tipos...')

filesToKeep.forEach((file) => {
  const sourcePath = path.join(prismaOutputDir, file)
  const destPath = path.join(typesOnlyDir, file)

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath)
    console.log(`✓ Copiado: ${file}`)
  }
})

// Crear un archivo index.ts limpio que solo exporte tipos
const indexContent = `// Tipos generados automáticamente por Prisma
// Solo tipos TypeScript, sin runtime

export type {
  // Modelos de la base de datos
  attribute_option_images,
  attribute_options,
  attributes,
  banner,
  brands,
  categories,
  customers,
  customers_addresses,
  permissions,
  product_categories,
  product_variants,
  products,
  promotion_variants,
  promotions,
  rating_images,
  roles,
  roles_sections,
  sections,
  services,
  services_images,
  users,
  variant_attribute_options,
  variant_images,
  variant_ratings,
  
  // Enums
  attribute_option_images_image_type,
  attributes_display_type,
  variant_images_image_type,
  promotions_discount_type,
  
  // Tipos de Prisma
  Prisma,
  PrismaClient,
} from './index.d';

// Re-exportar tipos específicos para facilitar el uso
export type {
  // Tipos de entrada para crear registros
  attribute_option_imagesCreateInput,
  attribute_optionsCreateInput,
  attributesCreateInput,
  brandsCreateInput,
  categoriesCreateInput,
  customersCreateInput,
  customers_addressesCreateInput,
  product_variantsCreateInput,
  productsCreateInput,
  promotion_variantsCreateInput,
  promotionsCreateInput,
  variant_ratingsCreateInput,
  
  // Tipos de actualización
  attribute_option_imagesUpdateInput,
  attribute_optionsUpdateInput,
  attributesUpdateInput,
  brandsUpdateInput,
  categoriesUpdateInput,
  customersUpdateInput,
  customers_addressesUpdateInput,
  product_variantsUpdateInput,
  productsUpdateInput,
  promotion_variantsUpdateInput,
  promotionsUpdateInput,
  variant_ratingsUpdateInput,
  
  // Tipos de selección
  attribute_option_imagesSelect,
  attribute_optionsSelect,
  attributesSelect,
  brandsSelect,
  categoriesSelect,
  customersSelect,
  customers_addressesSelect,
  product_variantsSelect,
  productsSelect,
  promotion_variantsSelect,
  promotionsSelect,
  variant_ratingsSelect,
  
  // Tipos de inclusión (relaciones)
  attribute_option_imagesInclude,
  attribute_optionsInclude,
  attributesInclude,
  brandsInclude,
  categoriesInclude,
  customersInclude,
  customers_addressesInclude,
  product_variantsInclude,
  productsInclude,
  promotion_variantsInclude,
  promotionsInclude,
  variant_ratingsInclude,
} from './index.d';
`

fs.writeFileSync(path.join(typesOnlyDir, 'index.ts'), indexContent)

// Limpiar archivos innecesarios del directorio original
console.log('Limpiando archivos innecesarios...')

const filesToDelete = fs.readdirSync(prismaOutputDir).filter((file) => {
  return !filesToKeep.includes(file) && file !== 'runtime'
})

filesToDelete.forEach((file) => {
  const filePath = path.join(prismaOutputDir, file)
  try {
    if (fs.statSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true })
    } else {
      fs.unlinkSync(filePath)
    }
    console.log(`✓ Eliminado: ${file}`)
  } catch (error) {
    console.warn(`⚠ No se pudo eliminar: ${file}`)
  }
})

// Eliminar directorio runtime si existe
const runtimeDir = path.join(prismaOutputDir, 'runtime')
if (fs.existsSync(runtimeDir)) {
  fs.rmSync(runtimeDir, { recursive: true, force: true })
  console.log('✓ Eliminado: runtime/')
}

console.log('\n✅ Generación de tipos completada!')
console.log(`📁 Tipos disponibles en: ${typesOnlyDir}`)
console.log('📝 Usa: import type { ... } from "@/types/prisma"')

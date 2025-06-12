import { execSync } from 'child_process'

console.log('🚀 Generando esquema GraphQL para tipos de dominio...')

try {
  // Generar esquema GraphQL usando Mesh
  execSync('npx mesh build --config .meshrc-domain.yaml', {
    stdio: 'inherit'
  })

  // Copiar el esquema generado
  execSync('cp .mesh/schema.graphql schema-domain.graphql', {
    stdio: 'inherit'
  })

  console.log('✅ Esquema de dominio generado correctamente')

  // NUEVO: Corregir relaciones automáticamente usando el script independiente
  console.log('🔧 Ejecutando corrector de relaciones...')
  execSync('node scripts/fix-schema-relationships.mjs', {
    stdio: 'inherit'
  })

  // Generar tipos TypeScript usando GraphQL Code Generator
  console.log('🔄 Generando tipos de dominio TypeScript...')
  execSync('npx graphql-codegen --config codegen-domain.yml', {
    stdio: 'inherit'
  })

  // execSync('rm schema-domain.graphql')

  console.log('✅ Tipos de dominio generados correctamente')
  console.log('📁 Archivo generado: src/types/domain/domain.d.ts')
} catch (error) {
  console.error('❌ Error al generar tipos de dominio:', error.message)
  process.exit(1)
}

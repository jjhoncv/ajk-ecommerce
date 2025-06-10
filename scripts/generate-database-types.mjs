import { execSync } from 'child_process'

console.log('🚀 Generando esquema GraphQL para base de datos...')

try {
  // Generar esquema GraphQL usando Mesh
  execSync('npx mesh build --config .meshrc-database.yaml', {
    stdio: 'inherit'
  })

  // Copiar el esquema generado
  execSync('cp .mesh/schema.graphql schema-database.graphql', {
    stdio: 'inherit'
  })

  console.log('✅ Esquema de base de datos generado correctamente')

  // Generar tipos TypeScript usando GraphQL Code Generator
  console.log('🔄 Generando tipos TypeScript...')
  execSync('npx graphql-codegen --config codegen-database.yml', {
    stdio: 'inherit'
  })
  execSync('rm schema-database.graphql')

  console.log('✅ Tipos de base de datos generados correctamente')
  console.log('📁 Archivo generado: src/types/database/database.d.ts')
} catch (error) {
  console.error('❌ Error al generar tipos de base de datos:', error.message)
  process.exit(1)
}

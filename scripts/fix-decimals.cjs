/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/fix-decimals.cjs
const { readFileSync, writeFileSync, existsSync } = require('fs')
const { resolve } = require('path')

function fixDecimals() {
  const typesPath = resolve(process.cwd(), 'src/types/database/index.d.ts')
  
  if (!existsSync(typesPath)) {
    console.error('❌ Types file not found:', typesPath)
    return
  }
  
  try {
    let content = readFileSync(typesPath, 'utf8')
    const original = content
    
    console.log('🔍 Searching for Decimal types...')
    
    // ✅ Solo transformar los tipos que realmente usas en tu código
    const transformations = [
      // En objetos de modelo (como tu $attribute_optionsPayload)
      {
        name: 'Model field with null union',
        pattern: /(\w+):\s*Prisma\.Decimal\s*\|\s*null(?!\s*\|\s*DecimalJsLike)/g,
        replacement: '$1: number | null'
      },
      {
        name: 'Model Decimal field',
        pattern: /(\w+):\s*Prisma\.Decimal(?!\s*[\|\[]|\s*JsLike)/g,
        replacement: '$1: number'
      },
      {
        name: 'Direct model Decimal with null',
        pattern: /(\w+):\s*Decimal\s*\|\s*null(?!\s*\|\s*JsLike)/g,
        replacement: '$1: number | null'
      },
      {
        name: 'Direct model Decimal field',
        pattern: /(\w+):\s*Decimal(?!\s*[\|\[]|JsLike|FieldRef)/g,
        replacement: '$1: number'
      }
    ]
    
    let totalChanges = 0
    
    transformations.forEach(({ name, pattern, replacement }) => {
      const matches = content.match(pattern)
      if (matches) {
        console.log(`  • ${name}: ${matches.length} matches`)
        content = content.replace(pattern, replacement)
        totalChanges += matches.length
      }
    })
    
    if (content !== original) {
      writeFileSync(typesPath, content)
      console.log(`✅ Fixed ${totalChanges} Decimal types to number`)
      
      // ✅ Verificar solo los tipos importantes
      const verification = readFileSync(typesPath, 'utf8')
      const userDecimals = verification.match(/(\w+):\s*(Prisma\.)?Decimal(?!\s*JsLike|FieldRef)/g)
      if (userDecimals && userDecimals.length > 0) {
        console.log(`⚠️  ${userDecimals.length} user Decimal types still found:`)
        userDecimals.slice(0, 5).forEach(match => {
          console.log(`  • ${match}`)
        })
      } else {
        console.log('✅ All user-facing Decimal types converted!')
        console.log('ℹ️  Internal Prisma Decimal references preserved (this is correct)')
      }
    } else {
      console.log('ℹ️  No user Decimal types found to convert')
    }
    
  } catch (error) {
    console.error('❌ Error fixing decimals:', error.message)
  }
}

fixDecimals()
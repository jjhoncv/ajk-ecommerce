import variantImageRepository from '@/backend/variant-image/VariantImage.repository'
import { existsSync, readdirSync, statSync } from 'fs'
import { mkdir, rename, rm } from 'fs/promises'
import { type NextRequest, NextResponse } from 'next/server'
import path, { join } from 'path'

// Función auxiliar para contar archivos recursivamente
function countFilesRecursive(dirPath: string): { files: number; folders: number } {
  let fileCount = 0
  let folderCount = 0

  try {
    const items = readdirSync(dirPath)

    for (const item of items) {
      const itemPath = join(dirPath, item)
      const stats = statSync(itemPath)

      if (stats.isDirectory()) {
        folderCount++
        const subCounts = countFilesRecursive(itemPath)
        fileCount += subCounts.files
        folderCount += subCounts.folders
      } else {
        fileCount++
      }
    }
  } catch (error) {
    console.error('Error counting files:', error)
  }

  return { files: fileCount, folders: folderCount }
}

export async function POST(req: NextRequest) {
  try {
    const { folderPath } = await req.json()

    if (!folderPath || typeof folderPath !== 'string') {
      return NextResponse.json(
        {
          message: 'Ruta de carpeta inválida',
          success: false
        },
        { status: 400 }
      )
    }

    // Sanitizar el nombre de la carpeta para evitar path traversal
    const safeFolderPath = path.normalize(folderPath).replace(/^(\.\.[\\/])+/, '')

    // Construir ruta completa: /public/uploads/{folderPath}
    const fullPath = join(process.cwd(), 'public', 'uploads', safeFolderPath)

    console.log('🔧 Backend - Creating folder:', {
      received: folderPath,
      sanitized: safeFolderPath,
      fullPath: fullPath
    })

    // Verificar que la ruta esté dentro del directorio permitido
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!fullPath.startsWith(uploadsDir)) {
      return NextResponse.json(
        {
          message: 'Ruta no permitida',
          success: false
        },
        { status: 403 }
      )
    }

    // Verificar si la carpeta ya existe
    if (existsSync(fullPath)) {
      console.log('⚠️ Folder already exists:', fullPath)
      return NextResponse.json(
        {
          message: 'La carpeta ya existe',
          success: false
        },
        { status: 400 }
      )
    }

    // Crear la carpeta
    await mkdir(fullPath, { recursive: true })
    console.log('✅ Folder created successfully:', fullPath)

    return NextResponse.json(
      {
        message: 'Carpeta creada exitosamente',
        success: true,
        folderPath: safeFolderPath
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      {
        message: error.message || 'Error al crear la carpeta',
        success: false
      },
      { status: 500 }
    )
  }
}

// PATCH - Renombrar carpeta
export async function PATCH(req: NextRequest) {
  try {
    const { oldPath, newName } = await req.json()

    if (!oldPath || !newName || typeof oldPath !== 'string' || typeof newName !== 'string') {
      return NextResponse.json(
        {
          message: 'Ruta antigua y nuevo nombre son requeridos',
          success: false
        },
        { status: 400 }
      )
    }

    // Sanitizar
    const safeOldPath = path.normalize(oldPath).replace(/^(\.\.[\\/])+/, '')
    const safeNewName = newName.trim().replace(/[^a-zA-Z0-9_-]/g, '-')

    // Construir rutas completas
    const oldFullPath = join(process.cwd(), 'public', 'uploads', safeOldPath)

    // Obtener el directorio padre de la carpeta antigua
    const parentDir = path.dirname(oldFullPath)
    const newFullPath = join(parentDir, safeNewName)

    console.log('🔄 Renaming folder:', {
      oldPath: safeOldPath,
      newName: safeNewName,
      oldFullPath,
      newFullPath
    })

    // Verificar que la carpeta antigua existe
    if (!existsSync(oldFullPath)) {
      return NextResponse.json(
        {
          message: 'La carpeta no existe',
          success: false
        },
        { status: 404 }
      )
    }

    // Verificar que no exista una carpeta con el nuevo nombre
    if (existsSync(newFullPath)) {
      return NextResponse.json(
        {
          message: 'Ya existe una carpeta con ese nombre',
          success: false
        },
        { status: 400 }
      )
    }

    // Buscar cuántas imágenes en la BD usan esta ruta
    const oldPathUrl = `/uploads/${safeOldPath}`
    const affectedImages = await variantImageRepository.findImagesByPathPattern(oldPathUrl)

    console.log('📊 Found images in database:', {
      count: affectedImages.length,
      oldPath: oldPathUrl
    })

    // Renombrar la carpeta físicamente
    await rename(oldFullPath, newFullPath)

    // Actualizar rutas en la base de datos
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const newRelativePath = path.relative(uploadsDir, newFullPath)
    const newPathUrl = `/uploads/${newRelativePath.replace(/\\/g, '/')}`

    let updatedRecords = 0
    if (affectedImages.length > 0) {
      updatedRecords = await variantImageRepository.updateImagePaths(
        oldPathUrl,
        newPathUrl
      )
    }

    console.log('✅ Folder renamed successfully', {
      oldPath: oldPathUrl,
      newPath: newPathUrl,
      updatedRecords
    })

    return NextResponse.json(
      {
        message: 'Carpeta renombrada exitosamente',
        success: true,
        newPath: newRelativePath,
        databaseUpdates: {
          imagesFound: affectedImages.length,
          recordsUpdated: updatedRecords
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error renaming folder:', error)
    return NextResponse.json(
      {
        message: error.message || 'Error al renombrar la carpeta',
        success: false
      },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar carpeta recursivamente
export async function DELETE(req: NextRequest) {
  try {
    const { folderPath } = await req.json()

    if (!folderPath || typeof folderPath !== 'string') {
      return NextResponse.json(
        {
          message: 'Ruta de carpeta inválida',
          success: false
        },
        { status: 400 }
      )
    }

    // Sanitizar
    const safeFolderPath = path.normalize(folderPath).replace(/^(\.\.[\\/])+/, '')
    const fullPath = join(process.cwd(), 'public', 'uploads', safeFolderPath)

    // Verificar que la carpeta existe
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        {
          message: 'La carpeta no existe',
          success: false
        },
        { status: 404 }
      )
    }

    // Contar archivos y subcarpetas
    const counts = countFilesRecursive(fullPath)

    // Buscar y contar registros de imágenes en la BD que usan esta ruta
    const folderPathUrl = `/uploads/${safeFolderPath}`
    const affectedImages = await variantImageRepository.findImagesByPathPattern(folderPathUrl)

    console.log('🗑️ Deleting folder:', {
      path: safeFolderPath,
      fullPath,
      files: counts.files,
      folders: counts.folders,
      databaseRecords: affectedImages.length
    })

    // Eliminar la carpeta físicamente
    await rm(fullPath, { recursive: true, force: true })

    // Eliminar registros de imágenes en la base de datos
    let deletedDbRecords = 0
    if (affectedImages.length > 0) {
      deletedDbRecords = await variantImageRepository.deleteImagesByPathPattern(folderPathUrl)
    }

    console.log('✅ Folder deleted successfully', {
      deletedFiles: counts.files,
      deletedFolders: counts.folders + 1,
      deletedDbRecords
    })

    return NextResponse.json(
      {
        message: 'Carpeta eliminada exitosamente',
        success: true,
        deleted: {
          files: counts.files,
          folders: counts.folders + 1, // +1 para incluir la carpeta principal
          databaseRecords: deletedDbRecords
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting folder:', error)
    return NextResponse.json(
      {
        message: error.message || 'Error al eliminar la carpeta',
        success: false
      },
      { status: 500 }
    )
  }
}

import { getFileTree } from '@/module/shared/lib/fileExplorer'
import { writeFileServer } from '@/module/shared/lib/writeFileServer'
import { existsSync } from 'fs'
import { unlink } from 'fs/promises'
import { type NextRequest, NextResponse } from 'next/server'
import path, { join } from 'path'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const currentPath = searchParams.get('path') || '' // Ruta actual dentro de /uploads

  // Construir ruta completa: /public/uploads/{currentPath}
  const basePath = '/public/uploads'
  const fullPath = currentPath ? `${basePath}/${currentPath}` : basePath

  const items = getFileTree(fullPath)

  const itemsFixPath = items.map((item) => ({
    ...item,
    path: item.path.replace('/public', ''),
    // Remover children para no enviar todo el árbol (solo el nivel actual)
    children: undefined
  }))

  const response = NextResponse.json(
    {
      message: 'archivos de la libreria',
      success: true,
      files: itemsFixPath,
      currentPath: currentPath || ''
    },
    {
      status: 200
    }
  )
  return response
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const nameField = formData.get('name')
    const subdirectory = formData.get('subdirectory') as string | null // Nuevo: subdirectorio (SKU)
    const files = formData.getAll(`${nameField}[]`) as File[]
    const customNames = formData.getAll('customNames[]') as string[] // Nombres personalizados

    const filesURL = await Promise.all(
      files.map(async (file, index) => {
        let uploadDir = join(process.cwd(), 'public', 'uploads')

        // Si hay subdirectorio, crear carpeta específica
        if (subdirectory && subdirectory.trim() !== '') {
          // Sanitizar el subdirectorio para evitar path traversal
          // Primero normalizar y remover intentos de subir niveles (..)
          const normalized = path.normalize(subdirectory).replace(/^(\.\.[\\/])+/, '')
          // Luego unir con uploadDir de forma segura
          uploadDir = join(uploadDir, normalized)

          console.log('📁 Upload directory:', {
            subdirectory,
            normalized,
            uploadDir
          })
        }

        // Obtener nombre personalizado correspondiente al índice del archivo
        const customName = customNames[index] || ''
        const fileUrl = await writeFileServer(uploadDir, file, customName)
        return fileUrl
      })
    )

    const response = NextResponse.json(
      {
        message: 'archivos subidos a la libreria',
        success: true,
        filesURL
      },
      {
        status: 200
      }
    )
    return response
  } catch (error: any) {
    const response = NextResponse.json(
      {
        message: error.message,
        success: false
      },
      { status: 500 }
    )
    return response
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Obtener la ruta del archivo desde el body
    const data = await request.json()
    const filePath = data.filePath // Por ejemplo: "/uploads/image123.jpg"

    // Validar que el path sea seguro (evitar path traversal)
    const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '')
    const fullPath = path.join(process.cwd(), 'public', safePath)

    // Verificar que el archivo existe
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'El archivo no existe' },
        { status: 404 }
      )
    }

    // Verificar que el archivo está dentro del directorio permitido
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fullPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Eliminar el archivo
    await unlink(fullPath)

    return NextResponse.json({
      message: 'Archivo eliminado correctamente'
    })
  } catch (error) {
    console.error('Error al eliminar archivo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el archivo' },
      { status: 500 }
    )
  }
}

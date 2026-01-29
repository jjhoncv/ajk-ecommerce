import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { adminAuthOptions } from '@/lib/auth/authAdmin'
import { mkdir, writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import StoreConfigService from '@/module/shared/services/store-config'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'La imagen no debe superar los 2MB' },
        { status: 400 }
      )
    }

    // Get current logo to delete old one
    const currentConfig = await StoreConfigService.getStoreConfig()
    const oldLogoUrl = currentConfig?.logoUrl

    // Create directory if not exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'logo')
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `logo-${timestamp}.${extension}`

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // URL for the logo
    const logoUrl = `/uploads/logo/${fileName}`

    // Update store config
    await StoreConfigService.updateStoreConfig({ logoUrl })

    // Delete old logo if exists and different from new one
    if (oldLogoUrl && oldLogoUrl !== logoUrl && oldLogoUrl.startsWith('/uploads/logo/')) {
      const oldFilePath = join(process.cwd(), 'public', oldLogoUrl)
      if (existsSync(oldFilePath)) {
        try {
          await unlink(oldFilePath)
        } catch (e) {
          console.error('Error deleting old logo:', e)
        }
      }
    }

    return NextResponse.json({
      success: true,
      logoUrl,
      message: 'Logo subido correctamente'
    })
  } catch (error) {
    console.error('Error uploading logo:', error)
    return NextResponse.json(
      { error: 'Error al subir el logo' },
      { status: 500 }
    )
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Get current logo
    const currentConfig = await StoreConfigService.getStoreConfig()
    const logoUrl = currentConfig?.logoUrl

    // Delete file if exists
    if (logoUrl && logoUrl.startsWith('/uploads/logo/')) {
      const filePath = join(process.cwd(), 'public', logoUrl)
      if (existsSync(filePath)) {
        await unlink(filePath)
      }
    }

    // Update store config
    await StoreConfigService.updateStoreConfig({ logoUrl: null })

    return NextResponse.json({
      success: true,
      message: 'Logo eliminado correctamente'
    })
  } catch (error) {
    console.error('Error deleting logo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el logo' },
      { status: 500 }
    )
  }
}

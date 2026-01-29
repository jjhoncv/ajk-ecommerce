import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { adminAuthOptions } from '@/lib/auth/authAdmin'
import StoreConfigService from '@/module/shared/services/store-config'
import { type UpdateStoreConfigData } from '@/module/shared/services/store-config'

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const config = await StoreConfigService.getStoreConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching store config:', error)
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(adminAuthOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = (await request.json()) as UpdateStoreConfigData

    const updatedConfig = await StoreConfigService.updateStoreConfig(body)

    if (!updatedConfig) {
      return NextResponse.json(
        { error: 'Error al actualizar configuración' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedConfig)
  } catch (error) {
    console.error('Error updating store config:', error)
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    )
  }
}

import { districtModel } from '@/module/districts/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

// GET /api/admin/districts - Get all districts (including inactive)
export async function GET() {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const districts = await districtModel.getAllDistricts()

    if (!districts) {
      return NextResponse.json({ districts: [] })
    }

    return NextResponse.json({ districts })
  } catch (error) {
    console.error('Error fetching districts:', error)
    return NextResponse.json(
      { error: 'Error al obtener los distritos' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/districts - Update district status
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, isActive } = body

    if (typeof id !== 'number' || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      )
    }

    await districtModel.updateDistrictStatus(id, isActive)

    return NextResponse.json({
      message: isActive ? 'Distrito activado' : 'Distrito desactivado'
    })
  } catch (error) {
    console.error('Error updating district:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el distrito' },
      { status: 500 }
    )
  }
}

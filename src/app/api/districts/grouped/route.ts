import { districtModel } from '@/module/districts/core'
import { NextResponse } from 'next/server'

// GET /api/districts/grouped - Get districts grouped by zone
export async function GET() {
  try {
    const grouped = await districtModel.getDistrictsGroupedByZone()

    if (!grouped) {
      return NextResponse.json({ districts: {} })
    }

    return NextResponse.json({ districts: grouped })
  } catch (error) {
    console.error('Error fetching grouped districts:', error)
    return NextResponse.json(
      { error: 'Error al obtener los distritos' },
      { status: 500 }
    )
  }
}

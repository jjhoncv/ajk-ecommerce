import { districtModel } from '@/module/districts/core'
import { NextResponse } from 'next/server'

// GET /api/districts - Get all active districts for Lima Metro
export async function GET() {
  try {
    const districts = await districtModel.getDistricts()

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

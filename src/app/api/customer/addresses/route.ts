// app/api/customer/addresses/route.ts
import { customerAddressModel } from '@/module/customers/core'
import { districtModel } from '@/module/districts/core'
import { authOptions } from '@/lib/auth/auth'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema de validación para crear dirección (con districtId)
const createAddressSchema = z.object({
  alias: z.string().min(1, 'El nombre de la dirección es requerido').max(50),
  districtId: z.number().min(1, 'El distrito es requerido'),
  streetName: z.string().min(1, 'El nombre de la calle es requerido').max(100),
  streetNumber: z.string().min(1, 'El número de la calle es requerido').max(10),
  apartment: z.string().max(20).optional(),
  reference: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional()
})

// Schema de validación para actualizar dirección
const updateAddressSchema = z.object({
  id: z.number().positive('ID de dirección inválido'),
  alias: z.string().min(1).max(50).optional(),
  districtId: z.number().min(1).optional(),
  streetName: z.string().min(1).max(100).optional(),
  streetNumber: z.string().min(1).max(10).optional(),
  apartment: z.string().max(20).optional(),
  reference: z.string().max(200).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const addresses = await customerAddressModel.getAddressByCustomer(
      parseInt(session.user.id)
    )

    return NextResponse.json({
      addresses: addresses || []
    })
  } catch (error) {
    console.error('Error en GET /api/customer/addresses:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    // Validar datos con Zod
    try {
      const validatedData = createAddressSchema.parse(body)

      // Obtener nombre del distrito
      const district = await districtModel.getDistrictById(validatedData.districtId)
      if (!district) {
        return NextResponse.json(
          { error: 'Distrito no válido' },
          { status: 400 }
        )
      }

      const newAddress = await customerAddressModel.createAddress({
        idCustomer: parseInt(session.user.id),
        alias: validatedData.alias,
        department: 'Lima',
        province: 'Lima',
        district: district.name,
        districtId: validatedData.districtId,
        streetName: validatedData.streetName,
        streetNumber: validatedData.streetNumber,
        apartment: validatedData.apartment,
        reference: validatedData.reference,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        isDefault: validatedData.isDefault || false
      })

      if (!newAddress) {
        return NextResponse.json(
          { error: 'Error al crear la dirección' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          message: 'Dirección creada correctamente',
          address: newAddress
        },
        { status: 201 }
      )
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors = validationError.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))

        return NextResponse.json(
          {
            error: 'Datos de entrada inválidos',
            details: errors
          },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error('Error en POST /api/customer/addresses:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    // Validar datos con Zod
    try {
      const validatedData = updateAddressSchema.parse(body)
      const { id, districtId, ...updateData } = validatedData

      // Verificar que la dirección pertenece al usuario
      const existingAddress = await customerAddressModel.getAddress(id)
      if (
        !existingAddress ||
        existingAddress.idCustomer !== parseInt(session.user.id)
      ) {
        return NextResponse.json(
          { error: 'Dirección no encontrada o no autorizada' },
          { status: 404 }
        )
      }

      // Si se actualiza el distrito, obtener el nombre
      let districtName: string | undefined
      if (districtId) {
        const district = await districtModel.getDistrictById(districtId)
        if (!district) {
          return NextResponse.json(
            { error: 'Distrito no válido' },
            { status: 400 }
          )
        }
        districtName = district.name
      }

      const updatedAddress = await customerAddressModel.updateAddress(
        id,
        {
          ...updateData,
          ...(districtId && { districtId, district: districtName })
        }
      )

      if (!updatedAddress) {
        return NextResponse.json(
          { error: 'Error al actualizar la dirección' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Dirección actualizada correctamente',
        address: updatedAddress
      })
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors = validationError.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message
        }))

        return NextResponse.json(
          {
            error: 'Datos de entrada inválidos',
            details: errors
          },
          { status: 400 }
        )
      }
      throw validationError
    }
  } catch (error) {
    console.error('Error en PUT /api/customer/addresses:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')

    if (!idParam) {
      return NextResponse.json(
        { error: 'ID de dirección requerido' },
        { status: 400 }
      )
    }

    const id = parseInt(idParam)
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: 'ID de dirección inválido' },
        { status: 400 }
      )
    }

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await customerAddressModel.getAddress(id)
    if (
      !existingAddress ||
      existingAddress.idCustomer !== parseInt(session.user.id)
    ) {
      return NextResponse.json(
        { error: 'Dirección no encontrada o no autorizada' },
        { status: 404 }
      )
    }

    // Verificar si es la única dirección del usuario
    const userAddresses = await customerAddressModel.getAddressByCustomer(
      parseInt(session.user.id)
    )

    if (userAddresses && userAddresses.length === 1) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu única dirección' },
        { status: 400 }
      )
    }

    // Verificar si es la dirección por defecto
    if (existingAddress.isDefault) {
      return NextResponse.json(
        {
          error:
            'No puedes eliminar la dirección por defecto. Establece otra dirección como predeterminada primero.'
        },
        { status: 400 }
      )
    }

    // Eliminar dirección (hard delete)
    await customerAddressModel.deleteAddress(id)

    return NextResponse.json({
      message: 'Dirección eliminada correctamente'
    })
  } catch (error) {
    console.error('Error en DELETE /api/customer/addresses:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { addressId } = body

    if (!addressId || typeof addressId !== 'number' || addressId <= 0) {
      return NextResponse.json(
        { error: 'ID de dirección requerido y válido' },
        { status: 400 }
      )
    }

    // Verificar que la dirección pertenece al usuario
    const existingAddress = await customerAddressModel.getAddress(addressId)
    if (
      !existingAddress ||
      existingAddress.idCustomer !== parseInt(session.user.id)
    ) {
      return NextResponse.json(
        { error: 'Dirección no encontrada o no autorizada' },
        { status: 404 }
      )
    }

    // Verificar si ya es la dirección por defecto
    if (existingAddress.isDefault) {
      return NextResponse.json(
        { message: 'Esta dirección ya es la predeterminada' },
        { status: 200 }
      )
    }

    // Establecer como dirección por defecto
    await customerAddressModel.setDefaultAddress(
      parseInt(session.user.id),
      addressId
    )

    return NextResponse.json({
      message: 'Dirección por defecto actualizada'
    })
  } catch (error) {
    console.error('Error en PATCH /api/customer/addresses:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

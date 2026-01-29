import { executeQuery } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { NextResponse, type NextRequest } from 'next/server'

// Secciones base del sistema admin
// NOTA: La URL debe coincidir con sectionUrl del AdminSidebar (sin /admin prefix)
// Secciones mínimas para el bootstrap inicial
// Las demás secciones ya deben existir en la tabla `sections` de la BD
const BASE_SECTIONS = [
  { name: 'Usuarios', url: '/users', image: 'users', displayOrder: 1 },
  { name: 'Roles', url: '/roles', image: 'shield', displayOrder: 2 },
  { name: 'Configuración', url: '/settings', image: 'settings', displayOrder: 3 },
  { name: 'Perfil', url: '/profile', image: 'user-circle', displayOrder: 99 }
]

// Secciones iniciales que debe tener el superadmin
const SUPERADMIN_INITIAL_SECTIONS = ['Usuarios', 'Roles', 'Configuración', 'Perfil']

/**
 * POST /api/admin/bootstrap
 *
 * Crea el primer usuario superadmin del sistema.
 * SOLO funciona cuando NO hay usuarios en la base de datos.
 * Una vez creado el primer usuario, esta ruta se desactiva automáticamente.
 *
 * Body:
 * {
 *   "name": "Admin",
 *   "lastname": "Principal",
 *   "email": "admin@example.com",
 *   "password": "securepassword123"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar si ya existen usuarios
    const existingUsers = await executeQuery<[{ count: number }]>({
      query: 'SELECT COUNT(*) as count FROM users'
    })

    if (existingUsers[0].count > 0) {
      return NextResponse.json(
        {
          error: 'Bootstrap deshabilitado. Ya existen usuarios en el sistema.',
          success: false
        },
        { status: 403 }
      )
    }

    // Obtener datos del body
    const { name, lastname, email, password } = await request.json()

    // Validaciones
    if (!name || !lastname || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos: name, lastname, email, password', success: false },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres', success: false },
        { status: 400 }
      )
    }

    // 1. Verificar/crear las secciones del sistema
    const existingSections = await executeQuery<Array<{ id: number; name: string }>>({
      query: 'SELECT id, name FROM sections'
    })

    const existingSectionNames = existingSections?.map(s => s.name) || []

    // Insertar secciones que no existen
    for (const section of BASE_SECTIONS) {
      if (!existingSectionNames.includes(section.name)) {
        await executeQuery({
          query: 'INSERT INTO sections (name, url, image, display_order) VALUES (?, ?, ?, ?)',
          values: [section.name, section.url, section.image, section.displayOrder]
        })
      }
    }

    // 2. Verificar que existe el rol superadmin (id = 1)
    const superadminRole = await executeQuery<Array<{ id: number }>>({
      query: 'SELECT id FROM roles WHERE id = 1'
    })

    if (!superadminRole || superadminRole.length === 0) {
      // Crear el rol superadmin si no existe
      await executeQuery({
        query: 'INSERT INTO roles (id, name, description) VALUES (1, ?, ?)',
        values: ['superadmin', 'Super Administrador con acceso total']
      })
    }

    // 3. Obtener IDs de las secciones iniciales para el superadmin
    const initialSections = await executeQuery<Array<{ id: number; name: string }>>({
      query: `SELECT id, name FROM sections WHERE name IN (${SUPERADMIN_INITIAL_SECTIONS.map(() => '?').join(', ')})`,
      values: SUPERADMIN_INITIAL_SECTIONS
    })

    // 4. Crear roles_sections para el superadmin (rol_id = 1)
    for (const section of initialSections || []) {
      // Verificar si ya existe la relación
      const exists = await executeQuery<Array<{ id: number }>>({
        query: 'SELECT id FROM roles_sections WHERE id_rol = 1 AND id_section = ?',
        values: [section.id]
      })

      if (!exists || exists.length === 0) {
        await executeQuery({
          query: 'INSERT INTO roles_sections (id_rol, id_section) VALUES (1, ?)',
          values: [section.id]
        })
      }
    }

    // 5. Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // 6. Crear el usuario superadmin
    const result = await executeQuery<{ insertId: number }>({
      query: `
        INSERT INTO users (name, lastname, email, password, role_id, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, 1, NOW(), NOW())
      `,
      values: [name, lastname, email, hashedPassword]
    })

    const userId = (result as any).insertId

    return NextResponse.json({
      success: true,
      message: 'Usuario superadmin creado exitosamente',
      data: {
        id: userId,
        name,
        lastname,
        email,
        role: 'superadmin',
        sections: SUPERADMIN_INITIAL_SECTIONS
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error en bootstrap:', error)
    return NextResponse.json(
      { error: 'Error al crear usuario inicial', success: false },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/bootstrap
 *
 * Verifica si el bootstrap está disponible (no hay usuarios)
 */
export async function GET() {
  try {
    const existingUsers = await executeQuery<[{ count: number }]>({
      query: 'SELECT COUNT(*) as count FROM users'
    })

    const isAvailable = existingUsers[0].count === 0

    return NextResponse.json({
      available: isAvailable,
      message: isAvailable
        ? 'Bootstrap disponible. No hay usuarios en el sistema.'
        : 'Bootstrap no disponible. Ya existen usuarios.'
    })

  } catch (error) {
    console.error('Error verificando bootstrap:', error)
    return NextResponse.json(
      { error: 'Error al verificar estado', available: false },
      { status: 500 }
    )
  }
}

# AJK E-commerce

Este proyecto es una aplicación de comercio electrónico desarrollada con Next.js, que incluye funcionalidades de autenticación, carrito de compras y más.

## Estructura del Proyecto

```
ajk-ecommerce/
├── public/                  # Archivos estáticos
├── src/
│   ├── app/                 # Rutas de la aplicación (Next.js App Router)
│   │   ├── api/             # API endpoints
│   │   │   ├── auth/        # Autenticación con NextAuth.js
│   │   │   └── register/    # Registro de usuarios
│   ├── components/          # Componentes React
│   │   ├── layout/          # Componentes de layout
│   │   ├── sections/        # Secciones de página
│   │   └── ui/              # Componentes de UI reutilizables
│   ├── config/              # Configuraciones
│   ├── db/                  # Esquemas de base de datos
│   ├── helpers/             # Funciones auxiliares
│   ├── hooks/               # Hooks personalizados
│   ├── interfaces/          # Interfaces TypeScript
│   ├── lib/                 # Bibliotecas y utilidades
│   ├── models/              # Modelos de datos
│   ├── providers/           # Proveedores de contexto
│   ├── services/            # Servicios
│   ├── store/               # Estado global
│   └── types/               # Tipos TypeScript
```

## Características

- **Autenticación**: Sistema de autenticación completo con NextAuth.js
- **Base de datos**: Conexión a MySQL para almacenar usuarios y roles
- **Carrito de compras**: Funcionalidad de carrito de compras
- **Interfaz de usuario**: Componentes UI reutilizables con Tailwind CSS

## Requisitos

- Node.js 18.x o superior
- MySQL 8.0 o superior

## Configuración

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/ajk-ecommerce.git
   cd ajk-ecommerce
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   - Copia el archivo `.env.local.example` a `.env.local`
   - Actualiza las variables con tus propios valores

4. Configura la base de datos:

   - Crea una base de datos MySQL
   - Ejecuta el script SQL en `src/db/schema.sql`

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Autenticación

El sistema de autenticación utiliza NextAuth.js con un proveedor de credenciales personalizado que se conecta a MySQL. Los usuarios pueden:

- Registrarse con nombre de usuario, nombre, apellido, correo electrónico y contraseña
- Iniciar sesión con correo electrónico y contraseña
- Cerrar sesión

La autenticación está implementada siguiendo las mejores prácticas de Next.js:

- **Componentes de servidor**: Obtienen la sesión del usuario desde el servidor
- **Componentes de cliente**: Manejan la interacción del usuario y los modales
- **Middleware**: Protege las rutas privadas y redirige a usuarios no autenticados
- **Hidratación**: El estado de autenticación se obtiene desde el servidor y se hidrata al cliente

## Modelos de Datos

### Usuario

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  name: string;
  lastname: string;
  role_id: string;
  role?: Role;
  created_at?: Date;
  updated_at?: Date;
  emailVerified?: Date;
}
```

### Rol

```typescript
interface Role {
  id: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}
```

## Servicios

### UserService

Proporciona métodos para:

- `login`: Autenticar un usuario con email y contraseña
- `register`: Registrar un nuevo usuario
- `getUserById`: Obtener un usuario por su ID
- `getUserByEmail`: Obtener un usuario por su email

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import ClientAuthButton from './ClientAuthButton'

export default async function ServerAuthButton() {
  // Obtener la sesión del servidor para el renderizado inicial
  const session = await getServerSession(authOptions)

  const isAuthenticated = !!session

  // Pasar la información inicial al componente de cliente
  return (
    <ClientAuthButton
      initialIsAuthenticated={isAuthenticated}
      initialUserName={session?.user?.name || ''}
      initialUserEmail={session?.user?.email || ''}
      initialUserId={session?.user?.id || ''}
    />
  )
}

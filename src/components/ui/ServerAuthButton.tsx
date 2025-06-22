import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { type JSX } from 'react'
import ClientAuthButton from './ClientAuthButton'

export default async function ServerAuthButton(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions)
  const isAuthenticated = session !== null

  return (
    <ClientAuthButton
      initialIsAuthenticated={isAuthenticated}
      initialUserName={session?.user?.name ?? ''}
      initialUserEmail={session?.user?.email ?? ''}
      initialUserId={session?.user?.id ?? ''}
      variant="header"
    />
  )
}

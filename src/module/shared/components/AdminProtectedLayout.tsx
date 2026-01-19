import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { LayoutPageAdmin } from './LayoutPageAdmin'

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(adminAuthOptions)

  if (!session?.user) return null

  return (
    <>
      <LayoutPageAdmin>{children}</LayoutPageAdmin>
      <Toaster />
    </>
  )
}

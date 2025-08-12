import { auth } from '@/auth'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { LayoutPageAdmin } from '../components/admin/components/LayoutPageAdmin'

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) return null

  return (
    <>
      <LayoutPageAdmin user={session.user.data}>{children}</LayoutPageAdmin>
      <Toaster />
    </>
  )
}

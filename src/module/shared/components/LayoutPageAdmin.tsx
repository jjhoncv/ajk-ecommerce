import auth from '@/module/shared/lib/auth/authAdmin'

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

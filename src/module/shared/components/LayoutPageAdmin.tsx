import auth from '@/module/shared/lib/auth'
import { Toaster } from 'react-hot-toast'

interface LayoutPageAdminProps {
  children?: React.ReactNode
}

export async function LayoutPageAdmin({
  children
}: LayoutPageAdminProps): Promise<React.JSX.Element | null> {
  const session = await auth()

  if (session?.user == null) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              AJK E-commerce Admin
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Hola, <span className="font-medium">{session.user.name}</span>
              </span>
              {session.user.roleName != null &&
                session.user.roleName !== '' && (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    {session.user.roleName}
                  </span>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <Toaster />
    </div>
  )
}

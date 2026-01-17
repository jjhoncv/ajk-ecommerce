import auth from '@/module/shared/lib/auth'
import { Toaster } from 'react-hot-toast'
import { AdminSidebar } from './AdminSidebar'

interface LayoutPageAdminProps {
  children?: React.ReactNode
}

export async function LayoutPageAdmin({
  children
}: LayoutPageAdminProps): Promise<React.JSX.Element | null> {
  const session = await auth()

  if (session?.user == null) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        sections={session.user.sections ?? []}
        userName={session.user.name}
        userEmail={session.user.email}
        userRole={session.user.roleName}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Spacer for mobile menu button */}
              <div className="w-10 lg:hidden" />

              <h1 className="text-xl font-semibold text-gray-900">
                AJK E-commerce Admin
              </h1>

              <div className="flex items-center space-x-4">
                <span className="hidden text-sm text-gray-700 sm:block">
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
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  )
}

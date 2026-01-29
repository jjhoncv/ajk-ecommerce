'use client'

import { ErrorPage } from '@/module/shared/components/ErrorPage'

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      backUrl="/admin"
      backLabel="Volver al panel"
      moduleName="Admin"
    />
  )
}

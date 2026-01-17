// 📄 app/auth/register/page.tsx
import RegisterClient from './RegisterClient'

interface RegisterPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams

  return <RegisterClient redirectUrl={params.redirect} />
}

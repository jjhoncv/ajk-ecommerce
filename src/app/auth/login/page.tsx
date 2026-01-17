// 📄 app/auth/login/page.tsx
import LoginClient from './LoginClient'

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams

  return <LoginClient redirectUrl={params.redirect} />
}

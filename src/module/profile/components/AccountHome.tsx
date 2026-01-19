'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const AccountHome = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/account/edit-profile')
  }, [])
  return null
}

export default AccountHome

'use client'
import { siteConfig } from '@/config'
import { Monitor } from 'lucide-react'
import Link from 'next/link'
import { type JSX } from 'react'

const Logo = (): JSX.Element => {
  return (
    <div className="mb-4 mt-4 flex flex-col gap-1">
      <Link href="/" className="flex items-center gap-2">
        <Monitor className="h-8 w-8 text-primary" />
        <span className="font-roboto text-2xl font-bold leading-8 text-primary">
          {siteConfig.name}
        </span>
      </Link>
      <p className="text-sm text-gray-600">{siteConfig.description}</p>
    </div>
  )
}

export default Logo

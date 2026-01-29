import StoreConfigService from '@/module/shared/services/store-config'
import Image from 'next/image'
import Link from 'next/link'
import { Monitor } from 'lucide-react'
import { type JSX } from 'react'

interface ServerLogoProps {
  showDescription?: boolean
  className?: string
}

const ServerLogo = async ({
  showDescription = true,
  className = ''
}: ServerLogoProps): Promise<JSX.Element> => {
  const storeConfig = await StoreConfigService.getStoreConfig()

  const storeName = storeConfig?.storeName || 'Mi Tienda'
  const logoUrl = storeConfig?.logoUrl
  const logoWidth = storeConfig?.logoWidth || 150
  const logoHeight = storeConfig?.logoHeight || 50
  const description = storeConfig?.storeDescription

  // Si hay logo, mostrar solo la imagen con las dimensiones configuradas
  if (logoUrl) {
    return (
      <Link href="/" className={className}>
        <Image
          src={logoUrl}
          alt={storeName}
          width={logoWidth}
          height={logoHeight}
          className="object-contain"
          style={{ width: logoWidth, height: logoHeight }}
        />
      </Link>
    )
  }

  // Sin logo: mostrar icono + nombre + descripción
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Link href="/" className="flex items-center gap-2">
        <Monitor className="h-8 w-8 text-primary" />
        <span className="font-roboto text-2xl font-bold leading-8 text-primary">
          {storeName}
        </span>
      </Link>
      {showDescription && description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  )
}

export default ServerLogo

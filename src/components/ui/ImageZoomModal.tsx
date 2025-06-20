'use client'
import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ImageZoomModalProps {
  isOpen: boolean
  imageUrl: string
  altText: string
  onClose: () => void
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  imageUrl,
  altText,
  onClose
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative flex h-full max-h-full w-full max-w-7xl items-center justify-center">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          aria-label="Cerrar zoom"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Imagen ampliada */}
        <div className="max-h-4xl relative h-full w-full max-w-4xl">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default ImageZoomModal

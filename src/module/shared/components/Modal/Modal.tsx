'use client'
import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  zIndex?: number
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  zIndex = 9999
}) => {
  const backdropRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => { setMounted(false) }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const timer = setTimeout(() => { setIsVisible(true) }, 10)
      return () => { clearTimeout(timer) }
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => { setShouldRender(false) }, 200)
      return () => { clearTimeout(timer) }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Handle click on backdrop (close only if clicking directly on backdrop, not on modal content)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose()
    }
  }

  if (!mounted || !shouldRender) return null

  const modalContent = (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4 overflow-y-auto',
        'transition-all duration-200 ease-out',
        isVisible ? 'bg-black/98' : 'bg-transparent'
      )}
      style={{
        zIndex,
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.7)' : 'transparent'
      }}
    >
      <div
        className={cn(
          'w-full max-w-md bg-white px-10 py-5 shadow-xl my-8',
          'max-h-[90vh] overflow-y-auto',
          'transform transition-all duration-200 ease-out',
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-95 opacity-0',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

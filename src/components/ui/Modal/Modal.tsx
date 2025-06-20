'use client'
import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  // 👈 ASEGURAR QUE ESTAMOS EN EL CLIENTE
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // 👈 MANEJAR ANIMACIONES DE ENTRADA Y SALIDA
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => setShouldRender(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevenir scroll del body cuando está abierto
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

  // Manejar tecla Escape para cerrar
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

  if (!mounted || !shouldRender) return null

  // 👈 MÚLTIPLES OPCIONES PARA EL FONDO - ELIGE LA QUE FUNCIONE
  const modalContent = (
    <div
      // Opción 1: Con bg-black/80 (sintaxis moderna)
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center p-4',
        'transition-all duration-200 ease-out',
        isVisible ? 'bg-black/98' : 'bg-transparent'
      )}
      // 👈 OPCIÓN 2: Forzar con style inline (garantizado)
      style={{
        backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.7)' : 'transparent'
      }}
    >
      <div
        ref={modalRef}
        className={cn(
          'w-full max-w-md overflow-hidden bg-white px-10 py-5 shadow-xl',
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

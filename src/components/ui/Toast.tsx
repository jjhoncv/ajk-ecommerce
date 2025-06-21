'use client'
import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ToastPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'center'

interface ToastProps {
  message: string
  className?: string
  position?: ToastPosition
}

const Toast: React.FC<ToastProps> = ({
  message,
  className,
  position = 'bottom-right'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 👈 ASEGURAR QUE ESTAMOS EN EL CLIENTE
  useEffect(() => {
    setMounted(true)
    return () => { setMounted(false) }
  }, [])

  useEffect(() => {
    // Mostrar el toast con una pequeña animación
    setIsVisible(true)

    // Ocultar el toast después de 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2700) // Un poco menos que el tiempo en useCart para que la animación termine antes

    return () => { clearTimeout(timer) }
  }, [message])

  // 👈 CLASES DE POSICIONAMIENTO
  const getPositionClasses = (pos: ToastPosition) => {
    const positions = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      center: 'left-0 right-0 top-0 bottom-0'
    }
    return positions[pos]
  }

  // 👈 ANIMACIÓN SEGÚN POSICIÓN
  const getAnimationClasses = (pos: ToastPosition, visible: boolean) => {
    const animations = {
      'bottom-right': visible
        ? 'translate-y-0 opacity-100'
        : 'translate-y-10 opacity-0',
      'bottom-left': visible
        ? 'translate-y-0 opacity-100'
        : 'translate-y-10 opacity-0',
      'bottom-center': visible
        ? 'translate-y-0 opacity-100'
        : 'translate-y-10 opacity-0',
      'top-right': visible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-10 opacity-0',
      'top-left': visible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-10 opacity-0',
      'top-center': visible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-10 opacity-0',
      center: visible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-10 opacity-0'
    }
    return animations[pos]
  }

  // 👈 NO RENDERIZAR SI NO ESTÁ MONTADO
  if (!mounted) return null

  // 👈 CONTENIDO DEL TOAST
  const toastContent = (
    <div
      className={cn(
        'fixed z-[9999] rounded-lg bg-secondary px-4 py-3 text-white shadow-lg transition-all duration-300',
        getPositionClasses(position),
        getAnimationClasses(position, isVisible),
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <p>{message}</p>
      </div>
    </div>
  )

  // 👈 USAR PORTAL PARA RENDERIZAR EN document.body
  return createPortal(toastContent, document.body)
}

export default Toast

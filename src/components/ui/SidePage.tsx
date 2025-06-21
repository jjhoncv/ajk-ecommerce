// SidePage.tsx - Con onClose handler
'use client'
import React, { type ReactNode, useEffect, useRef, useState } from 'react'

interface SidePageProps {
  isOpen: boolean
  onClose: () => void // 👈 AGREGADO
  children: ReactNode
  direction?: 'left' | 'right'
  width?: number
  preventInitialAnimation?: boolean
  closeOnEscape?: boolean // 👈 OPCIONAL
  closeOnClickOutside?: boolean // 👈 OPCIONAL
}

const SidePage: React.FC<SidePageProps> = ({
  isOpen,
  onClose, // 👈 AGREGADO
  children,
  direction = 'right',
  width = 400,
  preventInitialAnimation = false,
  closeOnEscape = true, // 👈 NUEVO
  closeOnClickOutside = true // 👈 NUEVO
}) => {
  const [hasInteracted, setHasInteracted] = useState(!preventInitialAnimation)
  const sidePageRef = useRef<HTMLDivElement>(null) // 👈 REF PARA CLICK OUTSIDE

  useEffect(() => {
    const body = document.body
    const shouldAnimate = hasInteracted || !preventInitialAnimation

    if (isOpen) {
      const marginProperty =
        direction === 'right' ? 'marginRight' : 'marginLeft'
      body.style[marginProperty] = `${width}px`

      if (shouldAnimate) {
        body.style.transition = 'margin 150ms ease-out'
      } else {
        body.style.transition = 'none'
        setTimeout(() => { setHasInteracted(true) }, 100)
      }
    } else {
      body.style.marginLeft = '0'
      body.style.marginRight = '0'

      if (shouldAnimate) {
        body.style.transition = 'margin 150ms ease-out'
      }

      if (!hasInteracted) {
        setHasInteracted(true)
      }
    }

    return () => {
      if (body) {
        body.style.marginLeft = ''
        body.style.marginRight = ''
        body.style.transition = ''
      }
    }
  }, [isOpen, width, direction, hasInteracted, preventInitialAnimation])

  // 👈 MANEJAR TECLA ESCAPE
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, closeOnEscape])

  // 👈 MANEJAR CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        closeOnClickOutside &&
        sidePageRef.current &&
        !sidePageRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, closeOnClickOutside])

  const positionClass = direction === 'right' ? 'right-0' : 'left-0'

  return (
    <div
      ref={sidePageRef} // 👈 REF AGREGADA
      className={`fixed top-0 z-40 h-full overflow-auto bg-white shadow-xl transition-transform duration-150 ease-out ${positionClass} ${
        isOpen
          ? 'translate-x-0'
          : direction === 'right'
            ? 'translate-x-full'
            : '-translate-x-full'
      }`}
      style={{ width: `${width}px` }}
    >
      {children}
    </div>
  )
}

export default SidePage

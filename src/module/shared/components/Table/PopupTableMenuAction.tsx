import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export const PopupTableMenuAction = () => {
  const [open, setOpen] = useState<{
    item?: any
    show: boolean
    target?: HTMLElement
    render?: (id: string) => React.ReactNode
  }>()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  const updateMenuPosition = () => {
    if (!open?.target || !dropdownRef.current) return

    const targetRect = open.target.getBoundingClientRect()
    const menuRect = dropdownRef.current.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const menuWidth = 192 // w-48 = 12rem = 192px

    // Posicionar debajo del botón, alineado a la derecha
    let top = targetRect.bottom + 4
    let left = targetRect.right - menuWidth

    // Si no hay espacio abajo, posicionar arriba
    if (top + menuRect.height > windowHeight) {
      top = targetRect.top - menuRect.height - 4
    }

    // Si no hay espacio a la izquierda, ajustar
    if (left < 8) {
      left = 8
    }

    // Si no hay espacio a la derecha, ajustar
    if (left + menuWidth > windowWidth - 8) {
      left = windowWidth - menuWidth - 8
    }

    // Evitar que el menú salga de la pantalla
    top = Math.max(8, Math.min(top, windowHeight - menuRect.height - 8))

    setMenuPosition({ top, left })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        event.target !== open?.target
      ) {
        setOpen({ show: false })
      }
    }

    const handleResize = () => {
      updateMenuPosition()
    }

    const handleScroll = () => {
      updateMenuPosition()
    }

    const handlePopupEvent = (e: CustomEvent) => {
      e.stopImmediatePropagation()
      const targetElement = e.detail.target as HTMLElement
      const render = e.detail.render as (id: string) => React.ReactNode
      const item = e.detail.item

      setOpen((prev) => ({
        item,
        show: !prev?.show,
        target: targetElement,
        render
      }))
    }

    if (open?.show) {
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, true)
      document.addEventListener('mousedown', handleClickOutside)
      requestAnimationFrame(updateMenuPosition)
    }

    document.addEventListener(
      'sendPopupEvent',
      handlePopupEvent as EventListener
    )

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener(
        'sendPopupEvent',
        handlePopupEvent as EventListener
      )
    }
  }, [open?.show, open?.target, open?.render, open?.item])

  if (!open?.show) return null

  const menuContent = (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 9999
      }}
      className="w-48 rounded-lg border bg-white py-1 shadow-lg"
    >
      <div className="flex flex-col gap-1">
        {open?.render?.(open.item.id)}
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null

  return createPortal(menuContent, document.body)
}

export default PopupTableMenuAction

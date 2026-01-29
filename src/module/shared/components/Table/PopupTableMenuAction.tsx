import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface PopupState {
  item: any
  show: boolean
  target: HTMLElement
  render: (id: string) => React.ReactNode
}

export const PopupTableMenuAction = () => {
  const [popupState, setPopupState] = useState<PopupState | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  // Use ref to store the current popup state for event handler
  const popupStateRef = useRef<PopupState | null>(null)
  popupStateRef.current = popupState

  const updateMenuPosition = useCallback(() => {
    if (!popupState?.target || !dropdownRef.current) return

    const targetRect = popupState.target.getBoundingClientRect()
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
  }, [popupState?.target])

  // Handle popup events with stable listener
  useEffect(() => {
    const handlePopupEvent = (e: CustomEvent) => {
      e.stopImmediatePropagation()
      const targetElement = e.detail.target as HTMLElement
      const render = e.detail.render as (id: string) => React.ReactNode
      const item = e.detail.item

      const currentState = popupStateRef.current

      // Check if clicking the same item (by ID, not DOM element)
      const isSameItem = currentState?.item?.id === item?.id
      const isCurrentlyShowing = currentState?.show === true

      if (isSameItem && isCurrentlyShowing) {
        // Toggle off - clicking same item's button while open
        setPopupState(null)
      } else {
        // Open for new item (or reopen for same item if was closed)
        setPopupState({
          item,
          show: true,
          target: targetElement,
          render
        })
      }
    }

    document.addEventListener('sendPopupEvent', handlePopupEvent as EventListener)

    return () => {
      document.removeEventListener('sendPopupEvent', handlePopupEvent as EventListener)
    }
  }, []) // Empty deps - handler uses ref for current state

  // Handle click outside
  useEffect(() => {
    if (!popupState?.show) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        event.target !== popupState?.target
      ) {
        setPopupState(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [popupState?.show, popupState?.target])

  // Handle resize and scroll
  useEffect(() => {
    if (!popupState?.show) return

    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)
    requestAnimationFrame(updateMenuPosition)

    return () => {
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [popupState?.show, updateMenuPosition])

  if (!popupState?.show) return null

  const menuContent = (
    <div
      id="popup-table-menu"
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
        {popupState.render(popupState.item.id)}
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null

  return createPortal(menuContent, document.body)
}

export default PopupTableMenuAction

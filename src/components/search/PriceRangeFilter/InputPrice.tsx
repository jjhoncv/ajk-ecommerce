import React from 'react'

interface InputPriceProps {
  value: string
  onChange: (value: string) => void
  onKeyPress: (e: React.KeyboardEvent) => void
  placeholder: string
  hasError: boolean
}

const InputPrice: React.FC<InputPriceProps> = ({
  value,
  onChange,
  onKeyPress,
  placeholder,
  hasError
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir teclas de control (backspace, delete, tab, escape, enter, etc.)
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Escape' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      (e.key === 'a' && e.ctrlKey) || // Ctrl+A
      (e.key === 'c' && e.ctrlKey) || // Ctrl+C
      (e.key === 'v' && e.ctrlKey) || // Ctrl+V
      (e.key === 'x' && e.ctrlKey) // Ctrl+X
    ) {
      return
    }

    // Permitir solo números y punto decimal
    if (!/[0-9.]/.test(e.key)) {
      e.preventDefault()
      return
    }

    // Prevenir múltiples puntos decimales
    if (e.key === '.' && value.includes('.')) {
      e.preventDefault()
      return
    }

    // Llamar al handler original si existe
    onKeyPress(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Permitir string vacío
    if (newValue === '') {
      onChange('')
      return
    }

    // Validar que sea un número válido
    if (/^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue)
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={`w-full rounded-sm border px-3 py-2 text-sm ${
        hasError ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
    />
  )
}

export default InputPrice

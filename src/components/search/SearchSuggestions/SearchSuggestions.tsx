'use client'
import { searchSuggestionsService } from '@/services/search/searchSuggestions'
import { ArrowUpLeft, Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

interface SearchSuggestionsProps {
  onSearch: (query?: string) => void
  placeholder?: string
  className?: string
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  onSearch,
  placeholder = 'Buscar productos...',
  className = ''
}) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Función para resaltar el texto de búsqueda en las sugerencias
  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text

    const regex = new RegExp(
      `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    )
    const parts = text.split(regex)

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <strong key={index} className="font-bold text-gray-900">
            {part}
          </strong>
        )
      }
      return part
    })
  }

  // Función para obtener sugerencias con debounce
  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const results = await searchSuggestionsService.getSuggestions(
        searchQuery,
        8
      )
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Error al obtener sugerencias:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar cambios en el input con debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    // Limpiar el debounce anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Configurar nuevo debounce
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (query === '') {
      onSearch()
    }

    if (query.trim()) {
      onSearch(query.trim())
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  // Manejar clic en una sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else if (query.trim()) {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Limpiar búsqueda
  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Limpiar debounce al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-3xl border border-gray-300 py-3 pl-10 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary p-2 text-white transition-colors hover:bg-secondary"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Sugerencias */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-sm border border-gray-200 bg-white shadow-lg"
        >
          {isLoading ? (
            <div className="p-3 text-center text-gray-500">
              <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Buscando...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => { handleSuggestionClick(suggestion) }}
                    className={`w-full px-4 py-2 text-left transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                      index === selectedIndex ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Search className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="truncate text-gray-700">
                          {highlightMatch(suggestion, query)}
                        </span>
                      </div>
                      <ArrowUpLeft className="h-5 w-5 stroke-1 text-gray-500" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchSuggestions

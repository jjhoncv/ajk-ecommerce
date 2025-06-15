export interface SearchSuggestionsService {
  getSuggestions: (query: string, limit?: number) => Promise<string[]>
}

export class SearchSuggestionsServiceImpl implements SearchSuggestionsService {
  async getSuggestions(query: string, limit: number = 10): Promise<string[]> {
    try {
      if (!query || query.trim().length < 2) {
        return []
      }

      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
      )

      if (!response.ok) {
        throw new Error('Error al obtener sugerencias')
      }

      const suggestions: string[] = await response.json()
      return suggestions
    } catch (error) {
      console.error('Error en SearchSuggestionsService:', error)
      return []
    }
  }
}

export const searchSuggestionsService = new SearchSuggestionsServiceImpl()

import Link from "next/link"

export const SearchNotFound = () => {
  return (
    <div className="bg-white p-8 text-center">
      <div className="text-gray-400 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No se encontraron productos
      </h3>
      <p className="text-gray-500 mb-4">
        Intenta con otros términos de búsqueda o filtros diferentes.
      </p>
      <Link
        href="/search"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Ver todos los productos
      </Link>
    </div>
  )
}

import Link from 'next/link'

export const SearchNotFound = () => {
  return (
    <div className="bg-white p-8 text-center">
      <div className="mb-4 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12"
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
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        No se encontraron productos
      </h3>
      <p className="mb-4 text-gray-500">
        Intenta con otros términos de búsqueda o filtros diferentes.
      </p>
      <Link
        href="/search"
        className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Ver todos los productos
      </Link>
    </div>
  )
}

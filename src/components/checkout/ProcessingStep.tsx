export default function ProcessingStep() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600"></div>
      <h2 className="mt-4 text-lg font-medium text-gray-900">
        Procesando tu pedido...
      </h2>
      <p className="mt-2 text-gray-600">
        Por favor espera mientras procesamos tu compra de forma segura.
      </p>
    </div>
  )
}
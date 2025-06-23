export const getGradientByType = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'cyber':
      return 'bg-gradient-to-r from-purple-600 via-purple-700 to-blue-800 text-white'
    case 'liquidacion':
      return 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white'
    case 'oferta':
      return 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white'
    case 'descuento':
      return 'bg-gradient-to-r from-green-500 via-green-600 to-green-700'
    default:
      return 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800'
  }
}

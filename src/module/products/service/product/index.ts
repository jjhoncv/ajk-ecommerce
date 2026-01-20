import { deleteProduct, getProductById, getProductsForAdmin, getProductWithAudit } from './product'

export type { ProductWithAudit } from './product'

const ProductService = {
  getProductsForAdmin,
  getProductById,
  getProductWithAudit,
  deleteProduct
}

export default ProductService

import { executeQuery } from '@/lib/db'

export interface DashboardMetrics {
  salesToday: number
  salesThisMonth: number
  pendingOrders: number
  newCustomersThisMonth: number
  lowStockProducts: number
  totalProducts: number
  totalOrders: number
}

export interface RecentOrder {
  id: number
  orderNumber: string
  customerName: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: Date
}

export interface LowStockProduct {
  id: number
  productId: number
  productName: string
  sku: string
  stock: number
  price: number
}

export interface TopSellingProduct {
  variantId: number
  productName: string
  sku: string
  totalSold: number
  revenue: number
}

class DashboardService {
  async getMetrics(): Promise<DashboardMetrics> {
    // Ventas de hoy (incluyendo comisión de procesamiento)
    const salesTodayResult = await executeQuery<Array<{ total: number }>>({
      query: `
        SELECT COALESCE(SUM(o.total_amount + COALESCE(pt.processing_fee, 0)), 0) as total
        FROM orders o
        LEFT JOIN payment_transactions pt ON o.id = pt.order_id
        WHERE DATE(o.created_at) = CURDATE()
        AND o.payment_status = 'paid'
      `
    })

    // Ventas del mes (incluyendo comisión de procesamiento)
    const salesMonthResult = await executeQuery<Array<{ total: number }>>({
      query: `
        SELECT COALESCE(SUM(o.total_amount + COALESCE(pt.processing_fee, 0)), 0) as total
        FROM orders o
        LEFT JOIN payment_transactions pt ON o.id = pt.order_id
        WHERE MONTH(o.created_at) = MONTH(CURDATE())
        AND YEAR(o.created_at) = YEAR(CURDATE())
        AND o.payment_status = 'paid'
      `
    })

    // Órdenes pendientes
    const pendingOrdersResult = await executeQuery<Array<{ count: number }>>({
      query: `
        SELECT COUNT(*) as count
        FROM orders
        WHERE status = 'pending' OR payment_status = 'pending'
      `
    })

    // Clientes nuevos este mes
    const newCustomersResult = await executeQuery<Array<{ count: number }>>({
      query: `
        SELECT COUNT(*) as count
        FROM customers
        WHERE MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
      `
    })

    // Productos con stock bajo (menos de 5)
    const lowStockResult = await executeQuery<Array<{ count: number }>>({
      query: `
        SELECT COUNT(*) as count
        FROM product_variants
        WHERE stock <= 5
      `
    })

    // Total de productos
    const totalProductsResult = await executeQuery<Array<{ count: number }>>({
      query: 'SELECT COUNT(*) as count FROM products'
    })

    // Total de órdenes
    const totalOrdersResult = await executeQuery<Array<{ count: number }>>({
      query: 'SELECT COUNT(*) as count FROM orders'
    })

    return {
      salesToday: Number(salesTodayResult[0]?.total ?? 0),
      salesThisMonth: Number(salesMonthResult[0]?.total ?? 0),
      pendingOrders: Number(pendingOrdersResult[0]?.count ?? 0),
      newCustomersThisMonth: Number(newCustomersResult[0]?.count ?? 0),
      lowStockProducts: Number(lowStockResult[0]?.count ?? 0),
      totalProducts: Number(totalProductsResult[0]?.count ?? 0),
      totalOrders: Number(totalOrdersResult[0]?.count ?? 0)
    }
  }

  async getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
    const orders = await executeQuery<
      Array<{
        id: number
        order_number: string
        customer_name: string
        total_amount: number
        processing_fee: number
        status: string
        payment_status: string
        created_at: Date
      }>
    >({
      query: `
        SELECT
          o.id,
          o.order_number,
          CONCAT(c.name, ' ', c.lastname) as customer_name,
          o.total_amount,
          COALESCE(pt.processing_fee, 0) as processing_fee,
          o.status,
          o.payment_status,
          o.created_at
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN payment_transactions pt ON o.id = pt.order_id
        ORDER BY o.created_at DESC
        LIMIT ?
      `,
      values: [limit]
    })

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      totalAmount: Number(order.total_amount) + Number(order.processing_fee),
      status: order.status,
      paymentStatus: order.payment_status,
      createdAt: order.created_at
    }))
  }

  async getLowStockProducts(limit: number = 5): Promise<LowStockProduct[]> {
    const products = await executeQuery<
      Array<{
        id: number
        product_id: number
        product_name: string
        sku: string
        stock: number
        price: number
      }>
    >({
      query: `
        SELECT
          pv.id,
          pv.product_id,
          p.name as product_name,
          pv.sku,
          pv.stock,
          pv.price
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE pv.stock <= 5
        ORDER BY pv.stock ASC
        LIMIT ?
      `,
      values: [limit]
    })

    return products.map((product) => ({
      id: product.id,
      productId: product.product_id,
      productName: product.product_name,
      sku: product.sku,
      stock: product.stock,
      price: Number(product.price)
    }))
  }

  async getTopSellingProducts(limit: number = 5): Promise<TopSellingProduct[]> {
    const products = await executeQuery<
      Array<{
        variant_id: number
        product_name: string
        sku: string
        total_sold: number
        revenue: number
      }>
    >({
      query: `
        SELECT
          oi.variant_id,
          oi.product_name,
          oi.variant_sku as sku,
          SUM(oi.quantity) as total_sold,
          SUM(oi.total_price) as revenue
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.payment_status = 'paid'
        GROUP BY oi.variant_id, oi.product_name, oi.variant_sku
        ORDER BY total_sold DESC
        LIMIT ?
      `,
      values: [limit]
    })

    return products.map((product) => ({
      variantId: product.variant_id,
      productName: product.product_name,
      sku: product.sku,
      totalSold: Number(product.total_sold),
      revenue: Number(product.revenue)
    }))
  }
}

const dashboardService = new DashboardService()
export default dashboardService

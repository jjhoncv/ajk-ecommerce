/**
 * Test data for Orders E2E tests
 *
 * Note: Orders are created by customers during checkout,
 * so this module is mostly read-only for admins.
 */

export const ORDER_STATUSES = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
}

export const PAYMENT_STATUSES = {
  pending: 'Pend.',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reemb.'
}

export const SCREENSHOTS_PATH = 'src/module/orders/e2e/screenshots'

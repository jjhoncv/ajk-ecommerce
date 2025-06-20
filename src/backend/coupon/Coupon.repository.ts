// 📄 backend/coupon/Coupon.repository.ts
import { executeQuery } from '@/lib/db'
import {
  Coupons as CouponRaw,
  CouponUsage as CouponUsageRaw
} from '@/types/database'

export class CouponRepository {
  // Obtener todos los cupones
  public async getCoupons(): Promise<CouponRaw[] | null> {
    const coupons = await executeQuery<CouponRaw[]>({
      query: 'SELECT * FROM coupons ORDER BY created_at DESC'
    })

    if (coupons.length === 0) return null
    return coupons
  }

  // Obtener cupones activos
  public async getActiveCoupons(): Promise<CouponRaw[] | null> {
    const coupons = await executeQuery<CouponRaw[]>({
      query: `
        SELECT * FROM coupons 
        WHERE is_active = 1 
        AND start_date <= NOW() 
        AND end_date >= NOW()
        ORDER BY created_at DESC
      `
    })

    if (coupons.length === 0) return null
    return coupons
  }

  // Obtener cupón por ID
  public async getCouponById(id: number): Promise<CouponRaw | null> {
    const coupons = await executeQuery<CouponRaw[]>({
      query: 'SELECT * FROM coupons WHERE id = ?',
      values: [id]
    })

    if (coupons.length === 0) return null
    return coupons[0]
  }

  // Obtener cupón por código
  public async getCouponByCode(code: string): Promise<CouponRaw | null> {
    const coupons = await executeQuery<CouponRaw[]>({
      query: 'SELECT * FROM coupons WHERE code = ?',
      values: [code]
    })

    if (coupons.length === 0) return null
    return coupons[0]
  }

  // Obtener cupones con estadísticas
  public async getCouponsWithStats(): Promise<any[] | null> {
    const results = await executeQuery<any[]>({
      query: `
        SELECT 
          c.*,
          COUNT(cu.id) as total_usages,
          COALESCE(SUM(cu.discount_amount), 0) as total_discount_amount,
          COUNT(DISTINCT cu.customer_id) as unique_customers,
          MAX(cu.used_at) as last_used
        FROM coupons c
        LEFT JOIN coupon_usage cu ON c.id = cu.coupon_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `
    })

    if (results.length === 0) return null
    return results
  }

  // Crear cupón
  public async createCoupon(
    couponData: Omit<CouponRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CouponRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO coupons SET ?',
      values: [couponData]
    })

    return await this.getCouponById(result.insertId)
  }

  // Actualizar cupón
  public async updateCoupon(
    couponData: Partial<Omit<CouponRaw, 'id' | 'created_at'>>,
    id: number
  ): Promise<CouponRaw | null> {
    await executeQuery({
      query: 'UPDATE coupons SET ?, updated_at = NOW() WHERE id = ?',
      values: [couponData, id]
    })

    return await this.getCouponById(id)
  }

  // Eliminar cupón
  public async deleteCoupon(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM coupons WHERE id = ?',
      values: [id]
    })
  }

  // Activar cupón
  public async activateCoupon(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE coupons SET is_active = 1, updated_at = NOW() WHERE id = ?',
      values: [id]
    })
  }

  // Desactivar cupón
  public async deactivateCoupon(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE coupons SET is_active = 0, updated_at = NOW() WHERE id = ?',
      values: [id]
    })
  }

  // Incrementar contador de uso
  public async incrementUsageCount(id: number): Promise<void> {
    await executeQuery({
      query:
        'UPDATE coupons SET used_count = COALESCE(used_count, 0) + 1, updated_at = NOW() WHERE id = ?',
      values: [id]
    })
  }

  // Obtener uso de cupón por customer
  public async getCouponUsageByCustomer(
    couponId: number,
    customerId: number
  ): Promise<number> {
    const results = await executeQuery<Array<{ usage_count: number }>>({
      query: `
        SELECT COUNT(*) as usage_count 
        FROM coupon_usage 
        WHERE coupon_id = ? AND customer_id = ?
      `,
      values: [couponId, customerId]
    })

    return results[0]?.usage_count || 0
  }

  // Registrar uso de cupón
  public async createCouponUsage(
    usageData: Omit<CouponUsageRaw, 'id'>
  ): Promise<CouponUsageRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO coupon_usage SET ?',
      values: [usageData]
    })

    const created = await executeQuery<CouponUsageRaw[]>({
      query: 'SELECT * FROM coupon_usage WHERE id = ?',
      values: [result.insertId]
    })

    return created.length > 0 ? created[0] : null
  }

  // Obtener estadísticas generales
  public async getCouponStats(): Promise<any | null> {
    const results = await executeQuery<any[]>({
      query: `
        SELECT 
          COUNT(*) as total_coupons,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_coupons,
          COUNT(CASE WHEN end_date < NOW() THEN 1 END) as expired_coupons,
          (SELECT COUNT(*) FROM coupon_usage) as total_usages,
          (SELECT COALESCE(SUM(discount_amount), 0) FROM coupon_usage) as total_discount_given
        FROM coupons
      `
    })

    return results.length > 0 ? results[0] : null
  }

  // Obtener cupones por filtros
  public async getCouponsByFilters(filters: {
    isActive?: boolean
    discountType?: string
    applicableTo?: string
    isExpired?: boolean
  }): Promise<CouponRaw[] | null> {
    let query = 'SELECT * FROM coupons WHERE 1=1'
    const values: any[] = []

    if (filters.isActive !== undefined) {
      query += ' AND is_active = ?'
      values.push(filters.isActive ? 1 : 0)
    }

    if (filters.discountType) {
      query += ' AND discount_type = ?'
      values.push(filters.discountType)
    }

    if (filters.applicableTo) {
      query += ' AND applicable_to = ?'
      values.push(filters.applicableTo)
    }

    if (filters.isExpired !== undefined) {
      if (filters.isExpired) {
        query += ' AND end_date < NOW()'
      } else {
        query += ' AND end_date >= NOW()'
      }
    }

    query += ' ORDER BY created_at DESC'

    const coupons = await executeQuery<CouponRaw[]>({
      query,
      values: values.length > 0 ? values : undefined
    })

    if (coupons.length === 0) return null
    return coupons
  }

  // Obtener usos de un cupón específico
  public async getCouponUsages(
    couponId: number
  ): Promise<CouponUsageRaw[] | null> {
    const usages = await executeQuery<CouponUsageRaw[]>({
      query: `
        SELECT cu.*, c.name as customer_name, c.email as customer_email
        FROM coupon_usage cu
        LEFT JOIN customers c ON cu.customer_id = c.id
        WHERE cu.coupon_id = ?
        ORDER BY cu.used_at DESC
      `,
      values: [couponId]
    })

    if (usages.length === 0) return null
    return usages
  }

  // Verificar si un código ya existe
  public async codeExists(code: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM coupons WHERE code = ?'
    const values: any[] = [code]

    if (excludeId) {
      query += ' AND id != ?'
      values.push(excludeId)
    }

    const results = await executeQuery<Array<{ count: number }>>({
      query,
      values
    })

    return results[0].count > 0
  }
}

const oCouponRep = new CouponRepository()
export default oCouponRep

import { executeQuery } from '@/lib/db'
import { type Customers as CustomerRaw } from '@/types/database'

export interface CustomerWithStats extends CustomerRaw {
  orders_count: number
  total_spent: number
  addresses_count: number
  last_order_date: string | null
}

export class CustomerRepository {
  public async getCustomerByEmail(email: string): Promise<CustomerRaw | null> {
    const customers = await executeQuery<CustomerRaw[]>({
      query: 'SELECT * FROM customers WHERE email = ?',
      values: [email]
    })

    if (customers.length === 0) return null
    return customers[0]
  }

  public async getCustomers(): Promise<CustomerRaw[] | null> {
    const customers = await executeQuery<CustomerRaw[]>({
      query: 'SELECT * FROM customers'
    })

    if (customers.length === 0) return null
    return customers
  }

  public async getCustomersWithStats(): Promise<CustomerWithStats[] | null> {
    const customers = await executeQuery<CustomerWithStats[]>({
      query: `
        SELECT
          c.*,
          COALESCE(o.orders_count, 0) as orders_count,
          COALESCE(o.total_spent, 0) as total_spent,
          COALESCE(a.addresses_count, 0) as addresses_count,
          o.last_order_date
        FROM customers c
        LEFT JOIN (
          SELECT
            customer_id,
            COUNT(*) as orders_count,
            SUM(total_amount) as total_spent,
            MAX(created_at) as last_order_date
          FROM orders
          WHERE status != 'cancelled'
          GROUP BY customer_id
        ) o ON c.id = o.customer_id
        LEFT JOIN (
          SELECT
            id_customer,
            COUNT(*) as addresses_count
          FROM customers_addresses
          GROUP BY id_customer
        ) a ON c.id = a.id_customer
        ORDER BY c.created_at DESC
      `
    })

    if (customers.length === 0) return null
    return customers
  }

  public async getCustomerWithStats(id: number): Promise<CustomerWithStats | null> {
    const customers = await executeQuery<CustomerWithStats[]>({
      query: `
        SELECT
          c.*,
          COALESCE(o.orders_count, 0) as orders_count,
          COALESCE(o.total_spent, 0) as total_spent,
          COALESCE(a.addresses_count, 0) as addresses_count,
          o.last_order_date
        FROM customers c
        LEFT JOIN (
          SELECT
            customer_id,
            COUNT(*) as orders_count,
            SUM(total_amount) as total_spent,
            MAX(created_at) as last_order_date
          FROM orders
          WHERE status != 'cancelled'
          GROUP BY customer_id
        ) o ON c.id = o.customer_id
        LEFT JOIN (
          SELECT
            id_customer,
            COUNT(*) as addresses_count
          FROM customers_addresses
          GROUP BY id_customer
        ) a ON c.id = a.id_customer
        WHERE c.id = ?
      `,
      values: [id]
    })

    if (customers.length === 0) return null
    return customers[0]
  }

  public async getCustomer(id: number): Promise<CustomerRaw | null> {
    const customers = await executeQuery<CustomerRaw[]>({
      query: 'SELECT * FROM customers WHERE id = ?',
      values: [id]
    })

    if (customers.length === 0) return null
    return customers[0]
  }

  public async createCustomer(
    customer: Omit<CustomerRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<CustomerRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO customers SET ?',
      values: [customer]
    })

    return await this.getCustomer(result.insertId)
  }

  public async updateCustomer(
    customerData: Partial<CustomerRaw>,
    id: number
  ): Promise<CustomerRaw | null> {
    await executeQuery({
      query: 'UPDATE customers SET ? WHERE id=?',
      values: [customerData, id]
    })

    return await this.getCustomer(id)
  }

  public async deleteCustomer(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM customers WHERE id=?',
      values: [id]
    })
  }
}

const customerRepository = new CustomerRepository()
export default customerRepository

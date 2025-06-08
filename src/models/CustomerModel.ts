import { executeQuery } from "../lib/db";
import { customers as CustomersRaw } from "@/types/database"
export class CustomerModel {
  public async getCustomerByEmail(email: string): Promise<CustomersRaw | null> {
    const customers = await executeQuery<CustomersRaw[]>({
      query: "SELECT * FROM customers WHERE email = ?",
      values: [email],
    });

    if (customers.length === 0) return null;

    const customer = await this.getCustomer(customers[0].id);
    return customer;
  }

  public async getCustomers(): Promise<CustomersRaw[] | null> {
    const customers = await executeQuery<CustomersRaw[]>({
      query: "SELECT * FROM customers",
    });
    
    if (customers.length === 0) return null;

    const customersWithData = (
      await Promise.all(
        customers.map((customer) => this.getCustomer(customer.id))
      )
    ).filter(Boolean) as CustomersRaw[];

    return customersWithData;
  }

  public async getCustomer(id: number): Promise<CustomersRaw | null> {
    const customers = await executeQuery<CustomersRaw[]>({
      query: "SELECT * FROM customers WHERE id = ?",
      values: [id],
    });

    if (customers.length === 0) return null;
    const customer = customers[0];

    return customer
  }

  public async createCustomer(
    customer: Omit<CustomersRaw, "id" | "created_at" | "updated_at" | "role">
  ): Promise<CustomersRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO customers SET ?",
      values: [customer],
    });

    return (await this.getCustomer(result.insertId));
  }

  public async updateCustomer(
    customerData: Partial<CustomersRaw>,
    id: number
  ): Promise<CustomersRaw | null> {
    await executeQuery({
      query: "UPDATE customers SET ? WHERE id=?",
      values: [customerData, id],
    });

    return (await this.getCustomer(id));
  }
}

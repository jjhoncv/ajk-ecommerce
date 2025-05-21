import { Customer } from "../interfaces/customer";
import { executeQuery } from "../lib/db";
import { AddressModel } from "./AddressModel";

export class CustomerModel {
  public async getCustomerByEmail(email: string): Promise<Customer | null> {
    const customers = await executeQuery<Customer[]>({
      query: "SELECT * FROM customers WHERE email = ?",
      values: [email],
    });

    if (customers.length === 0) return null;

    const customer = await this.getCustomer(customers[0].id);
    return customer;
  }

  public async getCustomers(): Promise<Customer[]> {
    const customers = await executeQuery<Customer[]>({
      query: "SELECT * FROM customers",
    });

    const customersWithData = (
      await Promise.all(
        customers.map((customer) => this.getCustomer(customer.id))
      )
    ).filter(Boolean) as Customer[];

    return customersWithData;
  }

  public async getCustomer(id: string): Promise<Customer | null> {
    const customers = await executeQuery<Customer[]>({
      query: "SELECT * FROM customers WHERE id = ?",
      values: [id],
    });

    if (customers.length === 0) return null;
    const customer = customers[0];

    const oaddress = new AddressModel();

    return {
      ...customer,
      address: await oaddress.getAddressByCustomer(customer.id),
    };
  }

  public async createCustomer(
    customer: Omit<Customer, "id" | "created_at" | "updated_at" | "role">
  ): Promise<Customer> {
    const result = await executeQuery<{ insertId: string }>({
      query: "INSERT INTO customers SET ?",
      values: [customer],
    });

    return (await this.getCustomer(result.insertId)) as Customer;
  }

  public async updateCustomer(
    customerData: Partial<Customer>,
    id: string
  ): Promise<Customer> {
    await executeQuery({
      query: "UPDATE customers SET ? WHERE id=?",
      values: [customerData, id],
    });

    return (await this.getCustomer(id)) as Customer;
  }
}

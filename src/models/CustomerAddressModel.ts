import { executeQuery } from "../lib/db";
import { customers_addresses as CustomersAddressRaw } from "@/types/database"

export class CustomerAddressModel {
  public async getAddress(id: number): Promise<CustomersAddressRaw | null> {
    const addresses = await executeQuery<CustomersAddressRaw[]>({
      query: "SELECT * FROM customers_addresses WHERE id = ?",
      values: [id],
    });

    if (addresses.length === 0) return null;
    return addresses[0];
  }

  public async getAddressByCustomer(id: number): Promise<CustomersAddressRaw[] | null> {
    const addresses = await executeQuery<CustomersAddressRaw[]>({
      query: "SELECT * FROM customers_addresses WHERE id_customer = ?",
      values: [id],
    });

    if (addresses.length === 0) return null;
    return addresses;
  }

  public async getAddresses(): Promise<CustomersAddressRaw[] | null> {
    const addresses = await executeQuery<CustomersAddressRaw[]>({
      query: "SELECT * FROM customers_addresses",
    });

    if (addresses.length === 0) return null;
    return addresses;
  }

  public async createAddress(
    address: Omit<CustomersAddressRaw, "id" | "created_at" | "updated_at">
  ): Promise<CustomersAddressRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO customers_addresses SET ?",
      values: [address],
    });

    return (await this.getAddress(result.insertId));
  }

  public async updateAddress(
    addressData: Omit<CustomersAddressRaw, "id" | "created_at" | "updated_at">,
    id: number
  ): Promise<CustomersAddressRaw | null> {
    await executeQuery({
      query: "UPDATE customers_addresses SET ? WHERE id=?",
      values: [addressData, id],
    });

    return (await this.getAddress(id));
  }

  public async deleteAddress(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM customers_addresses WHERE id=?",
      values: [id],
    });
  }
}

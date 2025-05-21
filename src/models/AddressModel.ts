import { Address } from "../interfaces/address";
import { executeQuery } from "../lib/db";

export class AddressModel {
  public async getAddress(id: string): Promise<Address | null> {
    const addresses = await executeQuery<Address[]>({
      query: "SELECT * FROM customers_addresses WHERE id = ?",
      values: [id],
    });

    if (addresses.length === 0) return null;
    return addresses[0];
  }

  public async getAddressByCustomer(id: string): Promise<Address | undefined> {
    const addresses = await executeQuery<Address[]>({
      query: "SELECT * FROM customers_addresses WHERE id_customer = ?",
      values: [id],
    });

    if (addresses.length === 0) return undefined;
    return addresses[0];
  }

  public async getAddresses(): Promise<Address[]> {
    const addresses = await executeQuery<Address[]>({
      query: "SELECT * FROM customers_addresses",
    });

    return addresses;
  }

  public async createAddress(
    address: Omit<Address, "id" | "created_at" | "updated_at">
  ): Promise<Address> {
    const result = await executeQuery<{ insertId: string }>({
      query: "INSERT INTO customers_addresses SET ?",
      values: [address],
    });

    return (await this.getAddress(result.insertId)) as Address;
  }

  public async updateAddress(
    addressData: Partial<Address>,
    id: string
  ): Promise<Address> {
    await executeQuery({
      query: "UPDATE customers_addresses SET ? WHERE id=?",
      values: [addressData, id],
    });

    return (await this.getAddress(id)) as Address;
  }

  public async deleteAddress(id: string): Promise<void> {
    await executeQuery({
      query: "DELETE FROM customers_addresses WHERE id=?",
      values: [id],
    });
  }
}

import { Brand } from "@/interfaces/models";
import { BrandDTO } from "@/dto";
import { executeQuery } from "@/lib/db";

export class BrandModel {
  public async getBrands(): Promise<BrandDTO[]> {
    const brands = await executeQuery<Brand[]>({
      query: "SELECT * FROM brands",
    });

    return brands;
  }

  public async getBrandById(id: number): Promise<BrandDTO | null> {
    const brands = await executeQuery<Brand[]>({
      query: "SELECT * FROM brands WHERE id = ?",
      values: [id],
    });

    if (brands.length === 0) return null;
    return brands[0];
  }

  public async createBrand(brand: Omit<Brand, "id">): Promise<BrandDTO> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO brands SET ?",
      values: [brand],
    });

    return (await this.getBrandById(result.insertId)) as Brand;
  }

  public async updateBrand(
    brandData: Partial<Brand>,
    id: number
  ): Promise<BrandDTO> {
    await executeQuery({
      query: "UPDATE brands SET ? WHERE id=?",
      values: [brandData, id],
    });

    return (await this.getBrandById(id)) as Brand;
  }

  public async deleteBrand(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM brands WHERE id=?",
      values: [id],
    });
  }
}

export default new BrandModel();

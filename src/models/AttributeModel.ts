import { executeQuery } from "@/lib/db";
import { attributes as AttributeRaw, attribute_options as AttributeOptionRaw } from "@/types/database"

export interface AttributeRawWithOption extends AttributeRaw {
  options: AttributeOptionRaw[] | null
} 

export class AttributeModel {
  public async getAttributes(): Promise<AttributeRawWithOption[]> {
    const attributes = await executeQuery<AttributeRaw[]>({
      query: "SELECT * FROM attributes",
    });

    // Para cada atributo, obtener sus opciones
    return await Promise.all(
      attributes.map(async (attribute) => {
        const options = await this.getAttributeOptions(attribute.id);
        return {
          ...attribute,
          options,
        };
      })
    );
  }

  public async getAttributeById(id: number): Promise<AttributeRawWithOption | null> {
    const attributes = await executeQuery<AttributeRaw[]>({
      query: "SELECT * FROM attributes WHERE id = ?",
      values: [id],
    });

    if (attributes.length === 0) return null;

    // Obtener las opciones del atributo
    const options = await this.getAttributeOptions(attributes[0].id);

    return {
      ...attributes[0],
      options,
    };
  }

  public async getAttributeOptions(
    attributeId: number
  ): Promise<AttributeOptionRaw[] | null> {
    const options = await executeQuery<AttributeOptionRaw[]>({
      query:
        "SELECT id, attribute_id as attributeId, value, additional_cost FROM attribute_options WHERE attribute_id = ?",
      values: [attributeId],
    });

    if (options.length === 0) return null

    return options;
  }

  public async createAttribute(
    attribute: Omit<AttributeRaw, "id">
  ): Promise<AttributeRaw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO attributes SET ?",
      values: [attribute],
    });

    return (await this.getAttributeById(result.insertId));
  }

  public async updateAttribute(
    attributeData: Omit<AttributeRaw, "id">,
    id: number
  ): Promise<AttributeRaw | null> {
    await executeQuery({
      query: "UPDATE attributes SET ? WHERE id=?",
      values: [attributeData, id],
    });

    return (await this.getAttributeById(id));
  }

  public async deleteAttribute(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM attributes WHERE id=?",
      values: [id],
    });
  }

  public async createAttributeOption(
    option: Omit<AttributeOptionRaw, "id">
  ): Promise<AttributeOptionRaw> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO attribute_options SET ?",
      values: [option],
    });

    const options = await executeQuery<AttributeOptionRaw[]>({
      query: "SELECT * FROM attribute_options WHERE id = ?",
      values: [result.insertId],
    });

    return options[0];
  }

  public async updateAttributeOption(
    optionData: Partial<AttributeOptionRaw>,
    id: number
  ): Promise<AttributeOptionRaw> {
    await executeQuery({
      query: "UPDATE attribute_options SET ? WHERE id=?",
      values: [optionData, id],
    });

    const options = await executeQuery<AttributeOptionRaw[]>({
      query: "SELECT * FROM attribute_options WHERE id = ?",
      values: [id],
    });

    return options[0];
  }

  public async deleteAttributeOption(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM attribute_options WHERE id=?",
      values: [id],
    });
  }
}

const attributeModel = new AttributeModel();
export default attributeModel;

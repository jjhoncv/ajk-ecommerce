import { Attribute, AttributeOption } from "@/interfaces/models";
import { AttributeDTO } from "@/dto";
import { executeQuery } from "@/lib/db";

export class AttributeModel {
  public async getAttributes(): Promise<AttributeDTO[]> {
    const attributes = await executeQuery<Attribute[]>({
      query: "SELECT * FROM attributes",
    });

    // Para cada atributo, obtener sus opciones
    const attributesWithOptions = await Promise.all(
      attributes.map(async (attribute) => {
        const options = await this.getAttributeOptions(attribute.id);
        return {
          ...attribute,
          options,
        };
      })
    );

    // Convertir de Attribute a AttributeDTO
    return attributesWithOptions.map((attr) => ({
      id: attr.id,
      name: attr.name,
      display_type: attr.display_type,
      options: attr.options || [],
    }));
  }

  public async getAttributeById(id: number): Promise<Attribute | null> {
    const attributes = await executeQuery<Attribute[]>({
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
  ): Promise<AttributeOption[]> {
    const options = await executeQuery<AttributeOption[]>({
      query:
        "SELECT id, attribute_id as attributeId, value, additional_cost FROM attribute_options WHERE attribute_id = ?",
      values: [attributeId],
    });

    return options;
  }

  public async createAttribute(
    attribute: Omit<Attribute, "id" | "options">
  ): Promise<Attribute> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO attributes SET ?",
      values: [attribute],
    });

    return (await this.getAttributeById(result.insertId)) as Attribute;
  }

  public async updateAttribute(
    attributeData: Partial<Omit<Attribute, "options">>,
    id: number
  ): Promise<Attribute> {
    await executeQuery({
      query: "UPDATE attributes SET ? WHERE id=?",
      values: [attributeData, id],
    });

    return (await this.getAttributeById(id)) as Attribute;
  }

  public async deleteAttribute(id: number): Promise<void> {
    await executeQuery({
      query: "DELETE FROM attributes WHERE id=?",
      values: [id],
    });
  }

  public async createAttributeOption(
    option: Omit<AttributeOption, "id">
  ): Promise<AttributeOption> {
    const result = await executeQuery<{ insertId: number }>({
      query: "INSERT INTO attribute_options SET ?",
      values: [option],
    });

    const options = await executeQuery<AttributeOption[]>({
      query: "SELECT * FROM attribute_options WHERE id = ?",
      values: [result.insertId],
    });

    return options[0];
  }

  public async updateAttributeOption(
    optionData: Partial<AttributeOption>,
    id: number
  ): Promise<AttributeOption> {
    await executeQuery({
      query: "UPDATE attribute_options SET ? WHERE id=?",
      values: [optionData, id],
    });

    const options = await executeQuery<AttributeOption[]>({
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

export default new AttributeModel();

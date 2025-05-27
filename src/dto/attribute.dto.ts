// DTO para atributos

// DTO para atributos
export interface AttributeDTO {
  id: number;
  name: string;
  options: AttributeOptionDTO[];
}

// DTO para opciones de atributos
export interface AttributeOptionDTO {
  id: number;
  attributeId: number;
  value: string;
}

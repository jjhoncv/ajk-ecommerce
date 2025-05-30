// DTO para atributos

// Tipos de visualización de atributos
export type AttributeDisplayType =
  | "radio"
  | "pills"
  | "select"
  | "color"
  | "custom";

// DTO para atributos
export interface AttributeDTO {
  id: number;
  name: string;
  display_type?: AttributeDisplayType;
  options: AttributeOptionDTO[];
}

// DTO para opciones de atributos
export interface AttributeOptionDTO {
  id: number;
  attributeId: number;
  value: string;
  additional_cost?: number;
}

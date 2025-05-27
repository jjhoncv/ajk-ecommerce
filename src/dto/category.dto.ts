// DTO para categorías

// DTO para categorías
export interface CategoryDTO {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  imageUrl: string | null;
  children?: CategoryDTO[];
}
